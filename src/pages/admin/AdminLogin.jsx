import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { isSupabaseConfigured } from '../../lib/supabaseClient'
import { useAdminAuth } from '../../lib/useAdminAuth'

export default function AdminLogin() {
  const { authed, loginWithPassword, loginWithEmail } = useAdminAuth()
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (authed) return <Navigate to="/admin/dashboard" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: err } = isSupabaseConfigured
      ? await loginWithEmail(email, pass)
      : await loginWithPassword(pass)
    setLoading(false)
    if (err) setError(err)
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-5">
      <div className="w-full max-w-sm glass-strong rounded-2xl p-8">
        <div className="w-12 h-12 rounded-xl bg-red-600/15 text-red-500 flex items-center justify-center mb-5">
          <Lock size={22} />
        </div>
        <h1 className="font-display font-semibold uppercase text-[22px] text-metal-gradient mb-1">METALMAX Admin</h1>

        {isSupabaseConfigured ? (
          <p className="text-[13px] text-steel-400 mb-6">
            Підключено до Supabase — зміни бачать усі відвідувачі сайту.
          </p>
        ) : (
          <p className="text-[13px] text-steel-400 mb-6">
            Локальний демо-режим (localStorage). Пароль: <code className="text-red-400">metalmax</code>.
            Щоб зміни бачили всі відвідувачі — підключіть Supabase (див. README).
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {isSupabaseConfigured && (
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError('') }}
              placeholder="Email адміністратора"
              className="w-full px-4 py-3 rounded-md bg-black/40 border border-white/10 text-[14px] text-white placeholder:text-steel-500 focus:border-red-500/60 focus:outline-none"
              autoFocus
            />
          )}
          <input
            type="password"
            value={pass}
            onChange={(e) => { setPass(e.target.value); setError('') }}
            placeholder="Пароль"
            className="w-full px-4 py-3 rounded-md bg-black/40 border border-white/10 text-[14px] text-white placeholder:text-steel-500 focus:border-red-500/60 focus:outline-none"
            autoFocus={!isSupabaseConfigured}
          />
          {error && <div className="text-[12.5px] text-red-400">{error}</div>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-md bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white text-[13px] font-semibold uppercase tracking-wide transition-colors"
          >
            {loading ? 'Вхід…' : 'Увійти'}
          </button>
        </form>
        <a href="/" className="block text-center mt-5 text-[12.5px] text-steel-400 hover:text-white transition-colors">← На сайт</a>
      </div>
    </div>
  )
}
