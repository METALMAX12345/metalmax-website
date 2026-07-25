import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import uk from '../i18n/locales/uk.json'
import { supabase, isSupabaseConfigured, CONTENT_TABLE, CONTENT_ROW_ID } from '../lib/supabaseClient'

import svcLaserCutting from '../assets/photos/svc-laser-cutting.jpg'
import svcSheetBending from '../assets/photos/svc-sheet-bending.jpg'
import svcWelding from '../assets/photos/svc-welding.jpg'
import svcMetalStructures from '../assets/photos/svc-metal-structures.jpg'
import svcPowderCoating from '../assets/photos/svc-powder-coating.jpg'
import svcCnc from '../assets/photos/svc-cnc.jpg'

import eqLaserMachine from '../assets/photos/eq-laser-machine.jpg'
import eqPressBrake from '../assets/photos/eq-press-brake.jpg'
import eqMachiningCenter from '../assets/photos/eq-machining-center.jpg'
import eqLathe from '../assets/photos/eq-lathe.jpg'

import portfolio1 from '../assets/photos/portfolio-1.jpg'
import portfolio2 from '../assets/photos/portfolio-2.jpg'
import portfolio3 from '../assets/photos/portfolio-3.jpg'
import portfolio4 from '../assets/photos/portfolio-4.jpg'
import portfolio5 from '../assets/photos/portfolio-5.jpg'
import portfolio6 from '../assets/photos/portfolio-6.jpg'

import contactsFacade from '../assets/photos/contacts-facade.jpg'

const SERVICE_IMAGES = [svcLaserCutting, svcSheetBending, svcWelding, svcMetalStructures, svcPowderCoating, svcCnc]
const EQUIPMENT_IMAGES = { 0: eqLaserMachine, 1: eqPressBrake, 3: eqMachiningCenter, 4: eqLathe }
const PORTFOLIO_IMAGES = [portfolio1, portfolio2, portfolio3, portfolio4, portfolio5, portfolio6]

// Local-only fallback: a browser-scoped stand-in used when Supabase isn't configured
// (see .env.example + supabase/schema.sql). Once configured, this same shape of data
// is synced through Supabase so every visitor — not just the browser that made the
// edit — sees the same content, and the CMS panel writes real records with realtime
// updates to all open tabs.

const STORAGE_KEY = 'metalmax_cms_v2'

