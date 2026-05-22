'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, MessageSquare, Bot, FolderOpen,
  FileText, BookOpen, BarChart2, Settings, LogOut,
  Zap, X, ChevronLeft
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import ThemeToggle from './ThemeToggle'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/chat', label: 'AI Chat', icon: MessageSquare },
  { href: '/dashboard/agent', label: 'Agent Studio', icon: Bot },
  { href: '/dashboard/projects', label: 'Projects', icon: FolderOpen },
  { href: '/dashboard/blog', label: 'Blog Generator', icon: FileText },
  { href: '/dashboard/paper', label: 'Paper Generator', icon: BookOpen },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ open, onClose }: { open?: boolean; onClose?: () => void }) {
  const pathname = usePathname()
  const { signOut, user } = useAuth()

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/60 z-90 md:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <aside className={`sidebar ${open ? 'open' : ''}`} style={{ zIndex: 101 }}>
        {/* Logo */}
        <div style={{
          padding: '20px 20px 16px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #76b900, #a3e635)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(118,185,0,0.4)'
            }}>
              <Zap size={18} color="#000" strokeWidth={2.5} />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Nemo<span style={{ color: 'var(--nemo-green)' }}>Core</span>
            </span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ThemeToggle />
            <button className="btn-ghost md:hidden" onClick={onClose} style={{ padding: 6, display: 'flex' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 12px', overflowY: 'auto' }}>
          {navItems.map((item, i) => {
            const Icon = item.icon
            const active = pathname === item.href
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 12px', borderRadius: 10, marginBottom: 2,
                    textDecoration: 'none', transition: 'all 0.15s ease',
                    background: active ? 'rgba(118,185,0,0.12)' : 'transparent',
                    color: active ? 'var(--nemo-green)' : 'var(--text-secondary)',
                    fontWeight: active ? 600 : 400, fontSize: '0.875rem',
                    borderLeft: active ? '3px solid var(--nemo-green)' : '3px solid transparent',
                  }}
                  onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'var(--bg-card-hover)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)' } }}
                  onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)' } }}
                >
                  <Icon size={17} />
                  {item.label}
                  {item.label === 'Agent Studio' && (
                    <span style={{
                      marginLeft: 'auto', fontSize: '0.65rem', padding: '2px 7px',
                      background: 'rgba(118,185,0,0.15)', color: 'var(--nemo-green)',
                      borderRadius: 100, fontWeight: 700, letterSpacing: '0.05em'
                    }}>PRO</span>
                  )}
                </Link>
              </motion.div>
            )
          })}
        </nav>

        {/* User */}
        <div style={{ padding: '12px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 10,
            background: 'var(--bg-card)', marginBottom: 8
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #76b900, #00d4ff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 700, color: '#000', flexShrink: 0
            }}>
              {user?.email?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email?.split('@')[0] ?? 'User'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.email ?? 'demo@nemocore.ai'}
              </div>
            </div>
          </div>
          <button
            onClick={signOut}
            className="btn-ghost"
            style={{ width: '100%', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}
          >
            <LogOut size={15} /> Sign out
          </button>
        </div>
      </aside>
    </>
  )
}
