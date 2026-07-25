export default function PanelArt({ Icon, seed = 0, image = '', className = '' }) {
  const id = `panel-${seed}`

  if (image) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <svg viewBox="0 0 400 260" className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#202226" />
            <stop offset="100%" stopColor="#0a0a0c" />
          </linearGradient>
          <radialGradient id={`${id}-glow`} cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#e8272c" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#e8272c" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="400" height="260" fill={`url(#${id}-bg)`} />
        <circle cx="120" cy="80" r="160" fill={`url(#${id}-glow)`} />
        <g opacity="0.12" stroke="#ffffff" strokeWidth="1">
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="260" />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 50} x2="400" y2={i * 50} />
          ))}
        </g>
        <line x1="0" y1="260" x2="400" y2="140" stroke="#e8272c" strokeOpacity="0.5" strokeWidth="1.5" />
      </svg>
      <div className="relative z-10 h-full w-full flex items-center justify-center">
        <div className="w-16 h-16 rounded-xl glass flex items-center justify-center text-red-500 group-hover:text-red-400 group-hover:scale-110 transition-all duration-300">
          <Icon size={30} strokeWidth={1.6} />
        </div>
      </div>
    </div>
  )
}