function defaultContent() {
  return {
    sections: {
      services: true,
      equipment: true,
      portfolio: true,
      about: true,
      testimonials: true,
      faq: true,
      contacts: true,
    },
    meta: {
      navHome: uk.nav.home,
      navServices: uk.nav.services,
      navEquipment: uk.nav.equipment,
      navPortfolio: uk.nav.portfolio,
      navAbout: uk.nav.about,
      navNews: uk.nav.news,
      navContacts: uk.nav.contacts,
      navFaq: uk.nav.faq,
      navCta: uk.nav.cta,
    },
    hero: {
      eyebrow: uk.hero.eyebrow,
      title1: uk.hero.title1,
      title2: uk.hero.title2,
      title3: uk.hero.title3,
      subtitle: uk.hero.subtitle,
      cta1: uk.hero.cta1,
      cta2: uk.hero.cta2,
      homeDescription: 'Сучасне металообробне підприємство повного циклу — від лазерної різки та зварювання до порошкового фарбування. Досвід, обладнання та якість для проєктів будь-якої складності.',
    },
    about: {
      eyebrow: uk.about.eyebrow,
      title: uk.about.title,
      text: uk.about.text,
      cta: uk.about.cta,
      stats: uk.about.stats.map((s, i) => ({ id: `stat-${i}`, ...s })),
    },
    services: {
      eyebrow: uk.services.eyebrow,
      title: uk.services.title,
      viewAll: uk.services.viewAll,
      items: uk.services.items.map((s, i) => ({ id: `srv-${i}`, price: '', image: SERVICE_IMAGES[i] || '', ...s })),
    },
    equipment: {
      eyebrow: uk.equipment.eyebrow,
      title: uk.equipment.title,
      viewAll: uk.equipment.viewAll,
      items: uk.equipment.items.map((e, i) => ({ id: `eq-${i}`, price: '', image: EQUIPMENT_IMAGES[i] || '', ...e })),
    },
    portfolio: {
      eyebrow: uk.portfolio.eyebrow,
      title: uk.portfolio.title,
      viewAll: uk.portfolio.viewAll,
      filters: uk.portfolio.filters,
      items: uk.portfolio.items.map((p, i) => ({ id: `pf-${i}`, image: PORTFOLIO_IMAGES[i] || '', ...p })),
    },
    testimonials: {
      eyebrow: uk.testimonials.eyebrow,
      title: uk.testimonials.title,
      items: uk.testimonials.items.map((tI, i) => ({ id: `ts-${i}`, ...tI })),
    },
    faq: {
      eyebrow: uk.faq.eyebrow,
      title: uk.faq.title,
      items: uk.faq.items.map((f, i) => ({ id: `faq-${i}`, ...f })),
    },
    contacts: {
      eyebrow: uk.contacts.eyebrow,
      title: uk.contacts.title,
      formTitle: uk.contacts.formTitle,
      formSub: uk.contacts.formSub,
      namePh: uk.contacts.namePh,
      phonePh: uk.contacts.phonePh,
      submit: uk.contacts.submit,
      thanks: uk.contacts.thanks,
      phones: ['+38 (099) 123-45-67', '+38 (067) 123-45-67'],
      email: 'info@metalmax.ua',
      address: uk.contacts.addressValue,
      hours: uk.contacts.hoursValue,
      image: contactsFacade,
    },
    socials: [
      { id: 'soc-0', icon: 'telegram', label: 'Telegram', url: 'https://t.me/metalmax_ua' },
      { id: 'soc-1', icon: 'instagram', label: 'Instagram', url: 'https://instagram.com/metalmax.ua' },
      { id: 'soc-2', icon: 'facebook', label: 'Facebook', url: '#' },
      { id: 'soc-3', icon: 'youtube', label: 'YouTube', url: '#' },
      { id: 'soc-4', icon: 'linkedin', label: 'LinkedIn', url: '#' },
    ],
    footer: {
      desc: uk.footer.desc,
      companyTitle: uk.footer.company,
      companyLinks: uk.footer.companyLinks,
      servicesTitle: uk.footer.servicesTitle,
      helpTitle: uk.footer.helpTitle,
      helpLinks: uk.footer.helpLinks,
      newsletterTitle: uk.footer.newsletterTitle,
      newsletterSub: uk.footer.newsletterSub,
      emailPh: uk.footer.emailPh,
      socialTitle: uk.footer.socialTitle,
      rights: uk.footer.rights,
      privacy: uk.footer.privacy,
    },
    maintenance: {
      enabled: false,
      title: 'Сайт тимчасово недоступний',
      subtitle: 'Ми проводимо планові технічні роботи. Зверніться до нас пізніше.',
      phone: '+38 (099) 123-45-67',
      email: 'info@metalmax.ua',
    },
  }
}

function migrateOld(data) {
  const ARRAY_KEYS = ['services', 'equipment', 'portfolio', 'testimonials', 'faq']
  for (const key of ARRAY_KEYS) {
    if (Array.isArray(data[key])) {
      const def = defaultContent()[key]
      data[key] = { ...def, items: data[key] }
    }
  }
  const def = defaultContent()
  if (!data.sections) data.sections = def.sections
  else data.sections = { ...def.sections, ...data.sections }
  data.sections.faq = true
  if (data.hero && !data.hero.eyebrow) {
    data.hero = { ...def.hero, ...data.hero }
  }
  if (data.about && !data.about.eyebrow) {
    data.about = { ...def.about, ...data.about }
  }
  if (data.contacts && !data.contacts.eyebrow) {
    data.contacts = { ...def.contacts, ...data.contacts }
  }
  if (!data.faq || !data.faq.items) {
    data.faq = { ...def.faq, ...data.faq }
  }
  if (data.meta) {
    for (const k of Object.keys(def.meta)) {
      if (!(k in data.meta)) data.meta[k] = def.meta[k]
    }
  }
  if (!data.socials) data.socials = def.socials
  // fill any missing top-level keys from defaults
  for (const k of Object.keys(def)) {
    if (!(k in data)) data[k] = def[k]
  }
  return data
}

