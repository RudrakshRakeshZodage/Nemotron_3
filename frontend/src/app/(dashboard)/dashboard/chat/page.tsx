'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Copy, RotateCcw, Mic, MicOff, Trash2, Save, Plus, ChevronDown, Check, Zap } from 'lucide-react'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { streamChat, saveProject } from '@/lib/api'
import { copyToClipboard } from '@/lib/utils'
import { saveLocalProject } from '@/lib/projectsStore'

interface Message { id: string; role: 'user' | 'assistant'; content: string; tokens?: number }

const models = [
  { id: 'nvidia/llama-3.1-nemotron-70b-instruct', label: 'Nemotron 70B', badge: 'BEST' },
  { id: 'nvidia/llama-3.1-nemotron-8b-instruct', label: 'Nemotron 8B', badge: 'FAST' },
  { id: 'nvidia/llama-3.1-nemotron-nano-8b-v1', label: 'Nemotron Nano', badge: 'LITE' },
  { id: 'openrouter/nvidia-nemotron-3-nano-30b-a3b', label: 'Nemotron Nano 30B', badge: 'FREE' },
]

const suggestions = [
  'Explain NVIDIA Nemotron 3 architecture',
  'Write a Python async web scraper',
  'Compare Transformer vs Mamba architectures',
  'Generate a React component for a dashboard',
]

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [model, setModel] = useState(models[0].id)
  const [showModelPicker, setShowModelPicker] = useState(false)
  const [listening, setListening] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<any>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSaveProject = async () => {
    if (messages.length === 0 || saving) return
    setSaving(true)
    try {
      const firstMsg = messages.find(m => m.role === 'user')?.content || 'Chat Session'
      const title = firstMsg.length > 30 ? firstMsg.substring(0, 30) + '...' : firstMsg
      const description = `AI Chat Session exploring ${selectedModel.label} with ${messages.length} messages.`
      const content = messages.map(m => `### ${m.role === 'user' ? 'User' : 'Assistant'}\n\n${m.content}\n`).join('\n')
      
      saveLocalProject({
        title,
        description,
        type: 'chat',
        content
      })

      try {
        await saveProject({
          user_id: 'user_123',
          title,
          description,
          content,
          type: 'chat'
        })
      } catch (err) {
        console.warn('Backend save bypassed:', err)
      }

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (e) {
      console.error(e)
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const sendMessage = async (content?: string) => {
    const text = content || input.trim()
    if (!text || loading) return
    setInput('')

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text }
    const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: '' }
    setMessages(prev => [...prev, userMsg, aiMsg])
    setLoading(true)

    try {
      const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }))
      let full = ''
      for await (const chunk of streamChat(history, model)) {
        full += chunk
        setMessages(prev => prev.map(m => m.id === aiMsg.id ? { ...m, content: full } : m))
      }
    } catch (e) {
      setMessages(prev => prev.map(m => m.id === aiMsg.id ? { ...m, content: '⚠️ Error connecting to API. Make sure the backend is running on port 8000.' } : m))
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const handleCopy = (id: string, content: string) => {
    copyToClipboard(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleRegenerate = () => {
    const lastUser = [...messages].reverse().find(m => m.role === 'user')
    if (lastUser) {
      setMessages(prev => prev.slice(0, -1))
      sendMessage(lastUser.content)
    }
  }

  const toggleVoice = () => {
    if (typeof window === 'undefined') return
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) { alert('Voice input not supported in this browser.'); return }
    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
    } else {
      const rec = new SR()
      rec.continuous = false; rec.interimResults = false; rec.lang = 'en-US'
      rec.onresult = (e: any) => setInput(e.results[0][0].transcript)
      rec.onend = () => setListening(false)
      rec.start(); recognitionRef.current = rec; setListening(true)
    }
  }

  const selectedModel = models.find(m => m.id === model)!

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div style={{ padding: '16px 28px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(118,185,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={18} color="var(--nemo-green)" />
          </div>
          <div>
            <h1 style={{ fontWeight: 700, fontSize: '1rem' }}>AI Chat</h1>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{messages.length} messages</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Model picker */}
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowModelPicker(!showModelPicker)} className="btn-secondary" style={{ fontSize: '0.78rem', padding: '7px 12px', gap: 6 }}>
              <Zap size={12} color="var(--nemo-green)" />
              {selectedModel.label}
              <span style={{ fontSize: '0.6rem', background: 'rgba(118,185,0,0.15)', color: 'var(--nemo-green)', padding: '1px 5px', borderRadius: 4, fontWeight: 700 }}>{selectedModel.badge}</span>
              <ChevronDown size={11} />
            </button>
            <AnimatePresence>
              {showModelPicker && (
                <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                  style={{ position: 'absolute', top: '100%', right: 0, marginTop: 6, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 10, overflow: 'hidden', zIndex: 20, minWidth: 200 }}>
                  {models.map(m => (
                    <button key={m.id} onClick={() => { setModel(m.id); setShowModelPicker(false) }} className="btn-ghost"
                      style={{ width: '100%', justifyContent: 'flex-start', borderRadius: 0, padding: '10px 14px', gap: 8, background: m.id === model ? 'rgba(118,185,0,0.08)' : 'transparent' }}>
                      {m.id === model && <Check size={12} color="var(--nemo-green)" />}
                      {m.label}
                      <span style={{ fontSize: '0.65rem', background: 'rgba(118,185,0,0.1)', color: 'var(--nemo-green)', padding: '1px 6px', borderRadius: 4, fontWeight: 700, marginLeft: 'auto' }}>{m.badge}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button onClick={handleSaveProject} className="btn-ghost" style={{ color: saved ? 'var(--nemo-green)' : 'inherit' }} title="Save chat to projects" disabled={messages.length === 0 || saving}>
            {saved ? <Check size={15} /> : <Save size={15} />}
          </button>
          <button onClick={() => setMessages([])} className="btn-ghost" title="New chat"><Plus size={16} /></button>
          <button onClick={() => { setMessages([]); }} className="btn-ghost" title="Clear"><Trash2 size={15} /></button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 24 }}>
            <div style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg, rgba(118,185,0,0.2), rgba(0,212,255,0.1))', border: '2px solid rgba(118,185,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(118,185,0,0.15)' }}>
              <Bot size={32} color="var(--nemo-green)" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontWeight: 700, fontSize: '1.3rem', marginBottom: 6 }}>How can I help you today?</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Powered by NVIDIA Nemotron 3 · {selectedModel.label}</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, maxWidth: 560, width: '100%' }}>
              {suggestions.map(s => (
                <motion.button key={s} whileHover={{ scale: 1.02 }} onClick={() => sendMessage(s)}
                  style={{ padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 10, color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', lineHeight: 1.4 }}>
                  {s}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {messages.map((msg, i) => (
          <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {/* Role label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {msg.role === 'assistant' && (
                <div style={{ width: 24, height: 24, borderRadius: 6, background: 'linear-gradient(135deg, #76b900, #a3e635)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(118,185,0,0.3)' }}>
                  <Bot size={13} color="#000" />
                </div>
              )}
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>{msg.role === 'user' ? 'You' : 'Nemotron 3'}</span>
              {msg.role === 'user' && (
                <div style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={13} color="var(--text-secondary)" />
                </div>
              )}
            </div>

            <div className={msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}>
              {msg.role === 'user'
                ? <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>{msg.content}</p>
                : msg.content
                  ? <MarkdownRenderer content={msg.content} />
                  : <div className="loading-dots" style={{ display: 'flex', gap: 4, padding: '4px 0' }}><span /><span /><span /></div>
              }
            </div>

            {/* Actions */}
            {msg.role === 'assistant' && msg.content && (
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => handleCopy(msg.id, msg.content)} className="btn-ghost" style={{ fontSize: '0.72rem', padding: '3px 8px', gap: 4 }}>
                  {copiedId === msg.id ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
                </button>
                {i === messages.length - 1 && (
                  <button onClick={handleRegenerate} className="btn-ghost" style={{ fontSize: '0.72rem', padding: '3px 8px', gap: 4 }}>
                    <RotateCcw size={11} /> Regenerate
                  </button>
                )}
              </div>
            )}
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ padding: '16px 28px 24px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-secondary)', flexShrink: 0 }}>
        <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, background: 'var(--bg-input)', border: `1px solid ${loading ? 'var(--border-accent)' : 'var(--border-color)'}`, borderRadius: 14, padding: '10px 14px', transition: 'border-color 0.2s', boxShadow: loading ? 'var(--shadow-glow)' : 'none' }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Nemotron anything… (Shift+Enter for new line)"
              rows={1}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', resize: 'none', color: 'var(--text-primary)', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif', lineHeight: 1.6, maxHeight: 160, overflowY: 'auto' }}
              onInput={e => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 160) + 'px' }}
            />
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <button onClick={toggleVoice} className="btn-ghost" style={{ padding: 8, color: listening ? '#ef4444' : 'var(--text-muted)' }} title="Voice input">
                {listening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => sendMessage()} disabled={!input.trim() || loading}
                style={{ width: 36, height: 36, borderRadius: 9, background: input.trim() && !loading ? 'linear-gradient(135deg, #76b900, #a3e635)' : 'rgba(255,255,255,0.08)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() && !loading ? 'pointer' : 'default', transition: 'all 0.2s', boxShadow: input.trim() && !loading ? '0 4px 12px rgba(118,185,0,0.4)' : 'none' }}
              >
                <Send size={15} color={input.trim() && !loading ? '#000' : 'var(--text-muted)'} />
              </motion.button>
            </div>
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>
            Powered by <span style={{ color: 'var(--nemo-green)' }}>NVIDIA Nemotron 3</span> · Responses may not always be accurate
          </p>
        </div>
      </div>
    </div>
  )
}
