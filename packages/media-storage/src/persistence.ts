import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config'

let supabase: ReturnType<typeof createClient> | null = null

function getClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null
  if (!supabase) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  }
  return supabase
}

/**
 * Get a hashed version of the visitor's IP address.
 * Uses a free IP API then SHA-256 hashes the result.
 */
export async function getIpHash(): Promise<string | null> {
  try {
    const res = await fetch('https://api.ipify.org?format=json')
    const data = await res.json()
    const ip = data.ip as string
    // SHA-256 hash the IP
    const encoder = new TextEncoder()
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(ip))
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  } catch {
    return null
  }
}

/**
 * Save config JSON to Supabase `configurations` table.
 * Uses upsert on ip_hash primary key.
 *
 * Table schema:
 *   ip_hash TEXT PRIMARY KEY,
 *   config JSONB NOT NULL,
 *   updated_at TIMESTAMPTZ DEFAULT NOW()
 */
export async function saveConfig(ipHash: string, config: string): Promise<boolean> {
  const client = getClient()
  if (!client) return false

  try {
    const { error } = await client
      .from('configurations')
      .upsert(
        { ip_hash: ipHash, config: JSON.parse(config), updated_at: new Date().toISOString() },
        { onConflict: 'ip_hash' }
      )

    if (error) {
      console.warn('[persistence] Save failed:', error.message)
      return false
    }
    return true
  } catch {
    return false
  }
}

/**
 * Load config JSON from Supabase `configurations` table.
 */
export async function loadConfig(ipHash: string): Promise<Record<string, any> | null> {
  const client = getClient()
  if (!client) return null

  try {
    const { data, error } = await client
      .from('configurations')
      .select('config')
      .eq('ip_hash', ipHash)
      .single()

    if (error || !data) return null
    return data.config as Record<string, any>
  } catch {
    return null
  }
}
