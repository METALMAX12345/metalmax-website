import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n'
import { useCms } from '../data/cms'
import AnimatedSection from './AnimatedSection'

export default function About({ hideHeading = false }) {
  const { t, lang } = useI18n()
  const { content } = useCms()
  const c = content.about
  const aboutText = lang === 'uk' ? c.text : (t.about.text || c.text)
  const aboutTitle = lang === 'uk' ? c.title : (t.about.title || c.title)
  const aboutEyebrow = lang === 'uk' ? c.eyebrow : (t.about.eyebrow || c.eyebrow)
  const aboutCta = lang === 'uk' ? c.cta : (t.about.cta || c.cta)

  return (
    <>
    <section id="about" className="relative py-24 md:py-32 bg-graphite-950 border-y border-white/8 overflow-hidden">
      <div className="absolute -right-40 top-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-red-600/10 blur-[100px]" />
      <div className="max-w-[1400px] mx-auto px-5 lg:pl-2 lg:pr-8 relative">
        <AnimatedSection direction="right">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              {!hideHeading && (
                <>
                  <div className="inline-flex items-center gap-2 mb-4">
                    <span className="h-px w-10 bg-red-500" />
                    <span className="eyebrow text-[13px] font-semibold text-red-400">{aboutEyebrow}</span>
                  </div>
                  <h2 className="font-display font-semibold uppercase text-[clamp(2rem,4vw,3.2rem)] tracking-tight text-metal-gradient mb-6">
                    {aboutTitle}
                  </h2>
                </>
              )}
              <p className="text-steel-300 text-[19px] md:text-[21px] leading-relaxed mb-8 max-w-xl">
                {aboutText}
              </p>
              {!hideHeading && (
              <Link
                to="/about"
                className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-md glass btn-red text-white text-[14px] font-semibold uppercase tracking-wide hover:border-red-500/50 transition-all duration-200"
              >
                  {aboutCta}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </div>

            <div className="relative rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(232,39,44,0.15)]">
              <img src="/about-image.png" alt="About METALMAX" className="w-full h-auto object-cover rounded-2xl scale-[1.1_1.18]" />
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
    <div className="py-12 bg-graphite-950">
      <div
        className="h-[3px] w-full bg-gradient-to-r from-transparent via-red-500 to-transparent"
        style={{
          animation: 'pulse-glow 2s ease-in-out infinite',
          boxShadow: '0 0 20px rgba(232,39,44,0.4), 0 0 60px rgba(232,39,44,0.15)',
        }}
      />
    </div>
    </>
  )
}
