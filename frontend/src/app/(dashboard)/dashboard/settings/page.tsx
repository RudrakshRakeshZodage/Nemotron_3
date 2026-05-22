'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Settings, User, Key, Moon, Sun, Bell, Shield, Save, Check, Eye, EyeOff, Copy } from 'lucide-react'
import { copyToClipboard } from '@/lib/utils'

export default function SettingsPage() {
  const [name, setName] = useState('Demo User')
  const [email, setEmail] = useState('demo@nemocore.ai')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [apiKey, setApiKey] = useState('')
  const [showKey, setShowKey] = useState(false)
  const [saved, setSaved] = useState(false)
  const [copiedKey, setCopiedKey] = useState(false)
  const [openRouterKey, setOpenRouterKey] = useState('')
  const [showOpenRouterKey, setShowOpenRouterKey] = useState(false)
  const [copiedOpenRouterKey, setCopiedOpenRouterKey] = useState(false)
  const [notifications, setNotifications] = useState({ email: true, usage: true, updates: false })

  // Load API keys from localStorage on mount
  useEffect(() => {
    const nvidiaKey = localStorage.getItem('nemocore_nvidia_key') || ''
    const openrouterKey = localStorage.getItem('nemocore_openrouter_key') || ''
    if (nvidiaKey) setApiKey(nvidiaKey)
    if (openrouterKey) setOpenRouterKey(openrouterKey)
  }, [])

  const handleSave = () => {
    // Persist API keys to localStorage
    if (apiKey.trim()) {
      localStorage.setItem('nemocore_nvidia_key', apiKey.trim())
    } else {
      localStorage.removeItem('nemocore_nvidia_key')
    }
    if (openRouterKey.trim()) {
      localStorage.setItem('nemocore_openrouter_key', openRouterKey.trim())
    } else {
      localStorage.removeItem('nemocore_openrouter_key')
    }
    // Clear demo mode flag if user sets real keys
    if (apiKey.trim() || openRouterKey.trim()) {
      localStorage.removeItem('nemocore_demo_mode')
    }
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleCopyKey = () => {
    copyToClipboard(apiKey); setCopiedKey(true); setTimeout(() => setCopiedKey(false), 2000)
  }

  const handleCopyOpenRouterKey = () => {
    copyToClipboard(openRouterKey); setCopiedOpenRouterKey(true); setTimeout(() => setCopiedOpenRouterKey(false), 2000)
  }

  const section = (title: string, icon: React.ReactNode, children: React.ReactNode) => (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: 28, marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border-color)' }}>
        {icon}
        <h2 style={{ fontWeight: 700, fontSize: '1rem' }}>{title}</h2>
      </div>
      {children}
    </motion.div>
  )

  return (
    <div style={{ padding: '40px', minHeight: '100vh', maxWidth: 720 }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(118,185,0,0.15)', border: '1px solid rgba(118,185,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Settings size={20} color="var(--nemo-green)" />
          </div>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.03em' }}>Settings</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Manage your account and preferences</p>
          </div>
        </div>
      </motion.div>

      {section('Profile', <User size={18} color="var(--nemo-green)" />,
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #76b900, #00d4ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 700, color: '#000', boxShadow: '0 4px 16px rgba(118,185,0,0.3)' }}>
              {name[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 2 }}>{name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Free Plan · 100K tokens/month</div>
            </div>
          </div>
          <div>
            <label className="form-label">Full Name</label>
            <input className="form-input" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label className="form-label">Email Address</label>
            <input className="form-input" value={email} onChange={e => setEmail(e.target.value)} type="email" />
          </div>
        </div>
      )}

      {section('API Keys', <Key size={18} color="#00d4ff" />,
        <div>
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
              Add your <a href="https://build.nvidia.com" target="_blank" style={{ color: 'var(--nemo-green)' }}>NVIDIA API key</a> from build.nvidia.com to enable live Nemotron 3 responses.
            </p>
            <label className="form-label">NVIDIA API Key</label>
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <input className="form-input" type={showKey ? 'text' : 'password'} value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder="nvapi-xxxxxxxxxxxxxxxxxxxx" style={{ paddingRight: 80 }} />
              <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 4 }}>
                <button onClick={() => setShowKey(!showKey)} className="btn-ghost" style={{ padding: '4px 6px' }}>
                  {showKey ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
                <button onClick={handleCopyKey} className="btn-ghost" style={{ padding: '4px 6px' }}>
                  {copiedKey ? <Check size={13} color="var(--nemo-green)" /> : <Copy size={13} />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
              Or use <a href="https://openrouter.ai" target="_blank" style={{ color: 'var(--nemo-green)' }}>OpenRouter</a> for free access to NVIDIA Nemotron 3 Nano 30B A3B model.
            </p>
            <label className="form-label">OpenRouter API Key</label>
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <input className="form-input" type={showOpenRouterKey ? 'text' : 'password'} value={openRouterKey} onChange={e => setOpenRouterKey(e.target.value)} placeholder="sk-or-xxxxxxxxxxxxxxxxxxxx" style={{ paddingRight: 80 }} />
              <div style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 4 }}>
                <button onClick={() => setShowOpenRouterKey(!showOpenRouterKey)} className="btn-ghost" style={{ padding: '4px 6px' }}>
                  {showOpenRouterKey ? <EyeOff size={13} /> : <Eye size={13} />}
                </button>
                <button onClick={handleCopyOpenRouterKey} className="btn-ghost" style={{ padding: '4px 6px' }}>
                  {copiedOpenRouterKey ? <Check size={13} color="var(--nemo-green)" /> : <Copy size={13} />}
                </button>
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Your API keys are stored locally and never sent to our servers.</p>
        </div>
      )}

      {section('Appearance', theme === 'dark' ? <Moon size={18} color="#7c3aed" /> : <Sun size={18} color="#f59e0b" />,
        <div>
          <label className="form-label">Theme</label>
          <div style={{ display: 'flex', gap: 12 }}>
            {(['dark', 'light'] as const).map(t => (
              <button key={t} onClick={() => setTheme(t)} style={{ flex: 1, padding: '16px', borderRadius: 12, border: `2px solid ${theme === t ? 'var(--nemo-green)' : 'var(--border-color)'}`, background: theme === t ? 'rgba(118,185,0,0.08)' : 'var(--bg-card)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, transition: 'all 0.2s' }}>
                {t === 'dark' ? <Moon size={20} color={theme === t ? 'var(--nemo-green)' : 'var(--text-muted)'} /> : <Sun size={20} color={theme === t ? 'var(--nemo-green)' : 'var(--text-muted)'} />}
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: theme === t ? 'var(--nemo-green)' : 'var(--text-secondary)', textTransform: 'capitalize' }}>{t} Mode</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {section('Notifications', <Bell size={18} color="#f59e0b" />,
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {([
            { key: 'email', label: 'Email Notifications', desc: 'Receive updates about your account' },
            { key: 'usage', label: 'Usage Alerts', desc: 'Get notified when approaching token limits' },
            { key: 'updates', label: 'Product Updates', desc: 'News about new features and improvements' },
          ] as const).map(item => (
            <div key={item.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: '0.875rem', marginBottom: 2 }}>{item.label}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.desc}</div>
              </div>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                style={{ width: 44, height: 24, borderRadius: 12, background: notifications[item.key] ? 'var(--nemo-green)' : 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', position: 'relative', transition: 'all 0.2s', flexShrink: 0 }}
              >
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: notifications[item.key] ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
              </button>
            </div>
          ))}
        </div>
      )}

      <motion.button onClick={handleSave} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary" style={{ padding: '12px 32px', fontSize: '0.9rem' }}>
        {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
      </motion.button>
    </div>
  )
}
