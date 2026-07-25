import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// The site works fully (in local-only/demo mode) without these variables set.
// Once VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are provided (see .env.example
// and supabase/schema.sql), content and images are synced through Supabase so every
// visitor sees the same data, not just the browser that made the edit.
export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null

export const CONTENT_TABLE = 'site_content'
export const CONTENT_ROW_ID = 1
export const MEDIA_BUCKET = 'media'
