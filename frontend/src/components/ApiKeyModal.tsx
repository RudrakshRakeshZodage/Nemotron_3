'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Key, Eye, EyeOff, ArrowRight, Cpu, Sparkles, X, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react'

interface ApiKeyModalProps {
  onClose: () => void
}

export default function ApiKeyModal({ onClose }: ApiKeyModalProps) {
  const [nvidiaKey, setNvidiaKey] = useState('')
  const [openrouterKey, setOpenrouterKey] = useState('')
  const [showNvidia, setShowNvidia] = useState(false)
  const [showOpenrouter, setShowOpenrouter] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const nvidiaValid = nvidiaKey.startsWith('nvapi-') && nvidiaKey.length > 20
  const openrouterValid = openrouterKey.startsWith('sk-or-') && openrouterKey.length > 20
  const hasAnyKey = nvidiaKey.trim() !== '' || openrouterKey.trim() !== ''

  const handleSave = () => {
    setSaving(true)
    if (nvidiaKey.trim()) localStorage.setItem('nemocore_nvidia_key', nvidiaKey.trim())
    if (openrouterKey.trim()) localStorage.setItem('nemocore_openrouter_key', openrouterKey.trim())
    setSaved(true)
    setTimeout(() => {
      setSaving(false)
      onClose()
    }, 900)
  }

  const handleDemo = () => {
    localStorage.setItem('nemocore_demo_mode', 'true')
    onClose()
  }

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 9000,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px',
        }}
      >
        {/* Modal */}
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          style={{
            width: '100%', maxWidth: 520,
            background: 'linear-gradient(145deg, rgba(15,20,35,0.98) 0%, rgba(8,12,24,0.99) 100%)',
            border: '1px solid rgba(118,185,0,0.25)',
            borderRadius: 20,
            boxShadow: '0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(118,185,0,0.08), inset 0 1px 0 rgba(255,255,255,0.06)',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {/* Top glow bar */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: 'linear-gradient(90deg, transparent, #76b900, #00d4ff, transparent)',
          }} />

          {/* Ambient glow */}
          <div style={{
            position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)',
            width: 300, height: 200,
            background: 'radial-gradient(ellipse, rgba(118,185,0,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ padding: '36px 36px 32px', position: 'relative' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 56, height: 56, borderRadius: 16,
                background: 'linear-gradient(135deg, rgba(118,185,0,0.2), rgba(0,212,255,0.1))',
                border: '1px solid rgba(118,185,0,0.3)',
                marginBottom: 16,
                boxShadow: '0 8px 24px rgba(118,185,0,0.2)',
              }}>
                <Key size={24} color="#76b900" />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6, color: '#f8fafc' }}>
                Connect Your API Keys
              </h2>
              <p style={{ fontSize: '0.83rem', color: 'rgba(148,163,184,0.9)', lineHeight: 1.6, maxWidth: 360, margin: '0 auto' }}>
                Add your API keys to unlock live AI responses. Keys are stored only in your browser — never on our servers.
              </p>
            </div>

            {/* Key cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>

              {/* NVIDIA Key */}
              <div style={{
                padding: '18px 18px 16px',
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${nvidiaKey ? (nvidiaValid ? 'rgba(118,185,0,0.4)' : 'rgba(239,68,68,0.3)') : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 14,
                transition: 'border-color 0.2s',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: 'rgba(118,185,0,0.12)', border: '1px solid rgba(118,185,0,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Cpu size={14} color="#76b900" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#f8fafc' }}>NVIDIA API Key</div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(148,163,184,0.7)' }}>Nemotron 70B · 8B · 3B models</div>
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    <a
                      href="https://build.nvidia.com"
                      target="_blank"
                      rel="noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: '#76b900', textDecoration: 'none', opacity: 0.8 }}
                    >
                      Get key <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    id="modal-nvidia-key"
                    type={showNvidia ? 'text' : 'password'}
                    value={nvidiaKey}
                    onChange={e => setNvidiaKey(e.target.value)}
                    placeholder="nvapi-xxxxxxxxxxxxxxxxxxxx"
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      padding: '10px 72px 10px 12px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 9,
                      color: '#f8fafc', fontSize: '0.82rem',
                      fontFamily: 'JetBrains Mono, monospace',
                      outline: 'none',
                    }}
                  />
                  <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 4, alignItems: 'center' }}>
                    {nvidiaKey && (
                      nvidiaValid
                        ? <CheckCircle2 size={14} color="#76b900" />
                        : <AlertCircle size={14} color="#ef4444" />
                    )}
                    <button
                      onClick={() => setShowNvidia(!showNvidia)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(148,163,184,0.6)', padding: 4 }}
                    >
                      {showNvidia ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* OpenRouter Key */}
              <div style={{
                padding: '18px 18px 16px',
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${openrouterKey ? (openrouterValid ? 'rgba(0,212,255,0.4)' : 'rgba(239,68,68,0.3)') : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 14,
                transition: 'border-color 0.2s',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8,
                    background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Sparkles size={14} color="#00d4ff" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#f8fafc' }}>OpenRouter API Key</div>
                    <div style={{ fontSize: '0.72rem', color: 'rgba(148,163,184,0.7)' }}>Nemotron 3 Nano 30B · Free tier available</div>
                  </div>
                  <div style={{ marginLeft: 'auto' }}>
                    <a
                      href="https://openrouter.ai/keys"
                      target="_blank"
                      rel="noreferrer"
                      style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: '#00d4ff', textDecoration: 'none', opacity: 0.8 }}
                    >
                      Get key <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    id="modal-openrouter-key"
                    type={showOpenrouter ? 'text' : 'password'}
                    value={openrouterKey}
                    onChange={e => setOpenrouterKey(e.target.value)}
                    placeholder="sk-or-xxxxxxxxxxxxxxxxxxxx"
                    style={{
                      width: '100%', boxSizing: 'border-box',
                      padding: '10px 72px 10px 12px',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 9,
                      color: '#f8fafc', fontSize: '0.82rem',
                      fontFamily: 'JetBrains Mono, monospace',
                      outline: 'none',
                    }}
                  />
                  <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 4, alignItems: 'center' }}>
                    {openrouterKey && (
                      openrouterValid
                        ? <CheckCircle2 size={14} color="#00d4ff" />
                        : <AlertCircle size={14} color="#ef4444" />
                    )}
                    <button
                      onClick={() => setShowOpenrouter(!showOpenrouter)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(148,163,184,0.6)', padding: 4 }}
                    >
                      {showOpenrouter ? <EyeOff size={13} /> : <Eye size={13} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Security note */}
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 8,
              padding: '10px 12px',
              background: 'rgba(118,185,0,0.05)',
              border: '1px solid rgba(118,185,0,0.12)',
              borderRadius: 8, marginBottom: 20,
            }}>
              <Zap size={12} color="#76b900" style={{ marginTop: 2, flexShrink: 0 }} />
              <p style={{ fontSize: '0.72rem', color: 'rgba(148,163,184,0.75)', lineHeight: 1.6, margin: 0 }}>
                Keys are encrypted in your browser&apos;s localStorage and only sent to your local backend instance. You can update them anytime in <strong style={{ color: '#76b900' }}>Settings</strong>.
              </p>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <motion.button
                id="modal-save-keys"
                onClick={handleSave}
                disabled={!hasAnyKey || saving}
                whileHover={hasAnyKey ? { scale: 1.02 } : {}}
                whileTap={hasAnyKey ? { scale: 0.97 } : {}}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '13px 24px',
                  background: hasAnyKey
                    ? 'linear-gradient(135deg, #76b900, #a3e635)'
                    : 'rgba(255,255,255,0.07)',
                  border: 'none', borderRadius: 11,
                  color: hasAnyKey ? '#000' : 'rgba(148,163,184,0.5)',
                  fontWeight: 700, fontSize: '0.9rem',
                  cursor: hasAnyKey ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                  boxShadow: hasAnyKey ? '0 4px 20px rgba(118,185,0,0.35)' : 'none',
                }}
              >
                {saved ? (
                  <><CheckCircle2 size={16} /> Keys Saved!</>
                ) : (
                  <><Key size={16} /> Save & Connect <ArrowRight size={14} /></>
                )}
              </motion.button>

              <button
                id="modal-demo-mode"
                onClick={handleDemo}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '11px 24px',
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 11,
                  color: 'rgba(148,163,184,0.75)',
                  fontWeight: 600, fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                  e.currentTarget.style.color = '#f8fafc'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                  e.currentTarget.style.color = 'rgba(148,163,184,0.75)'
                }}
              >
                ⚡ Use Demo Mode (simulated responses)
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
