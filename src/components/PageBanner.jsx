import { useMemo, useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'

export default function PageBanner({ eyebrow, title, subtitle, bgImage }) {
  const sectionRef = useRef(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [2, -2]), { stiffness: 150, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-2, 2]), { stiffness: 150, damping: 30 })

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    mouseX.set((e.clientX - centerX) / rect.width)
    mouseY.set((e.clientY - centerY) / rect.height)
  }

  function handleMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  })

  const imageY = useTransform(scrollYProgress, [0, 1], [0, -40])
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.15])

  const particles = useMemo(() => Array.from({ length: 10 }).map((_, i) => ({
    id: i,
    left: `${10 + Math.random() * 80}%`,
    size: 2 + Math.random() * 3,
    delay: Math.random() * 5,
    duration: 4 + Math.random() * 4,
  })), [])

  return (
    <section ref={sectionRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="relative pt-40 pb-16 md:pt-44 md:pb-20 overflow-hidden bg-ink border-b border-white/8 grain-overlay" style={{ perspective: '1200px', rotateX, rotateY, transformStyle: 'preserve-3d' }}>
      {bgImage && (
        <>
          <motion.img
            src={bgImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ y: imageY, scale: imageScale }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/50" />
        </>
      )}
      {!bgImage && <div className="absolute inset-0 brushed-metal opacity-70" />}

      {/* Animated gradient overlay */}
      <div className="absolute inset-0 banner-gradient-drift" />

      {/* Vignette effect */}
      <div className="absolute inset-0 vignette pointer-events-none" />

      {/* Light leak on left side (opposite of Hero) */}
      <div className="absolute -left-40 top-1/2 -translate-y-1/2 w-[500px] h-[600px] rounded-full bg-red-500/8 blur-[120px] pointer-events-none" />

      <div className="absolute -right-32 top-0 w-[420px] h-[420px] rounded-full bg-red-600/10 blur-[100px]" />

      {/* Light beam sweep */}
      <div className="banner-light-beam" />

      {/* Floating particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-white/15 pointer-events-none"
          style={{
            left: p.left,
            bottom: '10%',
            width: p.size,
            height: p.size,
            animation: `banner-float ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      <motion.div
        initial={{ rotateX: 5, rotateY: -2, opacity: 0, y: 40 }}
        animate={{ rotateX: 0, rotateY: 0, opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        className="relative max-w-[1400px] mx-auto px-5 lg:px-8 text-left"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="mb-5">
          <motion.span
            initial={{ opacity: 0, x: -30, letterSpacing: '0.3em' }}
            animate={{ opacity: 1, x: 0, letterSpacing: '0.18em' }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-semibold uppercase text-[clamp(1.2rem,2.5vw,1.8rem)] tracking-tight text-red-gradient"
            style={{ filter: 'drop-shadow(1px 2px 0 rgba(0,0,0,0.5)) drop-shadow(2px 4px 4px rgba(0,0,0,0.35))' }}
          >{eyebrow}</motion.span>
        </div>
        <motion.h1
          initial={{ opacity: 0, y: 40, clipPath: 'inset(100% 0 0 0)' }}
          animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0 0 0)' }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-semibold uppercase text-[clamp(3rem,6vw,4.5rem)] tracking-tight text-metal-gradient mb-5"
          style={{ filter: 'drop-shadow(2px 3px 0 rgba(0,0,0,0.6)) drop-shadow(4px 6px 4px rgba(0,0,0,0.4)) drop-shadow(0 8px 16px rgba(0,0,0,0.3))' }}
        >
          {title}
        </motion.h1>
        {subtitle && <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-steel-100 text-[19px] max-w-2xl leading-relaxed" style={{
          filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.6))',
          textShadow: '0 1px 3px rgba(0,0,0,0.5)',
        }}>{subtitle}</motion.p>}
      </motion.div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
    </section>
  )
}
