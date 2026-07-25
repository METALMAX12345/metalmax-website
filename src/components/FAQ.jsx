import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useI18n } from '../i18n'
import { useCms } from '../data/cms'

export default function FAQ() {
  const { t, lang } = useI18n()
  const { content } = useCms()
  const faq = content.faq
  const items = (faq?.items || []).map((cmsItem, i) => {
    if (lang === 'uk') return cmsItem
    const staticItem = t.faq.items[i]
    return {
      ...cmsItem,
      q: staticItem?.q || cmsItem.q,
      a: staticItem?.a || cmsItem.a,
    }
  })
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i)

  return (
    <section id="faq" className="relative py-20 md:py-28 bg-ink">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-red-500 uppercase tracking-[0.2em] text-sm font-semibold">
            {lang === 'uk' ? faq.eyebrow : t.faq.eyebrow}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mt-3">
            {lang === 'uk' ? faq.title : t.faq.title}
          </h2>
        </div>
        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          {items.map((item, i) => (
            <div
              key={item.id || i}
              className={`glass-card rounded-xl overflow-hidden transition-all duration-300 hover:border-white/10 ${
                openIndex === i ? 'border-red-500/20 bg-white/[0.02]' : ''
              }`}
            >
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left group"
                aria-expanded={openIndex === i}
              >
                <span className={`text-[15px] md:text-[16px] font-medium transition-colors duration-300 ${
                  openIndex === i ? 'text-white' : 'text-white group-hover:text-red-400'
                }`}>{item.q}</span>
                <ChevronDown
                  size={18}
                  className={`shrink-0 transition-all duration-300 ${
                    openIndex === i ? 'rotate-180 text-red-400' : 'text-steel-400 group-hover:text-steel-300'
                  }`}
                />
              </button>
              <div className="accordion-content">
                <div
                  className={`transition-all duration-300 ease-out ${
                    openIndex === i ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-5 md:px-6 pb-5 md:pb-6 text-steel-300 text-[14px] leading-relaxed">
                    {item.a}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-center text-steel-400 text-[14px] py-8">
              {lang === 'uk' ? 'Питання поки відсутні' : 'No questions yet'}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
