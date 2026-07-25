import { motion } from 'framer-motion'

const directionMap = {
  up: { y: 30, x: 0 },
  down: { y: -30, x: 0 },
  left: { x: 30, y: 0 },
  right: { x: -30, y: 0 },
}

export default function AnimatedSection({
  children,
  className = '',
  delay = 0,
  direction = 'up',
}) {
  const offset = directionMap[direction] || directionMap.up

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, scale: 0.96, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  )
}
