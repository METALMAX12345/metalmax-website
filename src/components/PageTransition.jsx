import { motion } from 'framer-motion'

const variants = {
  initial: {
    opacity: 0,
    scale: 0.995,
  },
  animate: {
    opacity: 1,
    scale: 1,
  },
  exit: {
    opacity: 0,
    scale: 1.002,
  },
}

export default function PageTransition({ children }) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        opacity: { duration: 0.25, ease: 'easeInOut' },
        scale: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
      }}
      style={{ willChange: 'opacity, transform' }}
    >
      {children}
    </motion.div>
  )
}
