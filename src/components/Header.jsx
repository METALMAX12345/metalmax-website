import { useCallback, useEffect, useRef, useState } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { useI18n, LANGS } from '../i18n'
import { useCms } from '../data/cms'
import { Link, useLocation } from 'react-router-dom'
import QuoteModal from './QuoteModal'

const NAV_KEYS = [
  { key: 'home', href: '/' },
  { key: 'services', href: '/services' },
  { key: 'equipment', href: '/equipment' },
  { key: 'portfolio', href: '/portfolio' },
  { key: 'about', href: '/about' },
  { key: 'contacts', href: '/contacts' },
  { key: 'faq', href: '/faq' },
]

export default function Header() {
  const { t, lang, setLang } = useI18n()
  const { content } = useCms()
  const m = content.meta
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [quoteOpen, setQuoteOpen] = useState(false)
  const location = useLocation()
  const ctaRef = useRef(null)

  const handleRipple = useCallback((e) => {
    const btn = ctaRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    const ripple = document.createElement('span')
    ripple.style.cssText = `position:absolute;width:0;height:0;border-radius:50%;background:rgba(255,255,255,0.35);transform:translate(-50%,-50%);pointer-events:none;transition:width 0.6s ease, height 0.6s ease, opacity 0.6s ease;`
    ripple.style.left = `${x}%`
    ripple.style.top = `${y}%`
    btn.appendChild(ripple)
    requestAnimationFrame(() => {
      ripple.style.width = '250px'
      ripple.style.height = '250px'
      ripple.style.opacity = '0'
    })
    setTimeout(() => ripple.remove(), 650)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location])

  return (
    <>
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-strong shadow-[0_4px_30px_rgba(0,0,0,0.5)]' : 'bg-gradient-to-b from-black/70 to-transparent'
      } ${scrolled ? 'border-b border-red-500/10 shadow-[0_4px_30px_rgba(0,0,0,0.5),0_1px_0_rgba(232,39,44,0.08)]' : ''}`}
    >
      <div className="max-w-[1400px] mx-auto px-5 lg:px-8 h-[76px] flex items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-3 shrink-0 group metal-shimmer">
          <img
            src="/METALMAX.png"
            alt="METALMAX"
            className="h-[176px] w-auto object-contain transition-all duration-300 group-hover:scale-[1.06] group-hover:drop-shadow-[0_0_12px_rgba(232,39,44,0.3)]"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_KEYS.map((item) => {
            const isActive = location.pathname === item.href
            return (
              <Link
                key={item.key}
                to={item.href}
                className={`relative px-4 py-2 text-[13px] font-medium tracking-wide uppercase transition-colors duration-200 group ${
                  isActive ? 'text-white drop-shadow-[0_0_8px_rgba(232,39,44,0.4)]' : 'text-steel-300 hover:text-white'
                }`}
              >
                {lang === 'uk' ? (m[`nav${item.key.charAt(0).toUpperCase()}${item.key.slice(1)}`] || t.nav[item.key]) : t.nav[item.key]}
                <span className={`absolute left-4 right-4 -bottom-0.5 h-[2px] bg-red-500 origin-left transition-transform duration-300 ${
                  isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
              </Link>
            )
          })}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setLangOpen((v) => !v)}
              onBlur={() => setTimeout(() => setLangOpen(false), 150)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-white/10 text-[13px] font-semibold text-steel-200 hover:border-red-500/50 hover:text-white transition-colors duration-200"
            >
              {LANGS.find((l) => l.code === lang)?.label}
              <ChevronDown size={14} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 glass-strong rounded-md overflow-hidden min-w-[84px] py-1">
                {LANGS.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setLangOpen(false) }}
                    className={`w-full text-left px-3 py-2 text-[13px] font-medium transition-colors ${
                      l.code === lang ? 'text-red-400 bg-white/5' : 'text-steel-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            ref={ctaRef}
            onClick={(e) => { setQuoteOpen(true); handleRipple(e) }}
            className="btn-ripple relative px-5 py-2.5 rounded-md border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 text-white text-[13px] font-semibold uppercase tracking-wide transition-all duration-200 backdrop-blur-sm hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(232,39,44,0.3)]"
          >
            {lang === 'uk' ? m.navCta : t.nav.cta}
          </button>
        </div>

        <button
          className="lg:hidden text-white p-2"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <div
        className={`lg:hidden glass-strong border-t border-white/10 px-5 overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? 'max-h-[500px] py-5 opacity-100' : 'max-h-0 py-0 opacity-0 border-t-0'
        } flex flex-col gap-1`}
      >
          {NAV_KEYS.map((item) => (
            <Link
              key={item.key}
              to={item.href}
              onClick={() => setMobileOpen(false)}
              className="px-3 py-3 text-[15px] font-medium text-steel-200 border-b border-white/5 uppercase tracking-wide"
            >
              {lang === 'uk' ? (m[`nav${item.key.charAt(0).toUpperCase()}${item.key.slice(1)}`] || t.nav[item.key]) : t.nav[item.key]}
            </Link>
          ))}
          <div className="flex gap-2 mt-4">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={`flex-1 py-2 rounded-md border text-[13px] font-semibold ${
                  l.code === lang ? 'border-red-500 text-red-400' : 'border-white/10 text-steel-300'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => { setMobileOpen(false); setQuoteOpen(true) }}
            className="btn-red mt-3 text-center px-5 py-3 rounded-md bg-red-600 text-white text-[13px] font-semibold uppercase tracking-wide"
          >
            {lang === 'uk' ? m.navCta : t.nav.cta}
          </button>
        </div>
    </header>
    <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </>
  )
}
