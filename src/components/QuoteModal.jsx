import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Upload, FileText, Trash2 } from 'lucide-react'
import { useI18n } from '../i18n'
import { useCms } from '../data/cms'
import { supabase, isSupabaseConfigured, MEDIA_BUCKET } from '../lib/supabaseClient'

const ACCEPTED_TYPES = [
  'image/*',
  'application/pdf',
  'application/dxf',
  'application/x-dxf',
  '.dxf', '.dwg', '.step', '.stp', '.iges', '.igs', '.stl',
  '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.svg', '.tiff',
  '.pdf', '.doc', '.docx', '.txt',
]

const MAX_FILE_SIZE = 50 * 1024 * 1024

export default function QuoteModal({ open, onClose }) {
  const { t, lang } = useI18n()
  const { content } = useCms()
  const c = content.contacts
  const fileInputRef = useRef(null)
  const nameInputRef = useRef(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [files, setFiles] = useState([])
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [isAnimating, setIsAnimating] = useState(false)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (open) {
      setShouldRender(true)
      setIsAnimating(true)
      requestAnimationFrame(() => {
        nameInputRef.current?.focus()
      })
    } else if (shouldRender) {
      setIsAnimating(false)
      const timer = setTimeout(() => setShouldRender(false), 300)
      return () => clearTimeout(timer)
    }
  }, [open, shouldRender])

  const handleClose = useCallback(() => {
    setName('')
    setPhone('')
    setMessage('')
    setFiles([])
    setSubmitted(false)
    setSubmitting(false)
    setUploadError('')
    onClose()
  }, [onClose])

  useEffect(() => {
    if (!open) return
    const handleEsc = (e) => {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', handleEsc)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [open, handleClose])

  if (!shouldRender) return null

  const handleFiles = (e) => {
    const incoming = Array.from(e.target.files || [])
    setFiles((prev) => {
      const next = [...prev, ...incoming].filter((f) => f.size <= MAX_FILE_SIZE)
      return next
    })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) return
    if (submitting) return

    setSubmitting(true)
    setUploadError('')

    let fileUrls = files.map((f) => f.name)
    let hasFailedUploads = false

    if (isSupabaseConfigured) {
      fileUrls = await Promise.all(
        files.map(async (f) => {
          const path = `leads/${Date.now()}-${f.name}`
          const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, f)
          if (error) { console.error('File upload error:', error); hasFailedUploads = true; return f.name }
          const { data: { publicUrl } } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path)
          return publicUrl
        })
      )
    }

    const lead = {
      name: name.trim(),
      phone: phone.trim(),
      message: message.trim(),
      files: fileUrls,
      created_at: new Date().toISOString(),
    }

    if (isSupabaseConfigured) {
      const { error } = await supabase.from('leads').insert(lead)
      if (error) { setSubmitting(false); setUploadError(error.message); return }
    } else {
      const existing = JSON.parse(localStorage.getItem('metalmax_leads') || '[]')
      lead.id = Date.now()
      existing.unshift(lead)
      localStorage.setItem('metalmax_leads', JSON.stringify(existing))
    }

    if (hasFailedUploads) setUploadError('Деякі файли не вдалося завантажити. Заявка створена.')
    setSubmitting(false)
    setSubmitted(true)
  }

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`} role="dialog" aria-modal="true" aria-label={lang === 'uk' ? 'Отримати розрахунок' : t.nav.cta}>
      <div className={`absolute inset-0 bg-black/70 modal-backdrop transition-all duration-300 ${isAnimating ? 'backdrop-blur-[8px]' : 'backdrop-blur-0'}`} onClick={handleClose} aria-hidden="true" />
      <div className={`relative w-full max-w-lg max-h-[90vh] overflow-y-auto glass-strong border border-white/10 rounded-2xl p-6 md:p-8 transition-all duration-300 ${isAnimating ? 'modal-content' : 'opacity-0 scale-95 translate-y-2.5'}`}>
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-steel-400 hover:text-white transition-colors"
          aria-label={lang === 'uk' ? 'Закрити' : 'Close'}
        >
          <X size={22} />
        </button>

        {submitted ? (
          <div className="text-center py-10">
            <div className="text-3xl mb-4">✓</div>
            <h3 className="font-display text-xl font-semibold text-white mb-2">
              {lang === 'uk' ? c.thanks : t.contacts.thanks}
            </h3>
            <button
              onClick={handleClose}
              className="mt-6 px-6 py-2.5 rounded-md border border-white/20 bg-white/5 hover:bg-white/10 text-white text-[13px] font-semibold uppercase tracking-wide transition-all"
            >
              {lang === 'uk' ? 'Закрити' : 'Close'}
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-display text-xl font-semibold text-white mb-1">
              {lang === 'uk' ? 'Отримати розрахунок' : t.nav.cta}
            </h3>
            <p className="text-steel-400 text-[13px] mb-6">
              {lang === 'uk' ? 'Залиште заявку та прикріп файли — ми підготуємо розрахунок протягом 1 години' : 'Leave a request and attach files — we\'ll prepare a quote within 1 hour'}
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <input
                ref={nameInputRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={lang === 'uk' ? "Ваше ім'я" : t.contacts.namePh}
                required
                className="px-4 py-3 rounded-md bg-black/40 border border-white/10 text-[14px] text-white placeholder:text-steel-500 focus:border-red-500/60 focus:outline-none transition-colors"
              />
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={lang === 'uk' ? 'Телефон' : t.contacts.phonePh}
                required
                className="px-4 py-3 rounded-md bg-black/40 border border-white/10 text-[14px] text-white placeholder:text-steel-500 focus:border-red-500/60 focus:outline-none transition-colors"
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={lang === 'uk' ? 'Опишіть завдання (необов\'язково)' : 'Describe the task (optional)'}
                rows={3}
                className="px-4 py-3 rounded-md bg-black/40 border border-white/10 text-[14px] text-white placeholder:text-steel-500 focus:border-red-500/60 focus:outline-none transition-colors resize-none"
              />

              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-md border border-dashed border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30 text-steel-300 text-[13px] font-medium transition-all cursor-pointer"
                >
                  <Upload size={16} />
                  {lang === 'uk' ? 'Завантажити файли (DXF, DWG, PDF, зображення, 3D)' : 'Upload files (DXF, DWG, PDF, images, 3D)'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={ACCEPTED_TYPES.join(',')}
                  onChange={handleFiles}
                  className="hidden"
                />
                <p className="text-[11px] text-steel-500 mt-1.5">
                  {lang === 'uk' ? 'Макс. розмір файлу: 50 МБ' : 'Max file size: 50 MB'}
                </p>
              </div>

              {files.length > 0 && (
                <div className="flex flex-col gap-2">
                  {files.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-md bg-black/30 border border-white/5 text-[13px] text-steel-200">
                      <FileText size={14} className="text-steel-400 shrink-0" />
                      <span className="truncate flex-1">{f.name}</span>
                      <span className="text-steel-500 text-[11px] shrink-0">{(f.size / 1024 / 1024).toFixed(1)} МБ</span>
                      <button type="button" onClick={() => removeFile(i)} className="text-steel-500 hover:text-red-400 transition-colors shrink-0">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {uploadError && (
                <p className="text-[12px] text-red-400">{uploadError}</p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="btn-red px-6 py-3.5 rounded-md bg-red-600 hover:bg-red-500 disabled:opacity-60 text-white text-[13px] font-semibold uppercase tracking-wide transition-all duration-200 shadow-red-glow mt-2"
              >
                {submitting ? (lang === 'uk' ? 'Відправлення…' : 'Sending…') : (lang === 'uk' ? c.submit : t.contacts.submit)}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
