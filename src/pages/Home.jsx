import Header from '../components/Header'
import Hero from '../components/Hero'
import Services from '../components/Services'
import Portfolio from '../components/Portfolio'
import { useCms } from '../data/cms'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Footer from '../components/Footer'
import AnimatedSection from '../components/AnimatedSection'

export default function Home() {
  const { content } = useCms()
  const s = content.sections || {}
  return (
    <>
      <Header />
      <main>
        <Hero />

        <div className="py-10 bg-ink">
          <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-red-500 to-transparent"
            style={{ animation: 'pulse-glow 2s ease-in-out infinite', boxShadow: '0 0 20px rgba(232,39,44,0.4), 0 0 60px rgba(232,39,44,0.15)' }}
          />
        </div>

        <section className="relative py-16 md:py-20 overflow-hidden">
          <div className="max-w-[800px] mx-auto px-5 lg:px-8 text-center">
            <AnimatedSection>
              <p className="text-[18px] md:text-[20px] text-steel-300/80 leading-relaxed">
                {content.hero.homeDescription}
              </p>
            </AnimatedSection>
          </div>
        </section>

        <div className="py-10 bg-ink">
          <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-red-500 to-transparent"
            style={{ animation: 'pulse-glow 2s ease-in-out infinite', boxShadow: '0 0 20px rgba(232,39,44,0.4), 0 0 60px rgba(232,39,44,0.15)' }}
          />
        </div>

        {s.services && <Services limit={3} />}

        <div className="py-10 bg-ink">
          <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-red-500 to-transparent"
            style={{ animation: 'pulse-glow 2s ease-in-out infinite', boxShadow: '0 0 20px rgba(232,39,44,0.4), 0 0 60px rgba(232,39,44,0.15)' }}
          />
        </div>

        {s.portfolio && <Portfolio limit={3} />}

        <div className="py-10 bg-ink">
          <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-red-500 to-transparent"
            style={{ animation: 'pulse-glow 2s ease-in-out infinite', boxShadow: '0 0 20px rgba(232,39,44,0.4), 0 0 60px rgba(232,39,44,0.15)' }}
          />
        </div>

        <section className="relative py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-0 bg-graphite-950" />
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, rgba(232,39,44,0.12) 0%, transparent 70%)' }}
          />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
          <div className="max-w-[1400px] mx-auto px-5 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="h-px w-10 bg-red-500" />
              <span className="eyebrow text-[12px] font-semibold text-red-400 tracking-[0.18em] uppercase">CTA</span>
              <span className="h-px w-10 bg-red-500" />
            </div>
            <h2 className="font-display font-semibold text-[clamp(1.8rem,4vw,3rem)] text-white uppercase tracking-tight mb-4">
              Готові розпочати проект?
            </h2>
            <p className="text-[16px] text-steel-300/80 mb-10 max-w-lg mx-auto leading-relaxed">
              Залиште заявку та ми підготуємо індивідуальну пропозицію протягом 1 години
            </p>
            <Link
              to="/contacts"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-md bg-red-600 hover:bg-red-500 text-white text-[14px] font-semibold uppercase tracking-wide transition-all duration-300 shadow-red-glow hover:-translate-y-0.5"
              style={{ animation: 'glow-pulse 3s ease-in-out infinite' }}
            >
              Зв&apos;язатися з нами
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
