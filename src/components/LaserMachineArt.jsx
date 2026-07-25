export default function LaserMachineArt({ className = '' }) {
  return (
    <svg
      viewBox="0 0 1000 640"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1a1b1f" />
          <stop offset="100%" stopColor="#08080a" />
        </linearGradient>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3a3c42" />
          <stop offset="45%" stopColor="#1f2024" />
          <stop offset="100%" stopColor="#0d0e10" />
        </linearGradient>
        <linearGradient id="railGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#c7c9cf" />
          <stop offset="50%" stopColor="#6c6e74" />
          <stop offset="100%" stopColor="#c7c9cf" />
        </linearGradient>
        <radialGradient id="beamGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffdca8" stopOpacity="1" />
          <stop offset="35%" stopColor="#ff8a3d" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ff3b1a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sheetGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4a4c52" />
          <stop offset="100%" stopColor="#222327" />
        </linearGradient>
        <filter id="softBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="12" />
        </filter>
      </defs>

      {/* Floor */}
      <rect x="0" y="520" width="1000" height="120" fill="url(#floorGrad)" />
      <g opacity="0.25" stroke="#3a3c42" strokeWidth="1">
        {Array.from({ length: 14 }).map((_, i) => (
          <line key={i} x1={-100 + i * 90} y1="640" x2={200 + i * 90} y2="520" />
        ))}
      </g>

      {/* Ambient red glow */}
      <circle cx="650" cy="330" r="260" fill="#e8272c" opacity="0.10" filter="url(#softBlur)" />

      {/* Machine base/table */}
      <rect x="120" y="470" width="620" height="34" rx="4" fill="url(#bodyGrad)" stroke="#000" strokeOpacity="0.4" />
      {Array.from({ length: 10 }).map((_, i) => (
        <rect key={i} x={150 + i * 58} y="478" width="34" height="18" rx="2" fill="#0b0c0e" opacity="0.6" />
      ))}

      {/* Metal sheet on table with cut pattern */}
      <rect x="170" y="440" width="520" height="34" fill="url(#sheetGrad)" stroke="#0b0c0e" strokeWidth="1.5" />
      <g stroke="#0b0c0e" strokeWidth="1" opacity="0.5">
        <line x1="260" y1="440" x2="260" y2="474" />
        <line x1="380" y1="440" x2="380" y2="474" />
        <line x1="500" y1="440" x2="500" y2="474" />
        <line x1="600" y1="440" x2="600" y2="474" />
      </g>

      {/* Gantry uprights */}
      <rect x="130" y="120" width="26" height="360" rx="3" fill="url(#bodyGrad)" />
      <rect x="704" y="120" width="26" height="360" rx="3" fill="url(#bodyGrad)" />

      {/* Top rail */}
      <rect x="120" y="108" width="620" height="30" rx="4" fill="url(#bodyGrad)" stroke="#000" strokeOpacity="0.3" />
      <rect x="140" y="118" width="580" height="6" rx="3" fill="url(#railGrad)" opacity="0.8" />

      {/* Gantry bridge (moving beam carrying the head) */}
      <g>
        <rect x="120" y="230" width="620" height="22" rx="3" fill="url(#bodyGrad)" stroke="#000" strokeOpacity="0.3" />
        <rect x="130" y="236" width="600" height="4" fill="url(#railGrad)" opacity="0.7" />

        {/* Vertical carriage + head */}
        <rect x="555" y="240" width="34" height="150" rx="4" fill="url(#bodyGrad)" stroke="#000" strokeOpacity="0.35" />
        <rect x="562" y="252" width="20" height="120" rx="2" fill="#0b0c0e" opacity="0.5" />

        {/* Laser head nozzle */}
        <path d="M562 388 L582 388 L576 412 L568 412 Z" fill="#15161a" stroke="#e8272c" strokeWidth="1.2" />
        <circle cx="572" cy="392" r="10" fill="none" stroke="#e8272c" strokeWidth="1" opacity="0.6" />

        {/* Beam */}
        <rect x="569" y="412" width="6" height="30" fill="url(#beamGlow)" opacity="0.95" />
        <circle cx="572" cy="443" r="26" fill="url(#beamGlow)" opacity="0.85" />
      </g>

      {/* Control panel column */}
      <g transform="translate(790,300)">
        <rect x="0" y="0" width="80" height="180" rx="6" fill="url(#bodyGrad)" stroke="#000" strokeOpacity="0.3" />
        <rect x="10" y="14" width="60" height="70" rx="3" fill="#0c0d10" stroke="#e8272c" strokeOpacity="0.35" />
        <rect x="16" y="20" width="48" height="6" fill="#e8272c" opacity="0.6" />
        <rect x="16" y="32" width="34" height="4" fill="#5a5c62" />
        <rect x="16" y="42" width="40" height="4" fill="#5a5c62" />
        <circle cx="40" cy="105" r="12" fill="#0c0d10" stroke="#e8272c" strokeWidth="2" />
        <circle cx="20" cy="140" r="6" fill="#e8272c" opacity="0.85" />
        <circle cx="40" cy="140" r="6" fill="#3a3c42" />
        <circle cx="60" cy="140" r="6" fill="#3a3c42" />
      </g>

      {/* subtle cable */}
      <path d="M572 250 C 520 270, 470 270, 430 250" stroke="#0b0c0e" strokeWidth="4" fill="none" opacity="0.6" />
    </svg>
  )
}
