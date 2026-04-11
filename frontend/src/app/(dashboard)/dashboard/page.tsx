'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { MessageSquare, Bot, FolderOpen, FileText, BookOpen, Zap, TrendingUp, Hash, Cpu, Clock, ArrowRight, Plus, Activity, Server, ShieldCheck } from 'lucide-react'
import { formatNumber } from '@/lib/utils'

const stats = [
  { label: 'Total Prompts', value: 148, icon: Hash, color: '#76b900', change: '+12%' },
  { label: 'Tokens Used', value: 24830, icon: Zap, color: '#00d4ff', change: '+28%', format: true },
  { label: 'Projects Created', value: 7, icon: FolderOpen, color: '#7c3aed', change: '+3' },
  { label: 'Avg Response', value: '680ms', icon: Clock, color: '#ec4899', change: '-15%', raw: true },
]

const quickActions = [
  { label: 'Start AI Chat', href: '/dashboard/chat', icon: MessageSquare, color: '#76b900' },
  { label: 'Create Agent Task', href: '/dashboard/agent', icon: Bot, color: '#00d4ff' },
  { label: 'Generate Blog', href: '/dashboard/blog', icon: FileText, color: '#7c3aed' },
  { label: 'Write Paper', href: '/dashboard/paper', icon: BookOpen, color: '#ec4899' },
]

const recentActivity = [
  { action: 'Chat', detail: 'Explained NVIDIA Nemotron 3 architecture', time: '2 mins ago', icon: MessageSquare, color: '#76b900' },
  { action: 'Agent', detail: 'Built web scraper in Python with async', time: '1 hour ago', icon: Bot, color: '#00d4ff' },
  { action: 'Blog', detail: 'Generated "AI in 2026: What\'s Next"', time: '3 hours ago', icon: FileText, color: '#7c3aed' },
  { action: 'Paper', detail: 'Created research paper on LLM efficiency', time: 'Yesterday', icon: BookOpen, color: '#ec4899' },
  { action: 'Chat', detail: 'Debugged React useEffect infinite loop', time: 'Yesterday', icon: MessageSquare, color: '#76b900' },
]

const Sparkline = ({ color }: { color: string }) => (
  <svg width="60" height="24" viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: 8 }}>
    <motion.path
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      d="M1 21L12.5 14L22.5 17.5L34 5.5L46.5 12L59 2.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default function DashboardPage() {
  return (
    <div style={{ padding: '32px 40px', maxWidth: 1400, margin: '0 auto', position: 'relative' }}>
      <div className="mesh-bg" />
      
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        style={{ marginBottom: 44, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span className="badge">
              <Activity size={12} /> System Status: Optimal
            </span>
            <span style={{ height: 4, width: 4, borderRadius: '50%', background: 'var(--text-muted)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>v3.4.2-stable</span>
          </div>
          <h1 style={{ fontSize: '2.75rem', fontWeight: 900, letterSpacing: '-0.04em', marginBottom: 8, background: 'linear-gradient(to bottom, #fff 0%, #94a3b8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Operations Center
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', fontWeight: 500 }}>
            Welcome back. All neural systems are <span style={{ color: 'var(--nemo-green)' }}>online</span> and synchronized.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn-secondary" style={{ padding: '10px 16px', fontSize: '0.85rem' }}>
            <Server size={16} /> Nodes
          </button>
          <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
            <Plus size={16} /> New Project
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 48 }}>
        {stats.map((s, i) => {
          const Icon = s.icon
          return (
            <motion.div 
              key={s.label} 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: i * 0.1 }}
              className="glass-premium"
              style={{ padding: 24, border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${s.color}20` }}>
                  <Icon size={20} color={s.color} />
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: s.change.startsWith('+') ? 'var(--nemo-green)' : '#ef4444', background: s.change.startsWith('+') ? 'rgba(118,185,0,0.1)' : 'rgba(239,68,68,0.1)', padding: '2px 8px', borderRadius: 100 }}>
                    {s.change}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', lineHeight: 1 }}>
                    {s.raw ? s.value : s.format ? formatNumber(s.value as number) : s.value}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 8, fontWeight: 500 }}>{s.label}</div>
                </div>
                <Sparkline color={s.color} />
              </div>
            </motion.div>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 32, marginBottom: 48 }}>
        {/* Quick Access Tiles */}
        <div className="glass-card" style={{ padding: 32, border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <h2 style={{ fontWeight: 800, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Zap size={20} color="var(--nemo-green)" /> Neural Command
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {quickActions.map((action, i) => {
              const Icon = action.icon
              return (
                <Link key={action.label} href={action.href} style={{ textDecoration: 'none' }}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="glass-premium"
                    style={{ padding: 24, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', height: '100%' }}
                  >
                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                      <div style={{ width: 44, height: 44, borderRadius: 10, background: `${action.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={20} color={action.color} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>{action.label}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>Launch specialized AI workspace</div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Recent Event Log */}
        <div className="glass-card" style={{ padding: 32, border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <h2 style={{ fontWeight: 800, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: 10 }}>
              <TrendingUp size={20} color="var(--nemo-green)" /> Activity Log
            </h2>
            <Link href="/dashboard/projects" className="btn-ghost" style={{ fontSize: '0.8rem' }}>View Log <ArrowRight size={14} /></Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {recentActivity.map((a, i) => {
              const Icon = a.icon
              return (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: 10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: 0.5 + i * 0.05 }}
                  style={{ display: 'flex', gap: 16, alignItems: 'center' }}
                >
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: a.color, boxShadow: `0 0 10px ${a.color}50` }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>{a.detail}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 2 }}>{a.action} • {a.time}</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Dynamic Infrastructure Metrics */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.7 }}
        className="glass-premium"
        style={{ padding: '32px 40px', background: 'linear-gradient(135deg, rgba(118,185,0,0.1) 0%, rgba(13,17,23,0.9) 50%, rgba(0,212,255,0.05) 100%)', border: '1px solid rgba(118,185,0,0.1)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(118,185,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(118,185,0,0.2)' }}>
                <Cpu size={32} color="var(--nemo-green)" className="animate-pulse" />
              </div>
              <div style={{ position: 'absolute', bottom: -4, right: -4, width: 24, height: 24, borderRadius: '50%', background: '#030712', border: '2px solid var(--nemo-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={14} color="var(--nemo-green)" />
              </div>
            </div>
            <div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: 4 }}>Infrastructure Cluster: Alpha-01</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="badge" style={{ padding: '2px 8px', fontSize: '0.65rem' }}>Region: US-EAST-1</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--nemo-green)', fontWeight: 600 }}>● Active & Secure</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 48 }}>
            {[
              { label: 'Compute Unit', value: 'DGX-H100', detail: '8x Clusters' },
              { label: 'Current Load', value: '42.8%', detail: 'Power Saving' },
              { label: 'Throughput', value: '1.2M', detail: 'Tokens/min' },
            ].map(m => (
              <div key={m.label}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginTop: 4 }}>{m.value}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--nemo-green)', fontWeight: 600, marginTop: 2 }}>{m.detail}</div>
              </div>
            ))}
          </div>

          <Link href="/dashboard/analytics" className="btn-primary" style={{ padding: '14px 28px' }}>
            Open Analytics Suite <ArrowRight size={18} />
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
