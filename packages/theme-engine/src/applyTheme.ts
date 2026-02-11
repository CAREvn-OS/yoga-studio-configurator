import type { ThemeDef, ThemeColors, FontPairing } from '@care/shared-types'
import { themes } from './themes'

/**
 * Convert a camelCase string to kebab-case for CSS custom properties.
 *   e.g. "sandLight" -> "sand-light", "sectionDarkText" -> "section-dark-text"
 */
function camelToKebab(str: string): string {
  return str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

/**
 * Determine whether a hex colour is perceptually dark (luminance <= 0.5).
 * Useful for deciding whether overlaid text should be light or dark.
 */
export function isDarkColor(hex: string): boolean {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.substring(0, 2), 16)
  const g = parseInt(clean.substring(2, 4), 16)
  const b = parseInt(clean.substring(4, 6), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance <= 0.5
}

/** All ThemeColors keys that are set as CSS custom properties. */
const COLOR_KEYS: (keyof ThemeColors)[] = [
  'ink',
  'warm',
  'warmMid',
  'stone',
  'sand',
  'sandLight',
  'linen',
  'cream',
  'accent',
  'accentLight',
  'sectionDark',
  'sectionDarkText',
]

/** Section IDs that may receive light-mode overrides in contrast themes. */
const ALL_CONTRAST_SECTIONS = ['about', 'experience', 'services', 'schedule', 'pricing', 'testimonials']

/**
 * Apply a theme to the document by setting CSS custom properties and data attributes.
 *
 * @param themeId           - Key into the `themes` record (e.g. "warm-earth").
 * @param colorOverrides    - Optional partial map of ThemeColors to override individual tokens.
 * @param typographyOverride - Optional typography option id to use instead of the theme default.
 */
export function applyTheme(
  themeId: string,
  colorOverrides?: Partial<ThemeColors> | null,
  typographyOverride?: string | null,
): void {
  const theme: ThemeDef | undefined = themes[themeId]
  if (!theme) {
    console.warn(`[theme-engine] Unknown theme id "${themeId}". Falling back to "warm-earth".`)
    applyTheme('warm-earth', colorOverrides, typographyOverride)
    return
  }

  const root = document.documentElement

  // ── 1. Colors ──────────────────────────────────────────────────────────────
  for (const key of COLOR_KEYS) {
    const value = (colorOverrides && colorOverrides[key]) || theme.colors[key]
    root.style.setProperty(`--color-${camelToKebab(key as string)}`, value)
  }

  // ── 2. Typography ──────────────────────────────────────────────────────────
  let fontPairing = theme.fonts
  if (typographyOverride) {
    const match = theme.typographyOptions.find((opt: FontPairing) => opt.id === typographyOverride)
    if (match) {
      fontPairing = match
    }
  }
  root.style.setProperty('--font-display', `'${fontPairing.display}', serif`)
  root.style.setProperty('--font-body', `'${fontPairing.body}', sans-serif`)

  // ── 3. Border radius ──────────────────────────────────────────────────────
  root.style.setProperty('--border-radius', theme.borderRadius)

  // ── 4. Dark theme adjustments ──────────────────────────────────────────────
  // For dark themes the linen/cream colours are very dark, so nav and button
  // backgrounds need to be derived from the sand/sandLight tones instead.
  const linenColor = (colorOverrides && colorOverrides.linen) || theme.colors.linen
  const dark = isDarkColor(linenColor)

  root.setAttribute('data-theme-mode', dark ? 'dark' : 'light')

  if (dark) {
    const navBg = (colorOverrides && colorOverrides.sand) || theme.colors.sand
    root.style.setProperty('--nav-bg', navBg)
    root.style.setProperty('--btn-secondary-bg', (colorOverrides && colorOverrides.sandLight) || theme.colors.sandLight)
  } else {
    root.style.setProperty('--nav-bg', linenColor)
    root.style.setProperty('--btn-secondary-bg', (colorOverrides && colorOverrides.sand) || theme.colors.sand)
  }

  // ── 5. Clear previous light-section overrides ──────────────────────────────
  for (const section of ALL_CONTRAST_SECTIONS) {
    const el = document.getElementById(section)
    if (el) {
      el.removeAttribute('data-light-section')
      el.style.removeProperty('--ls-bg')
      el.style.removeProperty('--ls-text')
      el.style.removeProperty('--ls-muted')
      el.style.removeProperty('--ls-border')
      el.style.removeProperty('--ls-hover')
    }
  }

  // ── 6. Apply light-section overrides for contrast themes ───────────────────
  if (theme.lightSections && theme.lightOverride) {
    const ov = theme.lightOverride
    for (const section of theme.lightSections) {
      const el = document.getElementById(section)
      if (el) {
        el.setAttribute('data-light-section', 'true')
        el.style.setProperty('--ls-bg', ov.bg)
        el.style.setProperty('--ls-text', ov.text)
        el.style.setProperty('--ls-muted', ov.muted)
        el.style.setProperty('--ls-border', ov.border)
        el.style.setProperty('--ls-hover', ov.hover)
      }
    }
  }

  // ── 7. Store active theme id for external consumers ────────────────────────
  root.setAttribute('data-theme', themeId)
}
