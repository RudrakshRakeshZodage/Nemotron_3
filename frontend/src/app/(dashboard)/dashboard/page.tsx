'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { MessageSquare, Bot, FolderOpen, FileText, BookOpen, Zap, TrendingUp, Hash, Cpu, Clock, ArrowRight, Plus } from 'lucide-react'
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

export default function DashboardPage() {
  return (
    <div style={{ padding: '40px 40px', maxWidth: 1200 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--nemo-green)', boxShadow: '0 0 8px var(--nemo-green)' }} />
          <span style={{ fontSize: '0.78rem', color: 'var(--nemo-green)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>NemoCore AI</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>
          Good evening 👋
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Your AI platform is running at <span style={{ color: 'var(--nemo-green)', fontWeight: 600 }}>peak performance</span>. Ready to build something amazing?
        </p>
      </motion.div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 36 }}>
        {stats.map((s, i) => {
          const Icon = s.icon
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="stat-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${s.color}15`, border: `1px solid ${s.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color={s.color} />
                </div>
                <span style={{ fontSize: '0.72rem', padding: '3px 8px', background: 'rgba(118,185,0,0.1)', color: 'var(--nemo-green)', borderRadius: 100, fontWeight: 600 }}>{s.change}</span>
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--text-primary)', marginBottom: 4 }}>
                {s.raw ? s.value : s.format ? formatNumber(s.value as number) : s.value}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{s.label}</div>
            </motion.div>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass-card" style={{ padding: 28 }}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Zap size={16} color="var(--nemo-green)" /> Quick Actions
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {quickActions.map(action => {
              const Icon = action.icon
              return (
                <Link key={action.label} href={action.href} style={{ textDecoration: 'none' }}>
                  <motion.div
                    whileHover={{ scale: 1.02, y: -2 }}
                    style={{ padding: '16px 14px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s', textAlign: 'center' }}
                  >
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: `${action.color}15`, border: `1px solid ${action.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                      <Icon size={16} color={action.color} />
                    </div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{action.label}</div>
                  </motion.div>
                </Link>
              )
            })}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="glass-card" style={{ padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontWeight: 700, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={16} color="var(--nemo-green)" /> Recent Activity
            </h2>
            <Link href="/dashboard/projects" className="btn-ghost" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>View all <ArrowRight size={11} /></Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {recentActivity.map((a, i) => {
              const Icon = a.icon
              return (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.06 }}
                  style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: `${a.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={13} color={a.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.detail}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{a.action} · {a.time}</div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>

      {/* GPU Metrics Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        style={{ marginTop: 24, padding: 24, background: 'linear-gradient(135deg, rgba(118,185,0,0.08) 0%, rgba(0,212,255,0.05) 50%, rgba(124,58,237,0.05) 100%)', border: '1px solid rgba(118,185,0,0.2)', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: 11, background: 'rgba(118,185,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(118,185,0,0.2)' }}>
            <Cpu size={22} color="var(--nemo-green)" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>NVIDIA GPU Status</div>
            <div style={{ color: 'var(--nemo-green)', fontSize: '0.78rem', fontWeight: 600 }}>● All systems operational</div>
          </div>
        </div>
        {[
          { label: 'Model', value: 'Nemotron-70B' },
          { label: 'GPU Util', value: '62%' },
          { label: 'Throughput', value: '210 tok/s' },
          { label: 'Latency', value: '680ms P50' },
        ].map(m => (
          <div key={m.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{m.value}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{m.label}</div>
          </div>
        ))}
        <Link href="/dashboard/analytics" className="btn-primary" style={{ marginLeft: 'auto', padding: '10px 20px', fontSize: '0.82rem' }}>
          View Analytics <ArrowRight size={13} />
        </Link>
      </motion.div>
    </div>
  )
}
