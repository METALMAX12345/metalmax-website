import { useState, useEffect, useCallback } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { LogOut, Save, RotateCcw, ExternalLink, Check, Cloud, CloudOff, RefreshCw, AlertTriangle, Trash2, Plus } from 'lucide-react'
import { useCms } from '../../data/cms'
import { useAdminAuth } from '../../lib/useAdminAuth'
import { useI18n } from '../../i18n'
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient'
import ListEditor from '../../components/admin/ListEditor'

const TABS = [
  { key: 'hero', label: 'Hero' },
  { key: 'about', label: 'Про компанію' },
  { key: 'contacts', label: 'Контакти' },
  { key: 'services', label: 'Послуги' },
  { key: 'equipment', label: 'Обладнання' },
  { key: 'portfolio', label: 'Портфоліо' },
  { key: 'testimonials', label: 'Відгуки' },
  { key: 'faq', label: 'FAQ' },
  { key: 'sections', label: 'Секції' },
  { key: 'socials', label: 'Соцмережі' },
  { key: 'nav', label: 'Навігація' },
  { key: 'footer', label: 'Футер' },
  { key: 'maintenance', label: 'Обслуговування' },
  { key: 'leads', label: 'Заявки' },
]

function SyncBadge({ status }) {
  const map = {
    local: { icon: CloudOff, text: 'Локальний режим', cls: 'text-steel-400' },
    connecting: { icon: RefreshCw, text: "Підключення…", cls: 'text-steel-400 animate-pulse' },
    saving: { icon: RefreshCw, text: 'Збереження…', cls: 'text-amber-400' },
    synced: { icon: Cloud, text: 'Синхронізовано', cls: 'text-emerald-400' },
    error: { icon: AlertTriangle, text: 'Помилка синхронізації', cls: 'text-red-400' },
  }
  const { icon: Icon, text, cls } = map[status] ?? map.local
  return (
    <span className={`flex items-center gap-1.5 text-[12.5px] mr-1 ${cls}`}>
      <Icon size={14} /> {text}
    </span>
  )
}

