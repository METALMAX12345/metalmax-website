import { useCms } from '../data/cms'
import { Phone, Mail, Wrench } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'

export default function MaintenanceBanner() {
  const { content } = useCms()
  const m = content.maintenance
  const { pathname } = useLocation()

  if (!m?.enabled) return null
  if (pathname.startsWith('/admin')) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-ink" />
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at center, rgba(232,39,44,0.08) 0%, transparent 70%)',
      }} />
      <div className="absolute inset-0 vignette pointer-events-none" />
      <div className="absolute inset-0 grain-overlay pointer-events-none" />

      <div className="absolute inset-4 md:inset-8 lg:inset-16 rounded-2xl border border-red-500/20 pointer-events-none" style={{
        boxShadow: '0 0 40px rgba(232,39,44,0.1), inset 0 0 40px rgba(232,39,44,0.05)',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="relative z-10 max-w-lg w-full glass-strong rounded-2xl p-8 md:p-12 text-center border border-white/10"
      >
        <div className="w-16 h-16 rounded-2xl bg-red-600/15 text-red-500 flex items-center justify-center mx-auto mb-6">
          <Wrench size={32} strokeWidth={1.5} />
        </div>

        <h1 className="font-display font-semibold uppercase text-[clamp(1.5rem,4vw,2.2rem)] text-metal-gradient mb-4 tracking-tight">
          {m.title}
        </h1>

        <p className="text-steel-300 text-[15px] leading-relaxed mb-8 max-w-md mx-auto">
          {m.subtitle}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {m.phone && (
            <a href={`tel:${m.phone.replace(/[^\d+]/g, '')}`} className="inline-flex items-center gap-2 px-5 py-3 rounded-lg glass hover:border-red-500/40 transition-all duration-300 text-[13px] text-steel-200 hover:text-white">
              <Phone size={15} />
              {m.phone}
            </a>
          )}
          {m.email && (
            <a href={`mailto:${m.email}`} className="inline-flex items-center gap-2 px-5 py-3 rounded-lg glass hover:border-red-500/40 transition-all duration-300 text-[13px] text-steel-200 hover:text-white">
              <Mail size={15} />
              {m.email}
            </a>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-white/8">
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-red-500/50 to-transparent" style={{ animation: 'pulse-glow 2s ease-in-out infinite' }} />
        </div>
      </motion.div>
    </motion.div>
  )
}
