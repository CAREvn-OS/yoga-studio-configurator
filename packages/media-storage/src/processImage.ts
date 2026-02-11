/**
 * Client-side image processing pipeline.
 * Uses Browser Canvas API to resize images and convert to WebP.
 * Produces 3 responsive variants: mobile (480w), tablet (768w), desktop (1200w).
 * Never upscales — caps at original width.
 */

const BREAKPOINTS = [
  { key: 'mobile' as const, width: 480 },
  { key: 'tablet' as const, width: 768 },
  { key: 'desktop' as const, width: 1200 },
]

const WEBP_QUALITY = 0.85

/**
 * Resize a single image to the target width, maintaining aspect ratio.
 * Returns a WebP Blob.
 */
async function resizeToWebP(
  source: ImageBitmap,
  targetWidth: number,
  quality: number
): Promise<Blob> {
  // Never upscale
  const actualWidth = Math.min(targetWidth, source.width)
  const scale = actualWidth / source.width
  const actualHeight = Math.round(source.height * scale)

  const canvas = new OffscreenCanvas(actualWidth, actualHeight)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context unavailable')

  ctx.drawImage(source, 0, 0, actualWidth, actualHeight)

  return canvas.convertToBlob({ type: 'image/webp', quality })
}

/**
 * Process an image blob into 3 responsive WebP variants.
 * @param blob - The source image blob (any supported format)
 * @returns Object with mobile, tablet, desktop Blobs
 */
export async function processImage(
  blob: Blob
): Promise<{ mobile: Blob; tablet: Blob; desktop: Blob }> {
  const bitmap = await createImageBitmap(blob)

  const [mobile, tablet, desktop] = await Promise.all(
    BREAKPOINTS.map(bp => resizeToWebP(bitmap, bp.width, WEBP_QUALITY))
  )

  bitmap.close()

  return { mobile, tablet, desktop }
}