export default function AdminDashboard() {
  const { authed, logout } = useAdminAuth()
  const { content, update, reset, syncStatus, save } = useCms()
  const { t, lang } = useI18n()
  const [tab, setTab] = useState('hero')
  const [savedFlash, setSavedFlash] = useState(false)
  const [leads, setLeads] = useState([])
  const [leadsLoading, setLeadsLoading] = useState(false)

  const loadLeads = useCallback(async () => {
    setLeadsLoading(true)
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
      if (!error) setLeads(data ?? [])
    } else {
      try { setLeads(JSON.parse(localStorage.getItem('metalmax_leads') || '[]')) } catch { setLeads([]) }
    }
    setLeadsLoading(false)
  }, [])

  useEffect(() => { loadLeads() }, [loadLeads])

  const deleteLead = async (id) => {
    if (isSupabaseConfigured) {
      await supabase.from('leads').delete().eq('id', id)
    } else {
      const next = leads.filter((l) => l.id !== id)
      setLeads(next)
      localStorage.setItem('metalmax_leads', JSON.stringify(next))
    }
    loadLeads()
  }

  if (authed === null) {
    return <div className="min-h-screen bg-ink flex items-center justify-center text-steel-400 text-[13px]">Перевірка сесії…</div>
  }
  if (!authed) return <Navigate to="/admin" replace />

  const handleLogout = async () => {
    await logout()
    window.location.href = '/admin'
  }

  const flashSaved = () => {
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 1400)
  }

  return (
    <div className="min-h-screen bg-ink">
      {!isSupabaseConfigured && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-300 text-[12.5px] text-center py-2 px-4">
          Supabase не підключено — зміни зберігаються лише в цьому браузері. Інструкція: <code>supabase/schema.sql</code> + <code>.env.example</code>.
        </div>
      )}
      <header className="sticky top-0 z-20 glass-strong border-b border-white/10">
        <div className="max-w-[1200px] mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="METALMAX" className="h-8 w-auto" />
            <span className="text-[13px] text-steel-400 uppercase tracking-wide hidden sm:inline">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <SyncBadge status={syncStatus} />
            {savedFlash && (
              <span className="flex items-center gap-1.5 text-[12.5px] text-red-400 mr-1">
                <Check size={14} /> Збережено
              </span>
            )}
            <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-2 rounded-md text-[12.5px] text-steel-300 hover:text-white transition-colors">
              <ExternalLink size={14} /> На сайт
            </a>
            <button onClick={save} className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-red-600 hover:bg-red-500 text-[12.5px] text-white transition-colors">
              <Save size={14} /> Зберегти
            </button>
            <button onClick={() => { reset(); flashSaved() }} className="flex items-center gap-1.5 px-3 py-2 rounded-md text-[12.5px] text-steel-300 hover:text-white transition-colors">
              <RotateCcw size={14} /> Скинути
            </button>
            <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 text-[12.5px] text-steel-200 transition-colors">
              <LogOut size={14} /> Вийти
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto px-5 py-8 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
        <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`shrink-0 text-left px-4 py-2.5 rounded-md text-[13.5px] font-medium transition-colors ${
                tab === t.key ? 'bg-red-600 text-white' : 'text-steel-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        <div>
          {tab === 'hero' && (
            <Panel title="Hero" onSave={flashSaved}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Надзаголовок">
                  <input value={content.hero.eyebrow} onChange={(e) => update(['hero', 'eyebrow'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Підзаголовок">
                  <input value={content.hero.subtitle} onChange={(e) => update(['hero', 'subtitle'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Заголовок 1">
                  <input value={content.hero.title1} onChange={(e) => update(['hero', 'title1'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Заголовок 2">
                  <input value={content.hero.title2} onChange={(e) => update(['hero', 'title2'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Заголовок 3">
                  <input value={content.hero.title3} onChange={(e) => update(['hero', 'title3'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Кнопка 1">
                  <input value={content.hero.cta1} onChange={(e) => update(['hero', 'cta1'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Кнопка 2">
                  <input value={content.hero.cta2} onChange={(e) => update(['hero', 'cta2'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
              </div>
              <Field label="Опис компанії (головна)">
                <textarea value={content.hero.homeDescription} onChange={(e) => update(['hero', 'homeDescription'], e.target.value)} rows={3} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none resize-none" />
              </Field>
            </Panel>
          )}

          {tab === 'about' && (
            <Panel title="Про компанію" onSave={flashSaved}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <Field label="Надзаголовок">
                  <input value={content.about.eyebrow} onChange={(e) => update(['about', 'eyebrow'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Заголовок">
                  <input value={content.about.title} onChange={(e) => update(['about', 'title'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Текст кнопки">
                  <input value={content.about.cta} onChange={(e) => update(['about', 'cta'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
              </div>
              <Field label="Текст про компанію">
                <textarea value={content.about.text} onChange={(e) => update(['about', 'text'], e.target.value)} rows={4} className="inp resize-none" />
              </Field>
            </Panel>
          )}

          {tab === 'contacts' && (
            <Panel title="Контакти" onSave={flashSaved}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <Field label="Надзаголовок">
                  <input value={content.contacts.eyebrow} onChange={(e) => update(['contacts', 'eyebrow'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Заголовок">
                  <input value={content.contacts.title} onChange={(e) => update(['contacts', 'title'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Заголовок форми">
                  <input value={content.contacts.formTitle} onChange={(e) => update(['contacts', 'formTitle'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Підпис форми">
                  <input value={content.contacts.formSub} onChange={(e) => update(['contacts', 'formSub'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Плейсхолдер ім'я">
                  <input value={content.contacts.namePh} onChange={(e) => update(['contacts', 'namePh'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Плейсхолдер телефон">
                  <input value={content.contacts.phonePh} onChange={(e) => update(['contacts', 'phonePh'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Текст кнопки">
                  <input value={content.contacts.submit} onChange={(e) => update(['contacts', 'submit'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Текст подяки">
                  <input value={content.contacts.thanks} onChange={(e) => update(['contacts', 'thanks'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
              </div>
              <div className="text-[12px] text-steel-400 mb-3 uppercase tracking-wide">Контактна інформація</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Телефони (по одному в рядку)">
                  <textarea
                    value={content.contacts.phones.join('\n')}
                    onChange={(e) => update(['contacts', 'phones'], e.target.value.split('\n'))}
                    rows={2}
                    className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none resize-none"
                  />
                </Field>
                <Field label="Email">
                  <input
                    value={content.contacts.email}
                    onChange={(e) => update(['contacts', 'email'], e.target.value)}
                    className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none"
                  />
                </Field>
                <Field label="Адреса">
                  <input
                    value={content.contacts.address}
                    onChange={(e) => update(['contacts', 'address'], e.target.value)}
                    className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none"
                  />
                </Field>
                <Field label="Графік роботи">
                  <input
                    value={content.contacts.hours}
                    onChange={(e) => update(['contacts', 'hours'], e.target.value)}
                    className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none"
                  />
                </Field>
              </div>
            </Panel>
          )}

          {tab === 'services' && (
            <Panel title="Послуги" onSave={flashSaved}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <Field label="Надзаголовок">
                  <input value={content.services.eyebrow} onChange={(e) => update(['services', 'eyebrow'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Заголовок">
                  <input value={content.services.title} onChange={(e) => update(['services', 'title'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Текст кнопки">
                  <input value={content.services.viewAll} onChange={(e) => update(['services', 'viewAll'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
              </div>
              <ListEditor
                items={content.services.items}
                onChange={(next) => update(['services', 'items'], next)}
                itemLabel="послугу"
                newItem={() => ({ title: 'Нова послуга', desc: 'Опис послуги', price: '', image: '' })}
                fields={[
                  { key: 'image', label: 'Фото', type: 'image' },
                  { key: 'title', label: 'Назва' },
                  { key: 'desc', label: 'Опис', type: 'textarea' },
                  { key: 'price', label: 'Ціна (напр. від 500 грн/м²)' },
                ]}
              />
            </Panel>
          )}

          {tab === 'equipment' && (
            <Panel title="Обладнання" onSave={flashSaved}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <Field label="Надзаголовок">
                  <input value={content.equipment.eyebrow} onChange={(e) => update(['equipment', 'eyebrow'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Заголовок">
                  <input value={content.equipment.title} onChange={(e) => update(['equipment', 'title'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Текст кнопки">
                  <input value={content.equipment.viewAll} onChange={(e) => update(['equipment', 'viewAll'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
              </div>
              <ListEditor
                items={content.equipment.items}
                onChange={(next) => update(['equipment', 'items'], next)}
                itemLabel="обладнання"
                newItem={() => ({ title: 'Новий станок', specs: ['Характеристика 1', 'Характеристика 2'], price: '', image: '' })}
                fields={[
                  { key: 'image', label: 'Фото', type: 'image' },
                  { key: 'title', label: 'Назва' },
                  { key: 'specs', label: 'Характеристики', type: 'list' },
                  { key: 'price', label: 'Ціна / оренда (необов\'язково)' },
                ]}
              />
            </Panel>
          )}

          {tab === 'portfolio' && (
            <Panel title="Портфоліо" onSave={flashSaved}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <Field label="Надзаголовок">
                  <input value={content.portfolio.eyebrow} onChange={(e) => update(['portfolio', 'eyebrow'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Заголовок">
                  <input value={content.portfolio.title} onChange={(e) => update(['portfolio', 'title'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Текст кнопки">
                  <input value={content.portfolio.viewAll} onChange={(e) => update(['portfolio', 'viewAll'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Фільтри (через кому)">
                  <input value={content.portfolio.filters.join(', ')} onChange={(e) => update(['portfolio', 'filters'], e.target.value.split(',').map((s) => s.trim()))} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
              </div>
              <p className="text-[12px] text-steel-500 mb-4">Категорія має точно збігатися з одним із фільтрів.</p>
              <ListEditor
                items={content.portfolio.items}
                onChange={(next) => update(['portfolio', 'items'], next)}
                itemLabel="роботу"
                newItem={() => ({ title: 'Нова робота', cat: 'Металоконструкції', image: '' })}
                fields={[
                  { key: 'image', label: 'Фото', type: 'image' },
                  { key: 'title', label: 'Назва' },
                  { key: 'cat', label: 'Категорія' },
                ]}
              />
            </Panel>
          )}

          {tab === 'testimonials' && (
            <Panel title="Відгуки" onSave={flashSaved}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <Field label="Надзаголовок">
                  <input value={content.testimonials.eyebrow} onChange={(e) => update(['testimonials', 'eyebrow'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Заголовок">
                  <input value={content.testimonials.title} onChange={(e) => update(['testimonials', 'title'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
              </div>
              <ListEditor
                items={content.testimonials.items}
                onChange={(next) => update(['testimonials', 'items'], next)}
                itemLabel="відгук"
                newItem={() => ({ text: 'Текст відгуку', name: "Ім'я клієнта", role: 'Посада, компанія' })}
                fields={[
                  { key: 'text', label: 'Текст відгуку', type: 'textarea' },
                  { key: 'name', label: "Ім'я" },
                  { key: 'role', label: 'Посада / компанія' },
                ]}
              />
            </Panel>
          )}

          {tab === 'sections' && (
            <Panel title="Секції на головній" onSave={flashSaved}>
              <p className="text-[12px] text-steel-400 mb-4">Вмикайте/вимикайте блоки на головній сторінці</p>
              <div className="space-y-3">
                {[
                  { key: 'faq', label: 'FAQ' },
                  { key: 'services', label: 'Послуги' },
                  { key: 'equipment', label: 'Обладнання' },
                  { key: 'portfolio', label: 'Портфоліо' },
                  { key: 'about', label: 'Про компанію' },
                  { key: 'testimonials', label: 'Відгуки' },
                  { key: 'contacts', label: 'Контакти' },
                ].map((sec) => {
                  const checked = content.sections?.[sec.key] ?? true
                  return (
                  <label key={sec.key} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => update(['sections', sec.key], e.target.checked)}
                      className="w-4 h-4 rounded border-white/20 bg-black/40 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-[13.5px] text-steel-200">{sec.label}</span>
                  </label>
                  )
                })}
              </div>
            </Panel>
          )}

          {tab === 'socials' && (
            <Panel title="Соціальні мережі" onSave={flashSaved}>
              <p className="text-[12px] text-steel-400 mb-4">Додавайте/видаляйте соцмережі, вибирайте іконку та вказуйте посилання</p>
              <div className="space-y-3">
                {(content.socials || []).map((s, i) => (
                  <div key={s.id} className="glass rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0 space-y-2">
                        <select
                          value={s.icon}
                          onChange={(e) => {
                            const next = [...content.socials]
                            next[i] = { ...next[i], icon: e.target.value }
                            update(['socials'], next)
                          }}
                          className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13px] text-white focus:border-red-500/60 focus:outline-none"
                        >
                          <option value="telegram">Telegram</option>
                          <option value="instagram">Instagram</option>
                          <option value="facebook">Facebook</option>
                          <option value="youtube">YouTube</option>
                          <option value="linkedin">LinkedIn</option>
                        </select>
                        <input
                          value={s.label}
                          onChange={(e) => {
                            const next = [...content.socials]
                            next[i] = { ...next[i], label: e.target.value }
                            update(['socials'], next)
                          }}
                          placeholder="Назва"
                          className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13px] text-white placeholder:text-steel-500 focus:border-red-500/60 focus:outline-none"
                        />
                        <input
                          value={s.url}
                          onChange={(e) => {
                            const next = [...content.socials]
                            next[i] = { ...next[i], url: e.target.value }
                            update(['socials'], next)
                          }}
                          placeholder="https://..."
                          className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13px] text-white placeholder:text-steel-500 focus:border-red-500/60 focus:outline-none"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const next = content.socials.filter((_, idx) => idx !== i)
                          update(['socials'], next)
                        }}
                        className="w-8 h-8 shrink-0 rounded-md flex items-center justify-center text-steel-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => {
                    const next = [...(content.socials || []), { id: `soc-${Date.now()}`, icon: 'telegram', label: '', url: '' }]
                    update(['socials'], next)
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-dashed border-white/15 text-[13px] text-steel-300 hover:text-white hover:border-red-500/40 transition-colors"
                >
                  <Plus size={15} /> Додати соцмережу
                </button>
              </div>
            </Panel>
          )}

          {tab === 'nav' && (
            <Panel title="Навігація" onSave={flashSaved}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Головна">
                  <input value={content.meta.navHome} onChange={(e) => update(['meta', 'navHome'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Послуги">
                  <input value={content.meta.navServices} onChange={(e) => update(['meta', 'navServices'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Обладнання">
                  <input value={content.meta.navEquipment} onChange={(e) => update(['meta', 'navEquipment'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Портфоліо">
                  <input value={content.meta.navPortfolio} onChange={(e) => update(['meta', 'navPortfolio'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Про компанію">
                  <input value={content.meta.navAbout} onChange={(e) => update(['meta', 'navAbout'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Новини">
                  <input value={content.meta.navNews} onChange={(e) => update(['meta', 'navNews'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Контакти">
                  <input value={content.meta.navContacts} onChange={(e) => update(['meta', 'navContacts'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Кнопка зв'язку">
                  <input value={content.meta.navCta} onChange={(e) => update(['meta', 'navCta'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="FAQ">
                  <input value={content.meta.navFaq} onChange={(e) => update(['meta', 'navFaq'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
              </div>
            </Panel>
          )}

          {tab === 'footer' && (
            <Panel title="Футер" onSave={flashSaved}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <Field label="Опис">
                  <textarea value={content.footer.desc} onChange={(e) => update(['footer', 'desc'], e.target.value)} rows={2} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none resize-none" />
                </Field>
                <Field label="Права">
                  <input value={content.footer.rights} onChange={(e) => update(['footer', 'rights'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Політика конфіденційності">
                  <input value={content.footer.privacy} onChange={(e) => update(['footer', 'privacy'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Заголовок Компанія">
                  <input value={content.footer.companyTitle} onChange={(e) => update(['footer', 'companyTitle'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Заголовок Послуги">
                  <input value={content.footer.servicesTitle} onChange={(e) => update(['footer', 'servicesTitle'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Заголовок Допомога">
                  <input value={content.footer.helpTitle} onChange={(e) => update(['footer', 'helpTitle'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Посилання компанії (через кому)">
                  <input value={(content.footer.companyLinks || []).join(', ')} onChange={(e) => update(['footer', 'companyLinks'], e.target.value.split(',').map(s => s.trim()))} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Посилання допомоги (через кому)">
                  <input value={(content.footer.helpLinks || []).join(', ')} onChange={(e) => update(['footer', 'helpLinks'], e.target.value.split(',').map(s => s.trim()))} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Заголовок підписки">
                  <input value={content.footer.newsletterTitle} onChange={(e) => update(['footer', 'newsletterTitle'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Підпис підписки">
                  <input value={content.footer.newsletterSub} onChange={(e) => update(['footer', 'newsletterSub'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Плейсхолдер email">
                  <input value={content.footer.emailPh} onChange={(e) => update(['footer', 'emailPh'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Заголовок соцмереж">
                  <input value={content.footer.socialTitle} onChange={(e) => update(['footer', 'socialTitle'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
              </div>
            </Panel>
          )}

          {tab === 'maintenance' && (
            <Panel title="Режим обслуговування" onSave={flashSaved}>
              <p className="text-[12px] text-steel-400 mb-4">Увімкніть, щоб показати на сайті повідомлення про тимчасову недоступність</p>
              <div className="mb-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={content.maintenance?.enabled ?? false}
                    onChange={(e) => update(['maintenance', 'enabled'], e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-black/40 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-[13.5px] text-steel-200 font-medium">Увімкнути режим обслуговування</span>
                </label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Заголовок">
                  <input value={content.maintenance?.title || ''} onChange={(e) => update(['maintenance', 'title'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Телефон">
                  <input value={content.maintenance?.phone || ''} onChange={(e) => update(['maintenance', 'phone'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Email">
                  <input value={content.maintenance?.email || ''} onChange={(e) => update(['maintenance', 'email'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
              </div>
              <div className="mt-4">
                <Field label="Підзаголовок (опис)">
                  <textarea value={content.maintenance?.subtitle || ''} onChange={(e) => update(['maintenance', 'subtitle'], e.target.value)} rows={3} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none resize-none" />
                </Field>
              </div>
            </Panel>
          )}

          {tab === 'leads' && (
            <Panel title={t.leads.title}>
              {leadsLoading ? (
                <p className="text-[13px] text-steel-400">Завантаження…</p>
              ) : leads.length === 0 ? (
                <p className="text-[13px] text-steel-400">{t.leads.empty}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[13px] border-collapse">
                    <thead>
                      <tr className="text-steel-400 border-b border-white/10">
                        <th className="pb-2 pr-4 font-medium">{t.leads.name}</th>
                        <th className="pb-2 pr-4 font-medium">{t.leads.phone}</th>
                        <th className="pb-2 pr-4 font-medium">Повідомлення</th>
                        <th className="pb-2 pr-4 font-medium">Файли</th>
                        <th className="pb-2 pr-4 font-medium">{t.leads.date}</th>
                        <th className="pb-2 w-10" />
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((lead) => (
                        <tr key={lead.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="py-2.5 pr-4 text-white">{lead.name}</td>
                          <td className="py-2.5 pr-4 text-steel-200">{lead.phone}</td>
                          <td className="py-2.5 pr-4 text-steel-300 max-w-[200px] truncate">{lead.message || '—'}</td>
                          <td className="py-2.5 pr-4 text-steel-400 text-[12px]">
                            {lead.files?.length > 0 ? lead.files.join(', ') : '—'}
                          </td>
                          <td className="py-2.5 pr-4 text-steel-400 whitespace-nowrap">
                            {new Date(lead.created_at).toLocaleDateString(lang === 'en' ? 'en' : lang === 'ru' ? 'ru' : 'uk', {
                              day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                          </td>
                          <td className="py-2.5">
                            <button
                              onClick={() => {
                                if (window.confirm(`${t.leads.deleteConfirm} ${lead.name}?`)) deleteLead(lead.id)
                              }}
                              className="w-8 h-8 rounded-md flex items-center justify-center text-steel-400 hover:text-red-400 hover:bg-red-600/10 transition-colors"
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Panel>
          )}

          {tab === 'faq' && (
            <Panel title="FAQ" onSave={flashSaved}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <Field label="Надзаголовок">
                  <input value={content.faq.eyebrow} onChange={(e) => update(['faq', 'eyebrow'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
                <Field label="Заголовок">
                  <input value={content.faq.title} onChange={(e) => update(['faq', 'title'], e.target.value)} className="w-full px-3 py-2.5 rounded-md bg-black/40 border border-white/10 text-[13.5px] text-white focus:border-red-500/60 focus:outline-none" />
                </Field>
              </div>
              <ListEditor
                items={content.faq.items}
                onChange={(next) => update(['faq', 'items'], next)}
                itemLabel="питання"
                newItem={() => ({ q: 'Нове питання?', a: 'Відповідь' })}
                fields={[
                  { key: 'q', label: 'Питання' },
                  { key: 'a', label: 'Відповідь', type: 'textarea' },
                ]}
              />
            </Panel>
          )}
        </div>
      </div>
    </div>
  )
}

function Panel({ title, children }) {
  return (
    <div>
      <h2 className="font-display font-semibold uppercase text-[18px] text-steel-100 mb-5">{title}</h2>
      {children}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-[12px] text-steel-400 mb-1.5">{label}</label>
      {children}
    </div>
  )
}
