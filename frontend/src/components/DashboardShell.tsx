'use client'

import { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'
import Sidebar from './Sidebar'
import ApiKeyModal from './ApiKeyModal'

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showApiModal, setShowApiModal] = useState(false)

  useEffect(() => {
    // Show modal if neither key has been set and demo mode not previously selected
    const hasNvidia = !!localStorage.getItem('nemocore_nvidia_key')
    const hasOpenrouter = !!localStorage.getItem('nemocore_openrouter_key')
    const isDemoMode = !!localStorage.getItem('nemocore_demo_mode')
    if (!hasNvidia && !hasOpenrouter && !isDemoMode) {
      setShowApiModal(true)
    }
  }, [])

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

      {/* API Key modal — shown only when no keys are configured */}
      {showApiModal && <ApiKeyModal onClose={() => setShowApiModal(false)} />}
    </div>
  )
}
