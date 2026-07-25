import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import uk from './locales/uk.json'
import ru from './locales/ru.json'
import en from './locales/en.json'

const DICTS = { uk, ru, en }
export const LANGS = [
  { code: 'uk', label: 'UA' },
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
]

const I18nContext = createContext(null)

function getInitialLang() {
  if (typeof window === 'undefined') return 'uk'
  const stored = window.localStorage.getItem('metalmax_lang')
  if (stored && DICTS[stored]) return stored
  return 'uk'
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang)

  useEffect(() => {
    window.localStorage.setItem('metalmax_lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  const value = useMemo(() => ({
    lang,
    setLang,
    t: DICTS[lang],
  }), [lang])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
