import { Zap, Layers, Flame as FlameIcon, Cpu, Disc3, Cog } from 'lucide-react'
import { useI18n } from '../i18n'
import { useCms } from '../data/cms'
import SectionHeading from './SectionHeading'
import PanelArt from './PanelArt'
import AnimatedSection from './AnimatedSection'
import TiltCard from './TiltCard'

const ICONS = [Zap, Layers, FlameIcon, Cpu, Disc3, Cog]

export default function Equipment({ hideHeading = false }) {
  const { t, lang } = useI18n()
  const { content } = useCms()
  const c = content.equipment
  const items = c.items.map((cmsItem, i) => {
    if (lang === 'uk') return cmsItem
    const staticItem = t.equipment.items[i]
    return {
      ...cmsItem,
      title: staticItem?.title || cmsItem.title,
      specs: staticItem?.specs || cmsItem.specs,
    }
  })

  return (
    <section id="equipment" className="relative py-20 md:py-28 bg-graphite-950 border-y border-white/8">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-8">
        {!hideHeading && (
          <SectionHeading eyebrow={lang === 'uk' ? c.eyebrow : t.equipment.eyebrow} title={lang === 'uk' ? c.title : t.equipment.title} viewAll={lang === 'uk' ? c.viewAll : t.equipment.viewAll} href="/equipment" />
        )}

        <div className="flex flex-col gap-4">
          {items.map((eq, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
            <TiltCard className="h-full">
            <div
              key={i}
              className="group relative flex flex-col sm:flex-row gap-0 sm:gap-6 rounded-xl overflow-hidden border border-white/8 bg-graphite-900 hover:border-red-500/40 transition-all duration-300 metal-shimmer"
            >
                <PanelArt Icon={ICONS[i % ICONS.length]} seed={10 + i} image={eq.image} className="h-40 sm:h-auto sm:w-56 shrink-0" />
                <div className="flex-1 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display font-medium uppercase text-[17px] tracking-wide text-steel-100 mb-2.5 leading-snug">
                      {eq.title}
                    </h3>
                    <ul className="flex flex-wrap gap-x-6 gap-y-1.5">
                      {eq.specs.map((spec, j) => (
                        <li key={j} className="flex items-center gap-2 text-[13px] text-steel-300/80">
                          <span className="w-1 h-1 rounded-full bg-red-500 shrink-0" />
                          {spec}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {eq.price && (
                    <div className="text-[13px] font-semibold text-red-400 shrink-0">{eq.price}</div>
                  )}
                </div>
                <div className="absolute inset-y-0 left-0 w-[2px] bg-red-500 scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-500" />
              </div>
            </TiltCard>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
