export interface ThemeColors {
  ink: string
  warm: string
  warmMid: string
  stone: string
  sand: string
  sandLight: string
  linen: string
  cream: string
  accent: string
  accentLight: string
  sectionDark: string
  sectionDarkText: string
}

export interface FontPairing {
  id: string
  name: string
  display: string
  body: string
}

export interface ThemeDef {
  id: string
  name: string
  sub: string
  colors: ThemeColors
  fonts: FontPairing
  typographyOptions: FontPairing[]
  borderRadius: string
  swatch: [string, string]
  lightSections?: string[]
  lightOverride?: { bg: string; text: string; muted: string; border: string; hover: string }
  editableColors: {
    primary: keyof ThemeColors
    secondary: keyof ThemeColors
    tertiary: keyof ThemeColors
    accent: keyof ThemeColors
  }
  category: 'light' | 'dark' | 'warm' | 'cool'
}

export interface MediaUpload {
  blobUrl: string
  name: string
  type: string
  size: number
  remotePath?: string
  remoteUrl?: string
  responsiveUrls?: { mobile: string; tablet: string; desktop: string }
}

// Typography category system
export type TypoCategory = 'headers' | 'subheaders' | 'body' | 'buttons' | 'captions'

export interface TypoCategorySettings {
  fontFamily?: string
  fontWeight?: number
  color?: string
  letterSpacing?: number // 0–100 intensity
}

export type ImageDisplayStyle = 'none' | 'gradient-fade'

export interface MediaSlotSettings {
  displayStyle: ImageDisplayStyle
  aspectRatio?: string
  objectPosition?: string
  imageScale?: number
}

export type ButtonStyle = 'rounded' | 'sharp' | 'pill'
export type CardStyle = 'flat' | 'shadow' | 'outline'

// Vibe system — 6 presets (normal + 5 animated)
export type VibePreset = 'normal' | 'serene' | 'breathe' | 'spring' | 'flow' | 'snap'

export interface VibeSettings {
  preset: VibePreset
}

export type DockMode = 'theme' | 'typography' | 'vibe' | 'settings'

export type Language = 'vi' | 'en'

export interface EffectDef {
  name: string
  className: string
}

export interface LayoutOption {
  id: string
  name: string
}

export interface LayoutGroup {
  label: string
  options: LayoutOption[]
}

export type CopyAlternatives = Record<string, string[]>

export interface SectionItemConfig {
  min: number
  max: number
  default: number
  label: string
  labelPlural: string
  hasImage: boolean
}

export const SECTION_ITEM_CONFIGS: Record<string, SectionItemConfig> = {
  schedule: { min: 1, max: 12, default: 6, label: 'class', labelPlural: 'classes', hasImage: true },
  instructors: { min: 1, max: 8, default: 4, label: 'instructor', labelPlural: 'instructors', hasImage: true },
  pricing: { min: 1, max: 6, default: 4, label: 'tier', labelPlural: 'tiers', hasImage: false },
  testimonials: { min: 1, max: 8, default: 3, label: 'testimonial', labelPlural: 'testimonials', hasImage: true },
  faq: { min: 1, max: 10, default: 4, label: 'question', labelPlural: 'questions', hasImage: false },
  process: { min: 2, max: 8, default: 4, label: 'step', labelPlural: 'steps', hasImage: false },
  studioTour: { min: 1, max: 8, default: 4, label: 'image', labelPlural: 'images', hasImage: true },
  events: { min: 1, max: 6, default: 3, label: 'event', labelPlural: 'events', hasImage: true },
  blog: { min: 1, max: 6, default: 3, label: 'post', labelPlural: 'posts', hasImage: true },
  partners: { min: 1, max: 10, default: 5, label: 'partner', labelPlural: 'partners', hasImage: true },
}
