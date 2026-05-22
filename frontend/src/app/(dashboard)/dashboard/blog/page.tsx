'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Loader2, Download, Copy, Check, Sparkles, ChevronDown, Save } from 'lucide-react'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { generateBlog, saveProject } from '@/lib/api'
import { downloadMarkdown, copyToClipboard } from '@/lib/utils'
import { saveLocalProject } from '@/lib/projectsStore'

const tones = ['professional', 'casual', 'technical', 'inspirational', 'humorous']
const lengths = ['short', 'medium', 'long']

const topicSuggestions = [
  'NVIDIA Nemotron 3: The Future of Agentic AI',
  'How GPU Acceleration is Changing Deep Learning',
  'Mixture of Experts: Why Sparse Models Win',
  'Building Production AI Agents in 2026',
]

export default function BlogPage() {
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('professional')
  const [length, setLength] = useState('medium')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ title: string; content: string; word_count: number } | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const generate = async () => {
    if (!topic.trim() || loading) return
    setLoading(true); setError(''); setResult(null)
    try {
      const data = await generateBlog(topic, tone, length)
      setResult(data)
    } catch {
      setError('Failed to generate blog. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (!result) return
    copyToClipboard(result.content)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!result || saving) return
    setSaving(true)
    try {
      saveLocalProject({
        title: result.title,
        description: `SEO-optimized blog about: ${topic.substring(0, 60)}${topic.length > 60 ? '...' : ''}`,
        type: 'blog',
        content: result.content
      })

      try {
        await saveProject({
          user_id: 'user_123',
          title: result.title,
          description: `SEO-optimized blog about: ${topic.substring(0, 60)}${topic.length > 60 ? '...' : ''}`,
          content: result.content,
          type: 'blog'
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

  return (
    <div className="dashboard-page-container" style={{ maxWidth: 1100 }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={20} color="#7c3aed" />
          </div>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.03em' }}>Blog Generator</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Generate SEO-optimized blogs with Nemotron 3</p>
          </div>
        </div>
      </motion.div>

      <div className={result ? "grid-blog-layout-result" : ""} style={{ display: 'grid', gridTemplateColumns: result ? undefined : '1fr', gap: 24, transition: 'all 0.5s' }}>
        {/* Controls */}
        <motion.div layout className="glass-card" style={{ padding: 28, alignSelf: 'start' }}>
          <div style={{ marginBottom: 20 }}>
            <label className="form-label">Blog Topic</label>
            <textarea
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. NVIDIA Nemotron 3 and the future of AI agents…"
              rows={4}
              style={{ width: '100%', padding: '12px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 10, color: 'var(--text-primary)', fontSize: '0.875rem', fontFamily: 'Inter, sans-serif', resize: 'none', outline: 'none', transition: 'border-color 0.2s', lineHeight: 1.6 }}
              onFocus={e => e.target.style.borderColor = '#7c3aed'} onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
            />
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
              {topicSuggestions.map(s => (
                <button key={s} onClick={() => setTopic(s)} className="btn-ghost" style={{ fontSize: '0.7rem', padding: '3px 8px', border: '1px solid var(--border-color)', borderRadius: 100 }}>
                  {s.length > 30 ? s.slice(0, 30) + '…' : s}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label className="form-label">Tone</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {tones.map(t => (
                <button key={t} onClick={() => setTone(t)} style={{ padding: '6px 14px', fontSize: '0.78rem', fontWeight: 500, borderRadius: 100, border: `1px solid ${tone === t ? '#7c3aed' : 'var(--border-color)'}`, background: tone === t ? 'rgba(124,58,237,0.15)' : 'transparent', color: tone === t ? '#7c3aed' : 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.15s', textTransform: 'capitalize' }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label className="form-label">Length</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {lengths.map(l => (
                <button key={l} onClick={() => setLength(l)} style={{ flex: 1, padding: '8px', fontSize: '0.8rem', fontWeight: 500, borderRadius: 8, border: `1px solid ${length === l ? '#7c3aed' : 'var(--border-color)'}`, background: length === l ? 'rgba(124,58,237,0.15)' : 'transparent', color: length === l ? '#7c3aed' : 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.15s', textTransform: 'capitalize' }}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {error && <p style={{ color: '#f87171', fontSize: '0.8rem', marginBottom: 16 }}>{error}</p>}

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={generate} disabled={!topic.trim() || loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', opacity: loading ? 0.7 : 1 }}>
            {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Generating…</> : <><Sparkles size={16} /> Generate Blog</>}
          </motion.button>
        </motion.div>

        {/* Output */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="glass-card" style={{ padding: 32 }}>
              {/* Actions */}
              <div className="generator-output-header">
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#7c3aed', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Generated Blog</div>
                  <h2 style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.02em', lineHeight: 1.3 }}>{result.title}</h2>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>~{result.word_count} words · {tone} · {length}</span>
                </div>
                <div className="actions-group">
                  <button onClick={handleSave} className="btn-ghost" style={{ fontSize: '0.78rem', border: '1px solid var(--border-color)', borderRadius: 8, color: saved ? 'var(--nemo-green)' : 'inherit' }} disabled={saving}>
                    {saved ? <><Check size={13} /> Saved</> : <><Save size={13} /> Save</>}
                  </button>
                  <button onClick={handleCopy} className="btn-ghost" style={{ fontSize: '0.78rem', border: '1px solid var(--border-color)', borderRadius: 8 }}>
                    {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
                  </button>
                  <button onClick={() => downloadMarkdown(result.content, result.title)} className="btn-primary" style={{ fontSize: '0.78rem', padding: '8px 14px' }}>
                    <Download size={13} /> .md
                  </button>
                </div>
              </div>
              <div style={{ maxHeight: '65vh', overflowY: 'auto', paddingRight: 4 }}>
                <MarkdownRenderer content={result.content} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
