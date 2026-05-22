'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Loader2, Download, Copy, Check, Sparkles, Plus, X, Save } from 'lucide-react'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { generatePaper, saveProject } from '@/lib/api'
import { downloadMarkdown, copyToClipboard } from '@/lib/utils'
import { saveLocalProject } from '@/lib/projectsStore'

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
  const [viewMode, setViewMode] = useState<'markdown' | 'ieee'>('ieee')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!result || saving) return
    setSaving(true)
    try {
      saveLocalProject({
        title: result.title,
        description: `Research Paper in ${domain} about ${title.substring(0, 40)}${title.length > 40 ? '...' : ''}`,
        type: 'paper',
        content: result.content
      })

      try {
        await saveProject({
          user_id: 'user_123',
          title: result.title,
          description: `Research Paper in ${domain} about ${title.substring(0, 40)}${title.length > 40 ? '...' : ''}`,
          content: result.content,
          type: 'paper'
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
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {/* View Mode Toggle */}
                  <div style={{ display: 'flex', background: 'var(--bg-input)', borderRadius: 8, padding: 3, border: '1px solid var(--border-color)', marginRight: 4 }}>
                    <button onClick={() => setViewMode('ieee')} style={{ fontSize: '0.72rem', padding: '4px 10px', borderRadius: 6, border: 'none', background: viewMode === 'ieee' ? 'rgba(236,72,153,0.15)' : 'transparent', color: viewMode === 'ieee' ? '#ec4899' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}>IEEE Style</button>
                    <button onClick={() => setViewMode('markdown')} style={{ fontSize: '0.72rem', padding: '4px 10px', borderRadius: 6, border: 'none', background: viewMode === 'markdown' ? 'rgba(236,72,153,0.15)' : 'transparent', color: viewMode === 'markdown' ? '#ec4899' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600, transition: 'all 0.2s' }}>Markdown</button>
                  </div>
                  <button onClick={handleSave} className="btn-ghost" style={{ fontSize: '0.78rem', border: '1px solid var(--border-color)', borderRadius: 8, color: saved ? 'var(--nemo-green)' : 'inherit' }} disabled={saving}>
                    {saved ? <><Check size={13} /> Saved</> : <><Save size={13} /> Save</>}
                  </button>
                  <button onClick={handleCopy} className="btn-ghost" style={{ fontSize: '0.78rem', border: '1px solid var(--border-color)', borderRadius: 8 }}>
                    {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
                  </button>
                  <button onClick={() => downloadMarkdown(result.content, result.title.replace(/ /g, '_'))} className="btn-primary" style={{ fontSize: '0.78rem', padding: '8px 14px', background: 'linear-gradient(135deg, #ec4899, #f59e0b)' }}>
                    <Download size={13} /> .md
                  </button>
                </div>
              </div>
              <div style={{ maxHeight: '65vh', overflowY: 'auto', paddingRight: 4 }}>
                {viewMode === 'markdown' ? (
                  <MarkdownRenderer content={result.content} />
                ) : (
                  <>
                    <style>{`
                      .ieee-container h1 {
                        font-family: "Times New Roman", Times, serif !important;
                        font-size: 11px !important;
                        font-weight: bold !important;
                        text-transform: uppercase !important;
                        text-align: center !important;
                        margin: 18px 0 8px 0 !important;
                        color: #000000 !important;
                      }
                      .ieee-container h2 {
                        font-family: "Times New Roman", Times, serif !important;
                        font-size: 11px !important;
                        font-weight: bold !important;
                        font-style: italic !important;
                        text-align: left !important;
                        margin: 14px 0 6px 0 !important;
                        color: #000000 !important;
                      }
                      .ieee-container p {
                        font-family: "Times New Roman", Times, serif !important;
                        font-size: 10.5px !important;
                        line-height: 1.5 !important;
                        color: #111827 !important;
                        text-indent: 1.5em;
                        margin: 0 0 6px 0 !important;
                        text-align: justify !important;
                      }
                      .ieee-container table {
                        font-size: 9.5px !important;
                        border-top: 1.5px solid #000 !important;
                        border-bottom: 1.5px solid #000 !important;
                        margin: 12px 0 !important;
                        width: 100% !important;
                      }
                      .ieee-container th {
                        border-bottom: 1px solid #000 !important;
                        background: transparent !important;
                        color: #000 !important;
                        font-weight: bold !important;
                        text-transform: uppercase !important;
                        font-size: 9px !important;
                        padding: 4px !important;
                      }
                      .ieee-container td {
                        border-bottom: 0.5px solid #e5e7eb !important;
                        color: #374151 !important;
                        padding: 4px !important;
                      }
                      .ieee-container pre, .ieee-container code {
                        font-size: 9.5px !important;
                      }
                      .ieee-container blockquote {
                        border-left: 2px solid #000 !important;
                        color: #4b5563 !important;
                        padding-left: 10px !important;
                        margin: 8px 0 !important;
                      }
                    `}</style>
                    <div style={{
                      background: '#ffffff',
                      color: '#111827',
                      padding: '48px 56px',
                      fontFamily: '"Times New Roman", Times, Georgia, serif',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
                      borderRadius: '4px',
                      border: '1px solid #e5e7eb',
                      lineHeight: 1.5,
                      fontSize: '13px',
                      textAlign: 'justify' as const,
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      '--text-primary': '#111827',
                      '--text-secondary': '#374151',
                      '--text-muted': '#4b5563',
                      '--border-color': '#d1d5db',
                      '--bg-input': '#ffffff'
                    }} className="ieee-container">
                      {/* IEEE Header */}
                      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '12px', color: '#000000' }}>
                          {parsePaperContent(result.content).title || result.title}
                        </div>
                        <div style={{ fontSize: '11px', fontStyle: 'italic', color: '#374151', marginBottom: '24px', lineHeight: 1.4 }}>
                          Rudraksh R. Zodage<br />
                          NemoCore Research Labs, Department of Advanced Agentic Coding<br />
                          Email: rrzodage@college.edu
                        </div>
                      </div>

                      {/* Abstract & Keywords */}
                      <div style={{ borderTop: '1px solid #000', borderBottom: '1px solid #000', padding: '12px 0', marginBottom: '24px', fontSize: '10.5px' }}>
                        <p style={{ margin: '0 0 8px 0', textIndent: '1.5em', color: '#111827' }}>
                          <strong><em>Abstract</em>—{parsePaperContent(result.content).abstract}</strong>
                        </p>
                        <p style={{ margin: 0, color: '#111827' }}>
                          <strong><em>Keywords</em>—{parsePaperContent(result.content).keywords}</strong>
                        </p>
                      </div>

                      {/* Two Column Body */}
                      <div style={{
                        columnCount: 2,
                        columnGap: '32px',
                        columnRule: '1px solid #e5e7eb',
                      }}>
                        <MarkdownRenderer content={parsePaperContent(result.content).body} />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function parsePaperContent(content: string) {
  let title = '';
  let abstract = '';
  let keywords = '';
  let body = content;

  // Extract first h1 as title if present
  const titleMatch = content.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    title = titleMatch[1];
    body = body.replace(titleMatch[0], '');
  }

  // Extract Abstract
  const abstractMatch = content.match(/\*\*Abstract\*\*\s*([\s\S]*?)(?=\*\*Keywords:\*\*|#|---)/i);
  if (abstractMatch) {
    abstract = abstractMatch[1].trim();
    body = body.replace(/\*\*Abstract\*\*\s*[\s\S]*?(?=\*\*Keywords:\*\*|#|---)/i, '');
  }

  // Extract Keywords
  const keywordsMatch = content.match(/\*\*Keywords:\*\*\s*(.*?)(?=\n|#|---)/i);
  if (keywordsMatch) {
    keywords = keywordsMatch[1].trim();
    body = body.replace(/\*\*Keywords:\*\*\s*.*?(?=\n|#|---)/i, '');
  }

  // Clean up dividers
  body = body.replace(/---/g, '').trim();

  return { title, abstract, keywords, body };
}
