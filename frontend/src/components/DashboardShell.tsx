'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="dashboard-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main-content">
        {/* Mobile header */}
        <div className="md:hidden" style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)',
          padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12
        }}>
          <button onClick={() => setSidebarOpen(true)} className="btn-ghost" style={{ padding: 8 }}>
            <Menu size={20} />
          </button>
          <span style={{ fontWeight: 800, fontSize: '1rem' }}>
            Nemo<span style={{ color: 'var(--nemo-green)' }}>Core</span>
          </span>
        </div>
        {children}
      </main>
    </div>
  )
}
