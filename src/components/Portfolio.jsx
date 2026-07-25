import { useMemo, useState } from 'react'
import { X, ZoomIn } from 'lucide-react'
import { useI18n } from '../i18n'
import { useCms } from '../data/cms'
import SectionHeading from './SectionHeading'
import AnimatedSection from './AnimatedSection'
import TiltCard from './TiltCard'


function GalleryArt({ seed, image }) {
  const id = `gal-${seed}`
  const hue1 = ['#2a2c31', '#1f2024', '#3a3c42', '#17181c', '#242529', '#151619'][seed % 6]

  if (image) {
    return <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" />
  }

  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={hue1} />
          <stop offset="100%" stopColor="#08080a" />
        </linearGradient>
        <radialGradient id={`${id}-r`} cx="70%" cy="20%" r="60%">
          <stop offset="0%" stopColor="#e8272c" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#e8272c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill={`url(#${id}-g)`} />
      <circle cx="300" cy="80" r="180" fill={`url(#${id}-r)`} />
      <g stroke="#ffffff" strokeOpacity="0.08" strokeWidth="1">
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={i} x1={i * 55} y1="0" x2={i * 55} y2="400" />
        ))}
      </g>
      <polygon
        points={`${40 + (seed * 17) % 60},350 ${160 + (seed * 23) % 80},80 ${320 - (seed * 13) % 60},350`}
        fill="none"
        stroke="#8a8c92"
        strokeWidth="2"
        opacity="0.5"
      />
    </svg>
  )
}

export default function Portfolio({ hideHeading = false, limit }) {
  const { t, lang } = useI18n()
  const { content } = useCms()
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(null)

  const c = content.portfolio
  const sourceItems = c.items.map((cmsItem, i) => {
    if (lang === 'uk') return cmsItem
    const staticItem = t.portfolio.items[i]
    return {
      ...cmsItem,
      title: staticItem?.title || cmsItem.title,
      cat: staticItem?.cat || cmsItem.cat,
    }
  })

  const filtered = useMemo(() => {
    const mapped = limit
      ? sourceItems.slice(0, limit).map((it, i) => ({ ...it, i }))
      : sourceItems.map((it, i) => ({ ...it, i }))
    if (active === 0) return mapped
    const cat = (lang === 'uk' ? c.filters : t.portfolio.filters)[active]
    return mapped.filter((it) => it.cat === cat)
  }, [active, sourceItems, limit, t, lang, c])

  return (
    <section id="portfolio" className="relative bg-ink">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-8 py-20 md:py-28">
        {!hideHeading && (
          <SectionHeading eyebrow={lang === 'uk' ? c.eyebrow : t.portfolio.eyebrow} title={lang === 'uk' ? c.title : t.portfolio.title} viewAll={lang === 'uk' ? c.viewAll : t.portfolio.viewAll} href="/portfolio" />
        )}

        <div className="flex flex-wrap gap-2 mb-8">
          {(lang === 'uk' ? c.filters : t.portfolio.filters).map((f, i) => (
            <button
              key={f}
              onClick={() => setActive(i)}
              className={`px-4 py-2 rounded-md text-[13px] font-medium uppercase tracking-wide transition-colors duration-200 ${
                active === i ? 'bg-red-600 text-white' : 'glass text-steel-300 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((item, index) => (
            <AnimatedSection key={item.i} delay={(index % 3) * 0.1}>
              <TiltCard className="h-full w-full">
                <button
                  onClick={() => setLightbox(item)}
                  className="group relative aspect-square rounded-xl overflow-hidden border border-white/8 hover:border-red-500/40 transition-colors duration-300 text-left w-full metal-shimmer"
                >
                  <GalleryArt seed={item.i} image={item.image} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-11 h-11 rounded-full glass-strong flex items-center justify-center text-white">
                      <ZoomIn size={18} />
                    </div>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 p-4">
                    <div className="text-[13px] font-semibold text-white">{item.title}</div>
                    <div className="text-[11px] uppercase tracking-wide text-red-400">{item.cat}</div>
                  </div>
                </button>
              </TiltCard>
            </AnimatedSection>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 w-10 h-10 rounded-full glass flex items-center justify-center text-white"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <div className="relative w-full max-w-2xl aspect-square rounded-2xl overflow-hidden border border-white/10" onClick={(e) => e.stopPropagation()}>
            <GalleryArt seed={lightbox.i} image={lightbox.image} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
            <div className="absolute bottom-0 inset-x-0 p-8">
              <div className="text-[20px] font-display font-medium text-white uppercase">{lightbox.title}</div>
              <div className="text-[13px] uppercase tracking-wide text-red-400 mt-1">{lightbox.cat}</div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
