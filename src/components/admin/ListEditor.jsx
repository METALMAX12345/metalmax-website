import { useState } from 'react'
import { ChevronUp, ChevronDown, Trash2, Plus, Upload, X as XIcon, Loader2 } from 'lucide-react'
import { supabase, isSupabaseConfigured, MEDIA_BUCKET } from '../../lib/supabaseClient'

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// Uploads to Supabase Storage (public bucket) when configured, so the image is
// visible to every visitor. Falls back to an embedded base64 data URL (this
// browser only) when Supabase isn't set up or the upload fails.
async function resolveImageUrl(file) {
  if (isSupabaseConfigured) {
    try {
      const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
      const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
      const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
        cacheControl: '31536000',
        upsert: false,
      })
      if (!error) {
        const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path)
        return data.publicUrl
      }
      console.error('Supabase upload failed, falling back to local embed:', error)
    } catch (err) {
      console.error('Supabase upload threw, falling back to local embed:', err)
    }
  }
  return fileToDataUrl(file)
}

export default function ListEditor({ items, onChange, fields, newItem, itemLabel }) {
  const [uploadingKey, setUploadingKey] = useState(null) // `${index}-${fieldKey}` while a file is in flight

  const move = (i, dir) => {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const next = [...items]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  const remove = (i) => {
    onChange(items.filter((_, idx) => idx !== i))
  }

  const update = (i, key, value) => {
    const next = items.map((it, idx) => (idx === i ? { ...it, [key]: value } : it))
    onChange(next)
  }

  const add = () => {
    onChange([...items, { id: `new-${Date.now()}`, ...newItem() }])
  }

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={item.id ?? i} className="glass rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex flex-col gap-1 pt-1">
              <button onClick={() => move(i, -1)} disabled={i === 0} className="w-6 h-6 rounded flex items-center justify-center text-steel-400 hover:text-white disabled:opacity-25 disabled:hover:text-steel-400 transition-colors">
                <ChevronUp size={14} />
              </button>
              <button onClick={() => move(i, 1)} disabled={i === items.length - 1} className="w-6 h-6 rounded flex items-center justify-center text-steel-400 hover:text-white disabled:opacity-25 disabled:hover:text-steel-400 transition-colors">
                <ChevronDown size={14} />
              </button>
            </div>
            <div className="flex-1 min-w-0 space-y-2">
              {fields.map((f) => (
                <div key={f.key}>
                  {f.type === 'image' ? (
                    <div className="flex items-center gap-3">
                      {item[f.key] ? (
                        <div className="relative w-16 h-16 rounded-md overflow-hidden shrink-0 border border-white/10">
                          <img src={item[f.key]} alt="" className="w-full h-full object-cover" />
                          <button
                            onClick={() => update(i, f.key, '')}
                            className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/70 flex items-center justify-center text-white"
                          >
                            <XIcon size={11} />
                          </button>
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-md border border-dashed border-white/15 shrink-0 flex items-center justify-center text-steel-500">
                          {uploadingKey === `${i}-${f.key}` ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                        </div>
                      )}
                      <label className="flex-1 px-3 py-2 rounded-md bg-black/40 border border-white/10 text-[12.5px] text-steel-300 hover:text-white hover:border-red-500/40 cursor-pointer text-center transition-colors">
                        {uploadingKey === `${i}-${f.key}` ? 'Завантаження…' : item[f.key] ? 'Замінити фото' : 'Завантажити фото'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={uploadingKey === `${i}-${f.key}`}
                          onChange={async (e) => {
                            const file = e.target.files?.[0]
                            if (!file) return
                            const key = `${i}-${f.key}`
                            setUploadingKey(key)
                            try {
                              const url = await resolveImageUrl(file)
                              update(i, f.key, url)
                            } finally {
                              setUploadingKey((cur) => (cur === key ? null : cur))
                            }
                          }}
                        />
                      </label>
                    </div>
                  ) : f.type === 'textarea' ? (
                    <textarea
                      value={item[f.key] ?? ''}
                      onChange={(e) => update(i, f.key, e.target.value)}
                      placeholder={f.label}
                      rows={2}
                      className="w-full px-3 py-2 rounded-md bg-black/40 border border-white/10 text-[13px] text-white placeholder:text-steel-500 focus:border-red-500/60 focus:outline-none resize-none"
                    />
                  ) : f.type === 'list' ? (
                    <textarea
                      value={(item[f.key] ?? []).join('\n')}
                      onChange={(e) => update(i, f.key, e.target.value.split('\n'))}
                      placeholder={f.label + ' (по одному в рядку)'}
                      rows={2}
                      className="w-full px-3 py-2 rounded-md bg-black/40 border border-white/10 text-[13px] text-white placeholder:text-steel-500 focus:border-red-500/60 focus:outline-none resize-none"
                    />
                  ) : (
                    <input
                      value={item[f.key] ?? ''}
                      onChange={(e) => update(i, f.key, e.target.value)}
                      placeholder={f.label}
                      className="w-full px-3 py-2 rounded-md bg-black/40 border border-white/10 text-[13px] text-white placeholder:text-steel-500 focus:border-red-500/60 focus:outline-none"
                    />
                  )}
                </div>
              ))}
            </div>
            <button onClick={() => remove(i)} className="w-8 h-8 shrink-0 rounded-md flex items-center justify-center text-steel-400 hover:text-red-400 hover:bg-red-500/10 transition-colors">
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      ))}
      <button onClick={add} className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border border-dashed border-white/15 text-[13px] text-steel-300 hover:text-white hover:border-red-500/40 transition-colors">
        <Plus size={15} /> Додати {itemLabel}
      </button>
    </div>
  )
}
