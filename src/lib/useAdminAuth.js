import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from './supabaseClient'

const DEMO_PASSWORD = 'metalmax'
const DEMO_KEY = 'metalmax_admin'

// authed: null = still checking (Supabase mode only), true/false once known.
export function useAdminAuth() {
  const [authed, setAuthed] = useState(() =>
    isSupabaseConfigured ? null : window.sessionStorage.getItem(DEMO_KEY) === '1'
  )

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined

    let cancelled = false
    supabase.auth.getSession().then(({ data }) => {
      if (!cancelled) setAuthed(Boolean(data.session))
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(Boolean(session))
    })

    return () => {
      cancelled = true
      sub.subscription.unsubscribe()
    }
  }, [])

  const loginWithPassword = async (password) => {
    if (password === DEMO_PASSWORD) {
      window.sessionStorage.setItem(DEMO_KEY, '1')
      setAuthed(true)
      return { error: null }
    }
    return { error: 'Невірний пароль' }
  }

  const loginWithEmail = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
    return { error: null }
  }

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut()
    } else {
      window.sessionStorage.removeItem(DEMO_KEY)
      setAuthed(false)
    }
  }

  return { authed, loginWithPassword, loginWithEmail, logout }
}
