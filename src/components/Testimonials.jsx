import { useState, useEffect } from 'react'
import { Quote } from 'lucide-react'
import { useI18n } from '../i18n'
import { useCms } from '../data/cms'
import SectionHeading from './SectionHeading'
import AnimatedSection from './AnimatedSection'
import TiltCard from './TiltCard'

const STORAGE_KEY = 'metalmax_reviews'

function loadReviews() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch { return [] }
}

export default function Testimonials() {
  const { t, lang } = useI18n()
  const { content } = useCms()
  const c = content.testimonials
  const cmsItems = c.items.map((cmsItem, i) => {
    if (lang === 'uk') return cmsItem
    const staticItem = t.testimonials.items[i]
    return {
      ...cmsItem,
      text: staticItem?.text || cmsItem.text,
      name: staticItem?.name || cmsItem.name,
      role: staticItem?.role || cmsItem.role,
    }
  })

  const [userReviews, setUserReviews] = useState([])
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setUserReviews(loadReviews())
  }, [])

  const allItems = [...cmsItems, ...userReviews]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !text.trim()) return
    const review = { name: name.trim(), text: text.trim(), role: '—', date: Date.now() }
    const next = [review, ...userReviews]
    setUserReviews(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setName('')
    setText('')
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <section id="testimonials" className="relative py-20 md:py-28 bg-ink">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-8">
        <SectionHeading eyebrow={lang === 'uk' ? c.eyebrow : t.testimonials.eyebrow} title={lang === 'uk' ? c.title : t.testimonials.title} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {allItems.map((item, i) => (
            <AnimatedSection key={i} delay={i * 0.08}>
              <TiltCard>
                <div className="glass-card rounded-xl p-7 transition-all duration-300 hover:border-red-500/30">
                  <Quote size={26} className="text-red-500/70 mb-4" />
                  <p className="text-[14.5px] leading-relaxed text-steel-200/90 mb-6">{item.text}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-graphite-600 to-graphite-800 border border-white/10 flex items-center justify-center text-[13px] font-semibold text-steel-200">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-[13.5px] font-semibold text-white">{item.name}</div>
                      <div className="text-[12px] text-steel-300/70">{item.role}</div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </AnimatedSection>
          ))}
        </div>

        <div className="max-w-lg mx-auto border-t border-white/8 pt-12">
          <div className="text-center mb-6">
            <div className="text-[15px] font-semibold text-white uppercase tracking-wide">Залишити відгук</div>
            <p className="text-[13px] text-steel-300/70 mt-1">Поділіться враженнями про роботу з нами</p>
          </div>
          {submitted ? (
            <div className="text-center text-[14px] text-red-400 py-6 bg-white/5 rounded-lg">
              Дякуємо! Ваш відгук опубліковано.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ваше ім'я"
                className="w-full px-4 py-3 rounded-md bg-black/40 border border-white/10 text-[14px] text-white placeholder:text-steel-500 focus:border-red-500/60 focus:outline-none transition-colors"
              />
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ваш відгук"
                rows={4}
                className="w-full px-4 py-3 rounded-md bg-black/40 border border-white/10 text-[14px] text-white placeholder:text-steel-500 focus:border-red-500/60 focus:outline-none transition-colors resize-none"
              />
              <button
                type="submit"
                className="btn-red w-full py-3 rounded-md bg-red-600 hover:bg-red-500 text-white text-[14px] font-semibold transition-colors"
              >
                Надіслати відгук
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