function loadLocal() {
  if (typeof window === 'undefined') return defaultContent()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultContent()
    return migrateOld({ ...defaultContent(), ...JSON.parse(raw) })
  } catch {
    return defaultContent()
  }
}

function persistLocal(data) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // ignore quota errors — Supabase (when configured) remains the source of truth
  }
}

const CmsContext = createContext(null)

// syncStatus values:
// 'local'       — Supabase not configured, working purely off this browser's storage
// 'connecting'  — fetching the shared record for the first time
// 'saving'      — a local edit is queued to be pushed to Supabase
// 'synced'      — local state matches what's stored in Supabase
// 'error'       — last read or write to Supabase failed (still usable offline)

export function CmsProvider({ children }) {
  const [content, setContent] = useState(loadLocal)
  const [syncStatus, setSyncStatus] = useState(isSupabaseConfigured ? 'connecting' : 'local')
  const lastSyncedJson = useRef(null)
  const initialFetchDone = useRef(false)

  // Initial fetch + realtime subscription (runs once).
  useEffect(() => {
    if (!isSupabaseConfigured) return undefined

    let channel
    let cancelled = false

    ;(async () => {
      const { data, error } = await supabase
        .from(CONTENT_TABLE)
        .select('content')
        .eq('id', CONTENT_ROW_ID)
        .maybeSingle()

      if (cancelled) return

      if (!error && data?.content && Object.keys(data.content).length > 0) {
        const merged = migrateOld({ ...defaultContent(), ...data.content })
        lastSyncedJson.current = JSON.stringify(merged)
        setContent(merged)
        setSyncStatus('synced')
      } else if (error) {
        console.error('Supabase: failed to load site_content', error)
        setSyncStatus('error')
      } else {
        // Table exists but is empty — seed it with current (default/local) content.
        const seed = loadLocal()
        lastSyncedJson.current = JSON.stringify(seed)
        await supabase.from(CONTENT_TABLE).upsert({ id: CONTENT_ROW_ID, content: seed, updated_at: new Date().toISOString() })
        setSyncStatus('synced')
      }

      initialFetchDone.current = true

      channel = supabase
        .channel('site_content_sync')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: CONTENT_TABLE, filter: `id=eq.${CONTENT_ROW_ID}` },
          (payload) => {
            const incoming = payload.new?.content
            if (!incoming) return
            const incomingJson = JSON.stringify(incoming)
            if (incomingJson === lastSyncedJson.current) return // echo of our own write
            lastSyncedJson.current = incomingJson
            setContent({ ...defaultContent(), ...incoming })
          }
        )
        .subscribe()
    })()

    return () => {
      cancelled = true
      if (channel) supabase.removeChannel(channel)
    }
  }, [])

  // Always cache locally (instant, offline-friendly).
  useEffect(() => {
    persistLocal(content)
  }, [content])

  const update = useCallback((path, value) => {
    setContent((prev) => {
      const next = structuredClone(prev)
      let cursor = next
      for (let i = 0; i < path.length - 1; i++) cursor = cursor[path[i]]
      cursor[path[path.length - 1]] = value
      return next
    })
  }, [])

  const reset = useCallback(() => setContent(defaultContent()), [])

  const save = useCallback(async () => {
    if (!isSupabaseConfigured || !initialFetchDone.current) return
    setSyncStatus('saving')
    const json = JSON.stringify(content)
    const { error } = await supabase
      .from(CONTENT_TABLE)
      .upsert({ id: CONTENT_ROW_ID, content, updated_at: new Date().toISOString() })
    if (error) {
      console.error('Supabase: failed to save site_content', error)
      setSyncStatus('error')
    } else {
      lastSyncedJson.current = json
      setSyncStatus('synced')
    }
  }, [content])

  return (
    <CmsContext.Provider value={{ content, update, reset, setContent, syncStatus, save }}>
      {children}
    </CmsContext.Provider>
  )
}

export function useCms() {
  const ctx = useContext(CmsContext)
  if (!ctx) throw new Error('useCms must be used within CmsProvider')
  return ctx
}
