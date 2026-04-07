'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Loader2, Download, Copy, Check, Sparkles, Plus, X } from 'lucide-react'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { generatePaper } from '@/lib/api'
import { downloadMarkdown, copyToClipboard } from '@/lib/utils'

const domains = ['Computer Science', 'Artificial Intelligence', 'Data Science', 'Neuroscience', 'Physics', 'Biology', 'Economics']

export default function PaperPage() {
  const [title, setTitle] = useState('')
  const [domain, setDomain] = useState('Artificial Intelligence')
  const [keyword, setKeyword] = useState('')
  const [keywords, setKeywords] = useState<string[]>(['NVIDIA Nemotron', 'LLM', 'transformer'])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ title: string; content: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const addKeyword = () => {
    if (keyword.trim() && !keywords.includes(keyword.trim())) {
      setKeywords(prev => [...prev, keyword.trim()])
      setKeyword('')
    }
  }

  const generate = async () => {
    if (!title.trim() || loading) return
    setLoading(true); setError(''); setResult(null)
    try {
      const data = await generatePaper(title, domain, keywords)
      setResult(data)
    } catch {
      setError('Failed to generate paper. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    if (!result) return
    copyToClipboard(result.content)
    setCopied(true); setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ padding: '40px', minHeight: '100vh', maxWidth: 1100 }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(236,72,153,0.15)', border: '1px solid rgba(236,72,153,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={20} color="#ec4899" />
          </div>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.03em' }}>Research Paper Generator</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Generate academic papers with proper structure and citations</p>
          </div>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: result ? '360px 1fr' : '1fr', gap: 24, transition: 'all 0.5s' }}>
        <motion.div layout className="glass-card" style={{ padding: 28, alignSelf: 'start' }}>
          <div style={{ marginBottom: 20 }}>
            <label className="form-label">Paper Title</label>
            <input className="form-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Efficient Inference in Large Language Models using Latent MoE" />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label className="form-label">Domain / Field</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {domains.map(d => (
                <button key={d} onClick={() => setDomain(d)} style={{ padding: '5px 12px', fontSize: '0.75rem', fontWeight: 500, borderRadius: 100, border: `1px solid ${domain === d ? '#ec4899' : 'var(--border-color)'}`, background: domain === d ? 'rgba(236,72,153,0.12)' : 'transparent', color: domain === d ? '#ec4899' : 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.15s' }}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label className="form-label">Keywords</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <input className="form-input" value={keyword} onChange={e => setKeyword(e.target.value)} onKeyDown={e => e.key === 'Enter' && addKeyword()} placeholder="Add keyword…" style={{ flex: 1 }} />
              <button onClick={addKeyword} className="btn-secondary" style={{ padding: '8px 14px', flexShrink: 0 }}><Plus size={14} /></button>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {keywords.map(kw => (
                <span key={kw} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.2)', borderRadius: 100, fontSize: '0.75rem', color: '#ec4899' }}>
                  {kw}
                  <button onClick={() => setKeywords(prev => prev.filter(k => k !== kw))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#ec4899', display: 'flex' }}><X size={11} /></button>
                </span>
              ))}
            </div>
          </div>

          {error && <p style={{ color: '#f87171', fontSize: '0.8rem', marginBottom: 16 }}>{error}</p>}

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={generate} disabled={!title.trim() || loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg, #ec4899, #f59e0b)', opacity: loading ? 0.7 : 1 }}>
            {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Generating…</> : <><Sparkles size={16} /> Generate Paper</>}
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="glass-card" style={{ padding: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, gap: 12 }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#ec4899', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Research Paper</div>
                  <h2 style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em', lineHeight: 1.4 }}>{result.title}</h2>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{domain} · {keywords.length} keywords</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={handleCopy} className="btn-ghost" style={{ fontSize: '0.78rem', border: '1px solid var(--border-color)', borderRadius: 8 }}>
                    {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
                  </button>
                  <button onClick={() => downloadMarkdown(result.content, result.title.replace(/ /g, '_'))} className="btn-primary" style={{ fontSize: '0.78rem', padding: '8px 14px', background: 'linear-gradient(135deg, #ec4899, #f59e0b)' }}>
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
