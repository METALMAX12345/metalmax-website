import { Target, ShieldCheck, Clock, Settings2 } from 'lucide-react'
import { useI18n } from '../i18n'
import AnimatedSection from './AnimatedSection'

export default function Features() {
  const { t } = useI18n()
  const items = [
    { icon: Target, title: t.features.f1t, sub: t.features.f1s },
    { icon: ShieldCheck, title: t.features.f2t, sub: t.features.f2s },
    { icon: Clock, title: t.features.f3t, sub: t.features.f3s },
    { icon: Settings2, title: t.features.f4t, sub: t.features.f4s },
  ]

  return (
    <section className="relative z-10 -mt-px border-y border-white/8 bg-graphite-950">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/8">
          {items.map((it, i) => (
            <AnimatedSection key={i} delay={i * 0.08}>
              <div className="flex items-center gap-3.5 py-6 px-4 md:px-6">
                <div className="shrink-0 text-red-500">
                  <it.icon size={26} strokeWidth={1.6} />
                </div>
                <div className="min-w-0">
                  <div className="text-[13.5px] font-semibold text-steel-100 truncate">{it.title}</div>
                  <div className="text-[12.5px] text-steel-300/70 truncate">{it.sub}</div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
