'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart2, Zap, Clock, Hash, Cpu, TrendingUp, Activity } from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts'
import { getAnalytics } from '@/lib/api'
import { formatNumber } from '@/lib/utils'

const COLORS = ['#76b900', '#00d4ff', '#7c3aed', '#ec4899', '#f59e0b']

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 8, padding: '10px 14px', fontSize: '0.78rem' }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: 4 }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ color: p.color || '#76b900', fontWeight: 600 }}>{p.name}: {p.value}</p>
        ))}
      </div>
    )
  }
  return null
}

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAnalytics('demo-user').then(setData).catch(() => {
      // Fallback mock
      setData({
        total_tokens: 24830, total_queries: 148, total_projects: 7, avg_response_ms: 680,
        daily: Array.from({ length: 7 }, (_, i) => ({ date: `Apr ${7 - i}`, queries: Math.floor(Math.random() * 45 + 5), tokens: Math.floor(Math.random() * 4500 + 300), avg_response_ms: Math.floor(Math.random() * 600 + 300) })).reverse(),
        model_usage: [{ model: 'Nemotron 70B', usage: 65 }, { model: 'Nemotron 8B', usage: 25 }, { model: 'Nano', usage: 10 }]
      })
    }).finally(() => setLoading(false))
  }, [])

  const topStats = [
    { label: 'Total Queries', value: data?.total_queries || 0, icon: Hash, color: '#76b900' },
    { label: 'Tokens Used', value: formatNumber(data?.total_tokens || 0), icon: Zap, color: '#00d4ff' },
    { label: 'Avg Response', value: `${data?.avg_response_ms || 0}ms`, icon: Clock, color: '#7c3aed' },
    { label: 'Projects', value: data?.total_projects || 0, icon: Cpu, color: '#ec4899' },
  ]

  if (loading) return (
    <div style={{ padding: 40, display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 20, height: 20, border: '2px solid var(--nemo-green)', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      Loading analytics…
    </div>
  )

  return (
    <div className="dashboard-page-container" style={{ maxWidth: 1200 }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart2 size={20} color="#00d4ff" />
          </div>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.03em' }}>Analytics</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>GPU-style metrics for your AI usage</p>
          </div>
        </div>
      </motion.div>

      {/* Top Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
        {topStats.map((s, i) => {
          const Icon = s.icon
          return (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="stat-card">
              <div style={{ width: 38, height: 38, borderRadius: 9, background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Icon size={17} color={s.color} />
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{s.label}</div>
            </motion.div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid-analytics-charts">
        {/* Queries over time */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <TrendingUp size={16} color="var(--nemo-green)" />
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Queries Over Time</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data?.daily || []}>
              <defs>
                <linearGradient id="queryGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#76b900" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#76b900" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="queries" name="Queries" stroke="#76b900" fill="url(#queryGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Model Usage */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Cpu size={16} color="var(--nemo-green)" />
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Model Usage</h3>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={data?.model_usage || []} dataKey="usage" nameKey="model" cx="50%" cy="50%" outerRadius={70} paddingAngle={4}>
                {(data?.model_usage || []).map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: any) => `${v}%`} contentStyle={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 8, fontSize: '0.78rem' }} />
              <Legend formatter={(v) => <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{v}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Tokens + Response Time */}
      <div className="grid-analytics-2col">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Zap size={16} color="#00d4ff" />
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Tokens per Day</h3>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={data?.daily || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="tokens" name="Tokens" fill="#00d4ff" radius={[4, 4, 0, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Activity size={16} color="#7c3aed" />
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Response Latency (ms)</h3>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={data?.daily || []}>
              <defs>
                <linearGradient id="latGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#475569', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="avg_response_ms" name="Latency (ms)" stroke="#7c3aed" fill="url(#latGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  )
}
