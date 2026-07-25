import { useMemo } from 'react'

// Generates a field of small animated "spark" particles, purely CSS-driven.
// originX/originY are percentages within the parent (relative) container.
export default function SparksField({ count = 26, originX = 62, originY = 46, spread = 220, className = '' }) {
  const sparks = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const angle = (Math.random() * 140 - 70) * (Math.PI / 180) // mostly upward/outward cone
      const dist = 40 + Math.random() * spread
      const dx = Math.cos(angle) * dist
      const dy = -Math.abs(Math.sin(angle) * dist) - Math.random() * 30
      const size = 2.5 + Math.random() * 3.5
      const duration = 0.9 + Math.random() * 1.4
      const delay = Math.random() * 3.5
      const r = Math.random()
      const hue = r > 0.55 ? '#ff8a3d' : r > 0.25 ? '#ff5b3d' : '#e8272c'
      return { id: i, dx, dy, size, duration, delay, hue }
    })
  }, [count, spread])

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {sparks.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${originX}%`,
            top: `${originY}%`,
            width: s.size,
            height: s.size,
            background: s.hue,
            boxShadow: `0 0 8px 2px ${s.hue}, 0 0 16px 4px ${s.hue}`,
            '--dx': `${s.dx}px`,
            '--dy': `${s.dy}px`,
            animation: `spark-fall ${s.duration}s ease-out ${s.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
