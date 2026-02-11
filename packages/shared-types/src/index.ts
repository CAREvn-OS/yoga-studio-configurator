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
}

export interface MediaUpload {
  blobUrl: string
  name: string
  type: string
  size: number
  remotePath?: string
  remoteUrl?: string
}

// Typography category system
export type TypoCategory = 'headers' | 'subheaders' | 'body' | 'buttons' | 'captions'

export interface TypoCategorySettings {
  fontFamily?: string
  fontWeight?: number
  color?: string
  // Per-category effects
  textShadow?: number   // 0–100 intensity
  glow?: number          // 0–100 intensity
  letterSpacing?: number // 0–100 intensity
  animation?: number     // 0–100 intensity
}

// Vibe system — 6 global presets with intensity
export interface VibeSettings {
  preset: string
  intensity: number // 0–100
}

export type PanelId = 'theme' | 'copy' | 'layout' | 'sections' | 'vibe' | 'typography' | 'share'

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
