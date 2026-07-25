import { useState } from 'react'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { useI18n } from '../i18n'
import { useCms } from '../data/cms'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import AnimatedSection from './AnimatedSection'
import TiltCard from './TiltCard'
import { SOCIAL_ICONS } from './SocialIcons'

export default function Contacts({ hideHeading = false }) {
  const { t, lang } = useI18n()
  const { content } = useCms()
  const c = content.contacts
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return
    const lead = { name: name.trim(), phone: phone.trim(), created_at: new Date().toISOString() }
    if (isSupabaseConfigured) {
      await supabase.from('leads').insert(lead)
    } else {
      const existing = JSON.parse(localStorage.getItem('metalmax_leads') || '[]')
      lead.id = Date.now()
      existing.unshift(lead)
      localStorage.setItem('metalmax_leads', JSON.stringify(existing))
    }
    setSubmitted(true)
  }

  return (
    <section id="contacts" className="relative py-20 md:py-28 bg-graphite-950 border-t border-white/8">
      <div className="max-w-[1400px] mx-auto px-5 lg:px-8">
        {/* Lead form banner */}
        <AnimatedSection>
          <div className="relative overflow-hidden rounded-2xl mb-16 border border-white/8 brushed-metal">
            <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-red-600/20 blur-[90px]" />
            <div className="relative grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-8 items-center p-8 md:p-12">
              <div>
                <h3 className="font-display font-semibold uppercase text-[clamp(1.4rem,2.6vw,2rem)] text-metal-gradient mb-3">
                  {lang === 'uk' ? c.formTitle : t.contacts.formTitle}
                </h3>
                <p className="text-steel-300/80 text-[14.5px] max-w-md">{lang === 'uk' ? c.formSub : t.contacts.formSub}</p>
              </div>
              {submitted ? (
                <div className="glass rounded-lg p-5 text-[14px] text-steel-100">
                  ✓ {lang === 'uk' ? c.thanks : t.contacts.thanks}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={lang === 'uk' ? c.namePh : t.contacts.namePh}
                    className="flex-1 min-w-0 px-4 py-3.5 rounded-md bg-black/40 border border-white/10 text-[14px] text-white placeholder:text-steel-500 focus:border-red-500/60 focus:outline-none transition-colors"
                  />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={lang === 'uk' ? c.phonePh : t.contacts.phonePh}
                    className="flex-1 min-w-0 px-4 py-3.5 rounded-md bg-black/40 border border-white/10 text-[14px] text-white placeholder:text-steel-500 focus:border-red-500/60 focus:outline-none transition-colors"
                  />
                <button
                  type="submit"
                  className="btn-red px-6 py-3.5 rounded-md bg-red-600 hover:bg-red-500 text-white text-[13px] font-semibold uppercase tracking-wide transition-all duration-200 shadow-red-glow whitespace-nowrap"
                >
                    {lang === 'uk' ? c.submit : t.contacts.submit}
                  </button>
                </form>
              )}
            </div>
          </div>
        </AnimatedSection>

        <div>
          {!hideHeading && (
              <>
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="h-px w-8 bg-red-500" />
                  <span className="eyebrow text-[12px] font-semibold text-red-400">{lang === 'uk' ? c.eyebrow : t.contacts.eyebrow}</span>
                </div>
                <h2 className="font-display font-semibold uppercase text-[clamp(1.5rem,2.6vw,2rem)] tracking-tight text-metal-gradient mb-7">
                  {lang === 'uk' ? c.title : t.contacts.title}
                </h2>
              </>
            )}

            <AnimatedSection delay={0.1}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoCard icon={Phone} label={t.contacts.phones}>
                  {content.contacts.phones.map((p) => (
                    <div key={p}>{p}</div>
                  ))}
                </InfoCard>
                <InfoCard icon={Mail} label={t.contacts.email}>
                  <div>{content.contacts.email}</div>
                </InfoCard>
                <InfoCard icon={MapPin} label={t.contacts.address}>
                  <div>{content.contacts.address}</div>
                </InfoCard>
                <InfoCard icon={Clock} label={t.contacts.hours}>
                  <div>{content.contacts.hours}</div>
                </InfoCard>
              </div>
            </AnimatedSection>

            {content.socials && content.socials.length > 0 && (
              <AnimatedSection delay={0.2}>
                <div className="mt-8 pt-8 border-t border-white/8">
                  <div className="text-[12px] eyebrow text-steel-400 mb-4">{t.contacts.social || 'Месенджери'}</div>
                  <div className="flex flex-wrap gap-3">
                    {content.socials.map((s) => {
                      const Icon = SOCIAL_ICONS[s.icon]
                      return (
                        <a
                          key={s.id}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg glass-card hover:border-red-500/40 transition-all duration-300 text-[13px] text-steel-200 hover:text-white"
                        >
                          {Icon && <Icon size={16} />}
                          <span>{s.label || s.icon}</span>
                        </a>
                      )
                    })}
                  </div>
                </div>
              </AnimatedSection>
            )}

      </div>
      </div>
    </section>
  )
}

function InfoCard({ icon: Icon, label, children }) {
  return (
    <TiltCard className="h-full">
      <div className="glass-card rounded-xl p-5 hover:border-red-500/40 transition-colors duration-300">
        <div className="w-9 h-9 rounded-md bg-red-600/15 text-red-500 flex items-center justify-center mb-3">
          <Icon size={17} strokeWidth={1.8} />
        </div>
        <div className="text-[12px] eyebrow text-steel-400 mb-1.5">{label}</div>
        <div className="text-[13.5px] text-steel-100 leading-relaxed space-y-0.5">{children}</div>
      </div>
    </TiltCard>
  )
}
