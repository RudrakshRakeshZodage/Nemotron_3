'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Play, ChevronDown, ChevronRight, Loader2, CheckCircle, ArrowRight, Sparkles, Code, Search, Lightbulb, Zap } from 'lucide-react'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import { runAgent } from '@/lib/api'

interface AgentStep { step: number; title: string; description: string; output: string }

const stepIcons = [Search, Lightbulb, Code, Zap]
const stepColors = ['#76b900', '#00d4ff', '#7c3aed', '#ec4899']

const examples = [
  'Build a full-stack authentication system with JWT',
  'Create an ML pipeline for sentiment analysis',
  'Design a REST API for an e-commerce platform',
  'Write a Python script to scrape and analyze Twitter data',
]

export default function AgentPage() {
  const [task, setTask] = useState('')
  const [loading, setLoading] = useState(false)
  const [steps, setSteps] = useState<AgentStep[]>([])
  const [expanded, setExpanded] = useState<number[]>([])
  const [done, setDone] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)

  const runTask = async () => {
    if (!task.trim() || loading) return
    setLoading(true); setSteps([]); setExpanded([]); setDone(false); setCurrentStep(0)

    try {
      // Animate step reveals
      const result = await runAgent(task)
      const agentSteps = result.steps as AgentStep[]
      setCurrentStep(-1)

      for (let i = 0; i < agentSteps.length; i++) {
        await new Promise(r => setTimeout(r, 600))
        setCurrentStep(i)
        setSteps(prev => [...prev, agentSteps[i]])
      }
      setDone(true)
    } catch (e) {
      setSteps([{ step: 1, title: 'Error', description: 'Could not connect to agent backend.', output: 'Make sure the FastAPI server is running on port 8000.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '40px', minHeight: '100vh' }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Bot size={20} color="#00d4ff" />
          </div>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.03em' }}>Agent Studio</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Powered by NVIDIA Nemotron 3 agentic reasoning</p>
          </div>
          <span className="badge" style={{ marginLeft: 8 }}>PRO</span>
        </div>
      </motion.div>

      {/* Task Input */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card" style={{ padding: 28, marginBottom: 28 }}>
        <label className="form-label" style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: 12 }}>
          Describe your task
        </label>
        <div style={{ display: 'flex', gap: 12 }}>
          <textarea
            value={task}
            onChange={e => setTask(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) runTask() }}
            placeholder="e.g. Build a web scraper with Python that extracts product prices from Amazon…"
            rows={3}
            style={{ flex: 1, padding: '12px 14px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: 10, color: 'var(--text-primary)', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif', resize: 'none', outline: 'none', lineHeight: 1.6, transition: 'border-color 0.2s' }}
            onFocus={e => e.target.style.borderColor = 'var(--nemo-green)'}
            onBlur={e => e.target.style.borderColor = 'var(--border-color)'}
          />
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={runTask} disabled={loading || !task.trim()}
            className="btn-primary"
            style={{ alignSelf: 'flex-end', padding: '12px 24px', opacity: loading || !task.trim() ? 0.7 : 1 }}
          >
            {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Running</> : <><Play size={16} /> Run Agent</>}
          </motion.button>
        </div>

        {/* Examples */}
        <div style={{ marginTop: 16 }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 8 }}>Try an example:</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {examples.map(ex => (
              <button key={ex} onClick={() => setTask(ex)} className="btn-ghost"
                style={{ fontSize: '0.75rem', padding: '4px 12px', border: '1px solid var(--border-color)', borderRadius: 100, background: 'var(--bg-card)' }}>
                {ex.length > 40 ? ex.slice(0, 40) + '…' : ex}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Steps Timeline */}
      <AnimatePresence>
        {(steps.length > 0 || loading) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {loading && steps.length === 0 && (
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '20px 24px', background: 'var(--bg-card)', borderRadius: 12, marginBottom: 16 }}>
                <Loader2 size={18} color="var(--nemo-green)" style={{ animation: 'spin 1s linear infinite' }} />
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>🧠 Nemotron analyzing your task…</span>
              </div>
            )}

            {steps.map((step, i) => {
              const Icon = stepIcons[i % stepIcons.length]
              const color = stepColors[i % stepColors.length]
              const isOpen = expanded.includes(i)

              return (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}
                  style={{ marginBottom: 12, position: 'relative' }}
                >
                  {/* Connecting line */}
                  {i < steps.length - 1 && (
                    <div style={{ position: 'absolute', left: 20, top: '100%', width: 2, height: 12, background: 'linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)', zIndex: 1 }} />
                  )}

                  <div className="glass-card" style={{ overflow: 'hidden' }}>
                    {/* Header */}
                    <button
                      onClick={() => setExpanded(prev => isOpen ? prev.filter(x => x !== i) : [...prev, i])}
                      style={{ width: '100%', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 14, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                    >
                      <div style={{ width: 40, height: 40, borderRadius: 11, background: `${color}15`, border: `2px solid ${color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={18} color={color} />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 24, height: 24, borderRadius: '50%', background: color, justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#000' }}>{step.step}</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: 2 }}>{step.title}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{step.description}</div>
                      </div>
                      <CheckCircle size={18} color={color} style={{ flexShrink: 0 }} />
                      {isOpen ? <ChevronDown size={16} color="var(--text-muted)" /> : <ChevronRight size={16} color="var(--text-muted)" />}
                    </button>

                    {/* Expanded Output */}
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                          style={{ overflow: 'hidden', borderTop: `1px solid ${color}20` }}
                        >
                          <div style={{ padding: '20px 24px', background: `${color}05` }}>
                            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: color, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Output</p>
                            <MarkdownRenderer content={step.output} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )
            })}

            {done && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                style={{ padding: '20px 24px', background: 'rgba(118,185,0,0.08)', border: '1px solid rgba(118,185,0,0.25)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                <CheckCircle size={22} color="var(--nemo-green)" />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--nemo-green)' }}>Task completed!</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>All 4 steps executed successfully by Nemotron 3</div>
                </div>
                <button onClick={() => { setSteps([]); setTask(''); setDone(false) }} className="btn-primary" style={{ marginLeft: 'auto', padding: '8px 18px', fontSize: '0.8rem' }}>
                  New Task <ArrowRight size={13} />
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {steps.length === 0 && !loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '60px 24px' }}>
          <Sparkles size={48} color="rgba(118,185,0,0.3)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8 }}>No tasks running</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Enter a task above and let Nemotron 3 break it into actionable steps</p>
        </motion.div>
      )}
    </div>
  )
}
