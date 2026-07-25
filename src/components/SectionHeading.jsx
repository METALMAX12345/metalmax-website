import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function SectionHeading({ eyebrow, title, viewAll, href = '/', align = 'left' }) {
  return (
    <div className={`flex items-end justify-between gap-6 mb-10 md:mb-12 ${align === 'center' ? 'flex-col items-center text-center' : 'flex-wrap'}`}>
      <div>
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="h-px w-8 bg-red-500" />
          <span className="eyebrow text-[12px] font-semibold text-red-400">{eyebrow}</span>
        </div>
        <h2 className="font-display font-semibold uppercase text-[clamp(1.7rem,3.2vw,2.5rem)] tracking-tight text-metal-gradient">
          {title}
        </h2>
      </div>
      {viewAll && (
        <Link to={href} className="group hidden sm:inline-flex items-center gap-1.5 text-[13px] font-semibold text-steel-300 hover:text-red-400 transition-colors uppercase tracking-wide">
          {viewAll}
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </div>
  )
}
