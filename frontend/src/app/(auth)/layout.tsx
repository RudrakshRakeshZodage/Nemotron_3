import { AuthProvider } from '@/lib/auth-context'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(118,185,0,0.1) 0%, transparent 60%), var(--bg-primary)',
        padding: '24px'
      }}>
        {/* Grid */}
        <div style={{
          position: 'fixed', inset: 0, opacity: 0.02, pointerEvents: 'none',
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
        {children}
      </div>
    </AuthProvider>
  )
}
