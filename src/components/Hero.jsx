import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Calculator } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useCms } from '../data/cms'
import SparksField from './SparksField'
import heroPhoto from '../assets/photos/hero-machine.jpg'

export default function Hero() {
  const { content } = useCms()
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start']
  })
  const imageY = useTransform(scrollYProgress, [0, 1], [0, 80])

  return (
    <section ref={sectionRef} id="home" className="relative min-h-[92vh] flex items-end overflow-hidden bg-ink">
      {/* Scene */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 brushed-metal" />
        <motion.img
          src={heroPhoto}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-[65%_50%]"
          style={{ y: imageY }}
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
        <SparksField originX={62} originY={68} count={30} spread={180} />
        {/* Vignette */}
        <div className="absolute inset-0 vignette pointer-events-none" />
        {/* Grain overlay */}
        <div className="absolute inset-0 grain-overlay pointer-events-none" />
        {/* Light leak right */}
        <div className="absolute top-0 right-0 w-1/3 h-full pointer-events-none" style={{
          background: 'linear-gradient(105deg, transparent 0%, transparent 40%, rgba(232,39,44,0.06) 60%, rgba(232,39,44,0.12) 80%, rgba(255,180,77,0.08) 100%)',
          mixBlendMode: 'screen',
        }} />
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 pointer-events-none hero-gradient-shift" style={{
          background: 'linear-gradient(135deg, rgba(232,39,44,0.04) 0%, transparent 30%, rgba(232,39,44,0.03) 60%, transparent 100%)',
          backgroundSize: '200% 200%',
          animation: 'hero-gradient-drift 8s ease-in-out infinite alternate',
        }} />
        {/* Legibility gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-black/15" />
        <div className="absolute inset-0 opacity-[0.05] mix-blend-overlay" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27100%27 height=%27100%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%272%27/%3E%3C/filter%3E%3Crect width=%27100%27 height=%27100%27 filter=%27url(%23n)%27/%3E%3C/svg%3E")'
        }} />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto pl-0 lg:pl-1 pr-5 lg:pr-8 pb-16 pt-40 w-full">
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        >
          <h1 className="font-display font-semibold uppercase leading-[0.98] text-[clamp(3.6rem,9vw,6.9rem)] tracking-tight mb-6">
            <motion.span
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              className="block text-metal-gradient"
            >
              {content.hero.title1}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.45 }}
              className="block text-metal-gradient"
            >
              {content.hero.title2}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
              className="block text-red-gradient drop-shadow-[0_0_25px_rgba(232,39,44,0.35)]"
            >
              {content.hero.title3}
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.75 }}
            className="text-steel-300 text-[20px] md:text-[22px] leading-relaxed max-w-md mb-9"
          >
            {content.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.9 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link
              to="/services"
              className="group btn-red inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-red-600 hover:bg-red-500 text-white text-[14px] font-semibold uppercase tracking-wide transition-all duration-200 shadow-red-glow hover:-translate-y-0.5"
            >
              {content.hero.cta1}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/contacts"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-md glass text-white text-[14px] font-semibold uppercase tracking-wide hover:border-white/30 transition-all duration-200"
            >
              <Calculator size={16} />
              {content.hero.cta2}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
