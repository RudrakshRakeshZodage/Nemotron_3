'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FolderOpen, Trash2, Download, Search, Plus, FileText, MessageSquare, BookOpen } from 'lucide-react'
import Link from 'next/link'
import { downloadMarkdown } from '@/lib/utils'
import { getLocalProjects, deleteLocalProject, Project } from '@/lib/projectsStore'

const typeConfig = {
  chat: { icon: MessageSquare, color: '#76b900', label: 'Chat' },
  blog: { icon: FileText, color: '#7c3aed', label: 'Blog' },
  paper: { icon: BookOpen, color: '#ec4899', label: 'Paper' },
  agent: { icon: FolderOpen, color: '#00d4ff', label: 'Agent' },
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    setProjects(getLocalProjects())
  }, [])

  const filtered = projects.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || p.type === filter
    return matchSearch && matchFilter
  })

  const deleteProject = (id: string) => {
    deleteLocalProject(id)
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div style={{ padding: '40px', minHeight: '100vh', maxWidth: 1100 }}>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 11, background: 'rgba(118,185,0,0.15)', border: '1px solid rgba(118,185,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FolderOpen size={20} color="var(--nemo-green)" />
            </div>
            <div>
              <h1 style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.03em' }}>Projects</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{projects.length} saved projects</p>
            </div>
          </div>
          <Link href="/dashboard/chat" className="btn-primary" style={{ fontSize: '0.85rem', padding: '10px 20px' }}>
            <Plus size={15} /> New Project
          </Link>
        </div>
      </motion.div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="form-input" placeholder="Search projects…" value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: 36 }} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['all', 'chat', 'blog', 'paper', 'agent'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 14px', fontSize: '0.78rem', fontWeight: 500, borderRadius: 100, border: `1px solid ${filter === f ? 'var(--nemo-green)' : 'var(--border-color)'}`, background: filter === f ? 'rgba(118,185,0,0.12)' : 'transparent', color: filter === f ? 'var(--nemo-green)' : 'var(--text-secondary)', cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.15s' }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Projects grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-muted)' }}>
          <FolderOpen size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
          <p>No projects found</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {filtered.map((project, i) => {
            const cfg = typeConfig[project.type]
            const Icon = cfg.icon
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="glass-card"
                style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}
                whileHover={{ y: -2, boxShadow: `0 12px 40px ${cfg.color}12` }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: `${cfg.color}15`, border: `1px solid ${cfg.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} color={cfg.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <h3 style={{ fontWeight: 700, fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{project.title}</h3>
                      <span style={{ fontSize: '0.65rem', padding: '2px 7px', background: `${cfg.color}15`, color: cfg.color, borderRadius: 100, fontWeight: 700, flexShrink: 0 }}>{cfg.label}</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{project.description}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{project.createdAt}</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={() => downloadMarkdown(project.content, project.title)} className="btn-ghost" style={{ padding: '5px 8px' }} title="Download">
                      <Download size={13} />
                    </button>
                    <button onClick={() => deleteProject(project.id)} className="btn-ghost" style={{ padding: '5px 8px', color: '#f87171' }} title="Delete">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
