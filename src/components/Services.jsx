import { Zap, Layers, Flame, Building2, SprayCan, Cog } from 'lucide-react'
import { ArrowUpRight } from 'lucide-react'
import { useI18n } from '../i18n'
import { useCms } from '../data/cms'
import SectionHeading from './SectionHeading'
import PanelArt from './PanelArt'
import AnimatedSection from './AnimatedSection'
import TiltCard from './TiltCard'

const ICONS = [Zap, Layers, Flame, Building2, SprayCan, Cog]

export default function Services({ hideHeading = false, limit }) {
  const { t, lang } = useI18n()
  const { content } = useCms()
  const c = content.services
  const items = c.items.map((cmsItem, i) => {
    if (lang === 'uk') return cmsItem
    const staticItem = t.services.items[i]
    return {
      ...cmsItem,
      title: staticItem?.title || cmsItem.title,
      desc: staticItem?.desc || cmsItem.desc,
    }
  })

  const displayItems = limit ? items.slice(0, limit) : items

  return (
    <section id="services" className="relative py-20 md:py-28 bg-ink">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-8">
        {!hideHeading && (
          <SectionHeading eyebrow={lang === 'uk' ? c.eyebrow : t.services.eyebrow} title={lang === 'uk' ? c.title : t.services.title} viewAll={lang === 'uk' ? c.viewAll : t.services.viewAll} href="/services" />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayItems.map((s, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
            <TiltCard className="h-full">
              <div
                key={i}
                className="group relative rounded-xl overflow-hidden border border-white/8 bg-graphite-900 hover:border-red-500/40 transition-all duration-300 hover:-translate-y-1 metal-shimmer"
              >
                <PanelArt Icon={ICONS[i % ICONS.length]} seed={i} image={s.image} className="h-40" />
                <div className="p-6">
                  <h3 className="font-display font-medium uppercase text-[18px] tracking-wide text-steel-100 mb-2 flex items-center justify-between">
                    {s.title}
                    <ArrowUpRight size={18} className="text-steel-500 group-hover:text-red-500 group-hover:rotate-45 transition-all duration-300" />
                  </h3>
                  <p className="text-[14px] leading-relaxed text-steel-300/80">{s.desc}</p>
                  {s.price && (
                    <div className="mt-3 text-[13px] font-semibold text-red-400">{s.price}</div>
                  )}
                </div>
                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-red-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500" />
              </div>
            </TiltCard>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
