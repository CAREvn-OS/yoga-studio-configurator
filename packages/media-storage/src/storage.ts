import { createClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON_KEY, STORAGE_BUCKET } from './config'

let supabase: ReturnType<typeof createClient> | null = null

function getClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null
  if (!supabase) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  }
  return supabase
}

/**
 * Upload a media file to Supabase Storage.
 * Returns the remote path and public URL, or null if Supabase is unavailable.
 */
export async function uploadMedia(
  file: File,
  slotId: string
): Promise<{ path: string; url: string } | null> {
  const client = getClient()
  if (!client) return null

  const ext = file.name.split('.').pop() ?? 'bin'
  const timestamp = Date.now()
  const path = `uploads/${slotId}_${timestamp}.${ext}`

  const { error } = await client.storage
    .from(STORAGE_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: true,
    })

  if (error) {
    console.warn('[media-storage] Upload failed:', error.message)
    return null
  }

  const { data } = client.storage.from(STORAGE_BUCKET).getPublicUrl(path)
  return { path, url: data.publicUrl }
}

/**
 * Upload a Blob (e.g. processed WebP variant) to Supabase Storage.
 * Returns the remote path and public URL, or null if Supabase is unavailable.
 */
export async function uploadBlob(
  blob: Blob,
  path: string
): Promise<{ path: string; url: string } | null> {
  const client = getClient()
  if (!client) return null

  const { error } = await client.storage
    .from(STORAGE_BUCKET)
    .upload(path, blob, {
      contentType: blob.type || 'image/webp',
      cacheControl: '3600',
      upsert: true,
    })

  if (error) {
    console.warn('[media-storage] Blob upload failed:', error.message)
    return null
  }

  const { data } = client.storage.from(STORAGE_BUCKET).getPublicUrl(path)
  return { path, url: data.publicUrl }
}

/**
 * Delete a media file from Supabase Storage.
 */
export async function deleteMedia(path: string): Promise<void> {
  const client = getClient()
  if (!client) return

  const { error } = await client.storage.from(STORAGE_BUCKET).remove([path])
  if (error) {
    console.warn('[media-storage] Delete failed:', error.message)
  }
}

/**
 * Get public URL for a stored media file.
 */
export function getMediaUrl(path: string): string | null {
  const client = getClient()
  if (!client) return null

  const { data } = client.storage.from(STORAGE_BUCKET).getPublicUrl(path)
  return data.publicUrl
}
