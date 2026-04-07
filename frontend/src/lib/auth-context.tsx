'use client'

import { createClient, isDemoMode } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'

const DEMO_USER = { email: 'demo@nemocore.ai', id: 'demo-user' } as unknown as User

const AuthContext = createContext<{
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}>({ user: null, loading: true, signOut: async () => {} })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(isDemoMode ? DEMO_USER : null)
  const [loading, setLoading] = useState(!isDemoMode)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    if (isDemoMode) { setUser(DEMO_USER); setLoading(false); return }
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    if (!isDemoMode) await supabase.auth.signOut()
    router.push('/login')
  }

  return <AuthContext.Provider value={{ user, loading, signOut }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
