/**
 * Color utility functions for the theme color sub-options panel.
 * Provides hex <-> HSL conversion, lightness adjustment, and contrast detection.
 */

/** Parse a hex color string into { h, s, l } (hue 0-360, saturation 0-100, lightness 0-100). */
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.substring(0, 2), 16) / 255
  const g = parseInt(clean.substring(2, 4), 16) / 255
  const b = parseInt(clean.substring(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2

  if (max === min) {
    return { h: 0, s: 0, l: Math.round(l * 100) }
  }

  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

  let h: number
  switch (max) {
    case r:
      h = ((g - b) / d + (g < b ? 6 : 0)) / 6
      break
    case g:
      h = ((b - r) / d + 2) / 6
      break
    default:
      h = ((r - g) / d + 4) / 6
      break
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

/** Convert HSL values (h 0-360, s 0-100, l 0-100) back to a hex color string. */
export function hslToHex(h: number, s: number, l: number): string {
  const sNorm = s / 100
  const lNorm = l / 100

  if (sNorm === 0) {
    const gray = Math.round(lNorm * 255)
    const hexVal = gray.toString(16).padStart(2, '0')
    return `#${hexVal}${hexVal}${hexVal}`
  }

  const hueToRgb = (p: number, q: number, t: number): number => {
    let tAdj = t
    if (tAdj < 0) tAdj += 1
    if (tAdj > 1) tAdj -= 1
    if (tAdj < 1 / 6) return p + (q - p) * 6 * tAdj
    if (tAdj < 1 / 2) return q
    if (tAdj < 2 / 3) return p + (q - p) * (2 / 3 - tAdj) * 6
    return p
  }

  const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm
  const p = 2 * lNorm - q
  const hNorm = h / 360

  const r = Math.round(hueToRgb(p, q, hNorm + 1 / 3) * 255)
  const g = Math.round(hueToRgb(p, q, hNorm) * 255)
  const b = Math.round(hueToRgb(p, q, hNorm - 1 / 3) * 255)

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

/** Shift the lightness of a hex color by the given amount (-100 to +100). Clamps to valid range. */
export function adjustLightness(hex: string, amount: number): string {
  const { h, s, l } = hexToHsl(hex)
  const newL = Math.max(0, Math.min(100, l + amount))
  return hslToHex(h, s, newL)
}

/** Return '#ffffff' or '#000000' depending on which provides better readability against the given background. */
export function getContrastColor(hex: string): string {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.substring(0, 2), 16)
  const g = parseInt(clean.substring(2, 4), 16)
  const b = parseInt(clean.substring(4, 6), 16)

  // W3C relative luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000000' : '#ffffff'
}
