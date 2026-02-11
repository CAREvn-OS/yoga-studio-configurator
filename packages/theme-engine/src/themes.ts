import type { ThemeDef } from '@care/shared-types'

/**
 * 15 curated themes for yoga & pilates studio websites.
 *
 * Color semantics:
 *   ink          – primary text / headings
 *   warm         – secondary text / subtle headings
 *   warmMid      – mid-tone text, labels
 *   stone        – borders, dividers
 *   sand         – card / section backgrounds
 *   sandLight    – lighter card variant
 *   linen        – page background (light themes) or subtle surface (dark)
 *   cream        – brightest background surface
 *   accent       – CTA buttons, links, highlights
 *   accentLight  – hover / secondary accent surface
 *   sectionDark  – hero / footer dark section background
 *   sectionDarkText – text color on sectionDark
 *
 * Each theme ships with 3 typographyOptions:
 *   1. A serif + sans-serif "classic" pairing
 *   2. A clean sans-serif pairing
 *   3. An organic / expressive pairing
 */

export const themes: Record<string, ThemeDef> = {
  /* ──────────────────────────────────────────────────────────────────────────
   * 1. WARM EARTH — Terracotta, natural linen, grounding (default)
   * ────────────────────────────────────────────────────────────────────── */
  'warm-earth': {
    id: 'warm-earth',
    name: 'Warm Earth',
    sub: 'Terracotta, natural linen, grounding',
    colors: {
      ink: '#3b2f2a',
      warm: '#6b5347',
      warmMid: '#8c7565',
      stone: '#c7b8a9',
      sand: '#ede4da',
      sandLight: '#f5efe8',
      linen: '#faf6f1',
      cream: '#fefcf9',
      accent: '#c2613a',
      accentLight: '#f0d5c8',
      sectionDark: '#3b2f2a',
      sectionDarkText: '#f5efe8',
    },
    fonts: { id: 'serif-classic', name: 'Classic Serif', display: 'Cormorant Garamond', body: 'Outfit' },
    typographyOptions: [
      { id: 'serif-classic', name: 'Classic Serif', display: 'Cormorant Garamond', body: 'Outfit' },
      { id: 'sans-clean', name: 'Clean Sans', display: 'Jost', body: 'Work Sans' },
      { id: 'organic', name: 'Organic', display: 'Fraunces', body: 'Nunito Sans' },
    ],
    borderRadius: '8px',
    swatch: ['#faf6f1', '#c2613a'],
    editableColors: { primary: 'ink', secondary: 'warm', tertiary: 'sand', accent: 'accent' },
  },

  /* ──────────────────────────────────────────────────────────────────────────
   * 2. STUDIO INK — High-contrast, editorial yoga journal
   * ────────────────────────────────────────────────────────────────────── */
  'studio-ink': {
    id: 'studio-ink',
    name: 'Studio Ink',
    sub: 'High-contrast, editorial yoga journal',
    colors: {
      ink: '#1a1a1a',
      warm: '#3d3d3d',
      warmMid: '#6b6b6b',
      stone: '#c4c4c4',
      sand: '#ededed',
      sandLight: '#f5f5f5',
      linen: '#fafafa',
      cream: '#ffffff',
      accent: '#1a1a1a',
      accentLight: '#e0e0e0',
      sectionDark: '#1a1a1a',
      sectionDarkText: '#f5f5f5',
    },
    fonts: { id: 'serif-editorial', name: 'Editorial Serif', display: 'Playfair Display', body: 'Inter' },
    typographyOptions: [
      { id: 'serif-editorial', name: 'Editorial Serif', display: 'Playfair Display', body: 'Inter' },
      { id: 'sans-modern', name: 'Modern Sans', display: 'Space Grotesk', body: 'Inter' },
      { id: 'organic-ink', name: 'Organic Ink', display: 'Libre Baskerville', body: 'Karla' },
    ],
    borderRadius: '4px',
    swatch: ['#fafafa', '#1a1a1a'],
    editableColors: { primary: 'ink', secondary: 'warm', tertiary: 'sand', accent: 'accent' },
  },

  /* ──────────────────────────────────────────────────────────────────────────
   * 3. NIGHT PRACTICE — Deep dark, gold accents, evening class
   * ────────────────────────────────────────────────────────────────────── */
  'night-practice': {
    id: 'night-practice',
    name: 'Night Practice',
    sub: 'Deep dark, gold accents, evening class',
    colors: {
      ink: '#f0e8dd',
      warm: '#c9bfb2',
      warmMid: '#9a9083',
      stone: '#4a453e',
      sand: '#2a2622',
      sandLight: '#33302b',
      linen: '#1e1b18',
      cream: '#161412',
      accent: '#c9a84c',
      accentLight: '#3d3526',
      sectionDark: '#12100e',
      sectionDarkText: '#f0e8dd',
    },
    fonts: { id: 'serif-luxury', name: 'Luxury Serif', display: 'DM Serif Display', body: 'DM Sans' },
    typographyOptions: [
      { id: 'serif-luxury', name: 'Luxury Serif', display: 'DM Serif Display', body: 'DM Sans' },
      { id: 'sans-sleek', name: 'Sleek Sans', display: 'Sora', body: 'Inter' },
      { id: 'organic-night', name: 'Evening Organic', display: 'Cormorant Garamond', body: 'Outfit' },
    ],
    borderRadius: '6px',
    swatch: ['#1e1b18', '#c9a84c'],
    editableColors: { primary: 'ink', secondary: 'warm', tertiary: 'sand', accent: 'accent' },
  },

  /* ──────────────────────────────────────────────────────────────────────────
   * 4. FOREST CALM — Green, moss, natural retreat
   * ────────────────────────────────────────────────────────────────────── */
  'forest-calm': {
    id: 'forest-calm',
    name: 'Forest Calm',
    sub: 'Green, moss, natural retreat',
    colors: {
      ink: '#1e2e22',
      warm: '#3e5a42',
      warmMid: '#6a8a6e',
      stone: '#b0c4b1',
      sand: '#dfe9df',
      sandLight: '#ecf2ec',
      linen: '#f4f8f4',
      cream: '#fafcfa',
      accent: '#4a7c59',
      accentLight: '#d2e5d6',
      sectionDark: '#1e2e22',
      sectionDarkText: '#ecf2ec',
    },
    fonts: { id: 'serif-nature', name: 'Nature Serif', display: 'Libre Baskerville', body: 'Karla' },
    typographyOptions: [
      { id: 'serif-nature', name: 'Nature Serif', display: 'Libre Baskerville', body: 'Karla' },
      { id: 'sans-fresh', name: 'Fresh Sans', display: 'Outfit', body: 'Nunito Sans' },
      { id: 'organic-forest', name: 'Forest Organic', display: 'Fraunces', body: 'Work Sans' },
    ],
    borderRadius: '10px',
    swatch: ['#f4f8f4', '#4a7c59'],
    editableColors: { primary: 'ink', secondary: 'warm', tertiary: 'sand', accent: 'accent' },
  },

  /* ──────────────────────────────────────────────────────────────────────────
   * 5. OCEAN DEPTH — Deep blue, trust, professional studio
   * ────────────────────────────────────────────────────────────────────── */
  'ocean-depth': {
    id: 'ocean-depth',
    name: 'Ocean Depth',
    sub: 'Deep blue, trust, professional studio',
    colors: {
      ink: '#162036',
      warm: '#2e4a6e',
      warmMid: '#5a7a9e',
      stone: '#a3b8ce',
      sand: '#dce5ef',
      sandLight: '#ebf0f6',
      linen: '#f3f6fa',
      cream: '#fafbfd',
      accent: '#2b5ea7',
      accentLight: '#c8d9ee',
      sectionDark: '#162036',
      sectionDarkText: '#ebf0f6',
    },
    fonts: { id: 'serif-professional', name: 'Professional Serif', display: 'EB Garamond', body: 'Inter' },
    typographyOptions: [
      { id: 'serif-professional', name: 'Professional Serif', display: 'EB Garamond', body: 'Inter' },
      { id: 'sans-ocean', name: 'Ocean Sans', display: 'Space Grotesk', body: 'DM Sans' },
      { id: 'organic-wave', name: 'Coastal Organic', display: 'Lora', body: 'Nunito Sans' },
    ],
    borderRadius: '8px',
    swatch: ['#f3f6fa', '#2b5ea7'],
    editableColors: { primary: 'ink', secondary: 'warm', tertiary: 'sand', accent: 'accent' },
  },

  /* ──────────────────────────────────────────────────────────────────────────
   * 6. ROSE QUARTZ — Soft pink, feminine wellness
   * ────────────────────────────────────────────────────────────────────── */
  'rose-quartz': {
    id: 'rose-quartz',
    name: 'Rose Quartz',
    sub: 'Soft pink, feminine wellness',
    colors: {
      ink: '#3a2530',
      warm: '#6e4558',
      warmMid: '#9a7085',
      stone: '#cbb0be',
      sand: '#f0e0ea',
      sandLight: '#f6ecf1',
      linen: '#fbf5f8',
      cream: '#fefafc',
      accent: '#c0627e',
      accentLight: '#f2d3de',
      sectionDark: '#3a2530',
      sectionDarkText: '#f6ecf1',
    },
    fonts: { id: 'serif-feminine', name: 'Feminine Serif', display: 'Cormorant Garamond', body: 'Nunito Sans' },
    typographyOptions: [
      { id: 'serif-feminine', name: 'Feminine Serif', display: 'Cormorant Garamond', body: 'Nunito Sans' },
      { id: 'sans-soft', name: 'Soft Sans', display: 'Jost', body: 'DM Sans' },
      { id: 'organic-rose', name: 'Rose Organic', display: 'Lora', body: 'Karla' },
    ],
    borderRadius: '12px',
    swatch: ['#fbf5f8', '#c0627e'],
    editableColors: { primary: 'ink', secondary: 'warm', tertiary: 'sand', accent: 'accent' },
  },

  /* ──────────────────────────────────────────────────────────────────────────
   * 7. SUNRISE ENERGY — Vibrant, energetic morning practice
   * ────────────────────────────────────────────────────────────────────── */
  'sunrise-energy': {
    id: 'sunrise-energy',
    name: 'Sunrise Energy',
    sub: 'Vibrant, energetic morning practice',
    colors: {
      ink: '#2d1e14',
      warm: '#5c3d28',
      warmMid: '#8a6a50',
      stone: '#c4a98e',
      sand: '#f0e2d2',
      sandLight: '#f7ede2',
      linen: '#fcf7f2',
      cream: '#fffbf8',
      accent: '#d96a28',
      accentLight: '#f5d4bc',
      sectionDark: '#2d1e14',
      sectionDarkText: '#f7ede2',
    },
    fonts: { id: 'sans-energetic', name: 'Energetic Sans', display: 'Outfit', body: 'Work Sans' },
    typographyOptions: [
      { id: 'sans-energetic', name: 'Energetic Sans', display: 'Outfit', body: 'Work Sans' },
      { id: 'serif-sunrise', name: 'Sunrise Serif', display: 'Crimson Pro', body: 'Jost' },
      { id: 'organic-dawn', name: 'Dawn Organic', display: 'Fraunces', body: 'Sora' },
    ],
    borderRadius: '10px',
    swatch: ['#fcf7f2', '#d96a28'],
    editableColors: { primary: 'ink', secondary: 'warm', tertiary: 'sand', accent: 'accent' },
  },

  /* ──────────────────────────────────────────────────────────────────────────
   * 8. PURE FORM — Black/white, minimal, form-focused
   * ────────────────────────────────────────────────────────────────────── */
  'pure-form': {
    id: 'pure-form',
    name: 'Pure Form',
    sub: 'Black & white, minimal, form-focused',
    colors: {
      ink: '#111111',
      warm: '#333333',
      warmMid: '#666666',
      stone: '#bbbbbb',
      sand: '#eeeeee',
      sandLight: '#f5f5f5',
      linen: '#fafafa',
      cream: '#ffffff',
      accent: '#222222',
      accentLight: '#dddddd',
      sectionDark: '#111111',
      sectionDarkText: '#f5f5f5',
    },
    fonts: { id: 'sans-minimal', name: 'Minimal Sans', display: 'Space Grotesk', body: 'Inter' },
    typographyOptions: [
      { id: 'sans-minimal', name: 'Minimal Sans', display: 'Space Grotesk', body: 'Inter' },
      { id: 'serif-pure', name: 'Pure Serif', display: 'EB Garamond', body: 'Karla' },
      { id: 'organic-form', name: 'Form Organic', display: 'Source Serif 4', body: 'Sora' },
    ],
    borderRadius: '2px',
    swatch: ['#fafafa', '#222222'],
    editableColors: { primary: 'ink', secondary: 'warm', tertiary: 'sand', accent: 'accent' },
  },

  /* ──────────────────────────────────────────────────────────────────────────
   * 9. MOONRISE — Dark base with light section breaks (contrast theme)
   * ────────────────────────────────────────────────────────────────────── */
  'moonrise': {
    id: 'moonrise',
    name: 'Moonrise',
    sub: 'Dark with light section breaks',
    colors: {
      ink: '#e8e2d8',
      warm: '#bdb5a8',
      warmMid: '#8f877a',
      stone: '#4d483f',
      sand: '#2e2b26',
      sandLight: '#38342e',
      linen: '#222019',
      cream: '#1a1813',
      accent: '#d4b97a',
      accentLight: '#3c3527',
      sectionDark: '#151310',
      sectionDarkText: '#e8e2d8',
    },
    fonts: { id: 'serif-moon', name: 'Moonlit Serif', display: 'Playfair Display', body: 'DM Sans' },
    typographyOptions: [
      { id: 'serif-moon', name: 'Moonlit Serif', display: 'Playfair Display', body: 'DM Sans' },
      { id: 'sans-lunar', name: 'Lunar Sans', display: 'Jost', body: 'Inter' },
      { id: 'organic-moon', name: 'Moon Organic', display: 'Cormorant Garamond', body: 'Nunito Sans' },
    ],
    borderRadius: '8px',
    swatch: ['#222019', '#d4b97a'],
    lightSections: ['about', 'experience'],
    lightOverride: {
      bg: '#faf7f2',
      text: '#2e2b26',
      muted: '#6b6560',
      border: '#d8d0c4',
      hover: '#f0ebe3',
    },
    editableColors: { primary: 'ink', secondary: 'warm', tertiary: 'sand', accent: 'accent' },
  },

  /* ──────────────────────────────────────────────────────────────────────────
   * 10. TWILIGHT FLOW — Deep purple, meditative
   * ────────────────────────────────────────────────────────────────────── */
  'twilight-flow': {
    id: 'twilight-flow',
    name: 'Twilight Flow',
    sub: 'Deep purple, meditative',
    colors: {
      ink: '#e0d8eb',
      warm: '#b5a9c8',
      warmMid: '#877a9c',
      stone: '#4d4460',
      sand: '#2e2840',
      sandLight: '#36304a',
      linen: '#201c30',
      cream: '#181525',
      accent: '#a882d4',
      accentLight: '#362d4a',
      sectionDark: '#12101e',
      sectionDarkText: '#e0d8eb',
    },
    fonts: { id: 'serif-meditation', name: 'Meditation Serif', display: 'DM Serif Display', body: 'DM Sans' },
    typographyOptions: [
      { id: 'serif-meditation', name: 'Meditation Serif', display: 'DM Serif Display', body: 'DM Sans' },
      { id: 'sans-twilight', name: 'Twilight Sans', display: 'Sora', body: 'Work Sans' },
      { id: 'organic-dusk', name: 'Dusk Organic', display: 'Lora', body: 'Karla' },
    ],
    borderRadius: '8px',
    swatch: ['#201c30', '#a882d4'],
    editableColors: { primary: 'ink', secondary: 'warm', tertiary: 'sand', accent: 'accent' },
  },

  /* ──────────────────────────────────────────────────────────────────────────
   * 11. TWILIGHT HARMONY — Purple with light breaks (contrast theme)
   * ────────────────────────────────────────────────────────────────────── */
  'twilight-harmony': {
    id: 'twilight-harmony',
    name: 'Twilight Harmony',
    sub: 'Purple with light section breaks',
    colors: {
      ink: '#ddd5e8',
      warm: '#b0a5c2',
      warmMid: '#847898',
      stone: '#4e4464',
      sand: '#302844',
      sandLight: '#38304e',
      linen: '#221e34',
      cream: '#1a1628',
      accent: '#b48ed8',
      accentLight: '#3a3050',
      sectionDark: '#141020',
      sectionDarkText: '#ddd5e8',
    },
    fonts: { id: 'serif-harmony', name: 'Harmony Serif', display: 'Cormorant Garamond', body: 'DM Sans' },
    typographyOptions: [
      { id: 'serif-harmony', name: 'Harmony Serif', display: 'Cormorant Garamond', body: 'DM Sans' },
      { id: 'sans-harmony', name: 'Harmony Sans', display: 'Jost', body: 'Inter' },
      { id: 'organic-harmony', name: 'Harmony Organic', display: 'Fraunces', body: 'Nunito Sans' },
    ],
    borderRadius: '8px',
    swatch: ['#221e34', '#b48ed8'],
    lightSections: ['about', 'services'],
    lightOverride: {
      bg: '#f8f5fc',
      text: '#302844',
      muted: '#6b6080',
      border: '#d4cce2',
      hover: '#efe8f8',
    },
    editableColors: { primary: 'ink', secondary: 'warm', tertiary: 'sand', accent: 'accent' },
  },

  /* ──────────────────────────────────────────────────────────────────────────
   * 12. STONE STUDIO — Cool grey, modern urban studio
   * ────────────────────────────────────────────────────────────────────── */
  'stone-studio': {
    id: 'stone-studio',
    name: 'Stone Studio',
    sub: 'Cool grey, modern urban studio',
    colors: {
      ink: '#232629',
      warm: '#454b52',
      warmMid: '#6d747c',
      stone: '#aeb4bb',
      sand: '#e2e5e8',
      sandLight: '#edf0f2',
      linen: '#f5f6f8',
      cream: '#fbfbfc',
      accent: '#4a6670',
      accentLight: '#cfdde2',
      sectionDark: '#232629',
      sectionDarkText: '#edf0f2',
    },
    fonts: { id: 'sans-urban', name: 'Urban Sans', display: 'Space Grotesk', body: 'DM Sans' },
    typographyOptions: [
      { id: 'sans-urban', name: 'Urban Sans', display: 'Space Grotesk', body: 'DM Sans' },
      { id: 'serif-stone', name: 'Stone Serif', display: 'Source Serif 4', body: 'Inter' },
      { id: 'organic-urban', name: 'Urban Organic', display: 'Crimson Pro', body: 'Work Sans' },
    ],
    borderRadius: '6px',
    swatch: ['#f5f6f8', '#4a6670'],
    editableColors: { primary: 'ink', secondary: 'warm', tertiary: 'sand', accent: 'accent' },
  },

  /* ──────────────────────────────────────────────────────────────────────────
   * 13. GOLDEN HOUR — Warm bronze, sunset session
   * ────────────────────────────────────────────────────────────────────── */
  'golden-hour': {
    id: 'golden-hour',
    name: 'Golden Hour',
    sub: 'Warm bronze, sunset session',
    colors: {
      ink: '#2f2318',
      warm: '#5e4430',
      warmMid: '#8d6e52',
      stone: '#c4a486',
      sand: '#ede0d0',
      sandLight: '#f5ece0',
      linen: '#fbf6ef',
      cream: '#fefbf7',
      accent: '#b07c3a',
      accentLight: '#eddcc4',
      sectionDark: '#2f2318',
      sectionDarkText: '#f5ece0',
    },
    fonts: { id: 'serif-golden', name: 'Golden Serif', display: 'Playfair Display', body: 'Outfit' },
    typographyOptions: [
      { id: 'serif-golden', name: 'Golden Serif', display: 'Playfair Display', body: 'Outfit' },
      { id: 'sans-bronze', name: 'Bronze Sans', display: 'Jost', body: 'Nunito Sans' },
      { id: 'organic-sunset', name: 'Sunset Organic', display: 'Fraunces', body: 'Karla' },
    ],
    borderRadius: '8px',
    swatch: ['#fbf6ef', '#b07c3a'],
    editableColors: { primary: 'ink', secondary: 'warm', tertiary: 'sand', accent: 'accent' },
  },

  /* ──────────────────────────────────────────────────────────────────────────
   * 14. EMBER — Warm grey, heated studio feel
   * ────────────────────────────────────────────────────────────────────── */
  'ember': {
    id: 'ember',
    name: 'Ember',
    sub: 'Warm grey, heated studio feel',
    colors: {
      ink: '#2c2726',
      warm: '#524845',
      warmMid: '#7a6e6a',
      stone: '#b0a39d',
      sand: '#e4dbd5',
      sandLight: '#efe8e4',
      linen: '#f7f3f0',
      cream: '#fcfaf8',
      accent: '#a0503c',
      accentLight: '#e8cfc7',
      sectionDark: '#2c2726',
      sectionDarkText: '#efe8e4',
    },
    fonts: { id: 'serif-ember', name: 'Ember Serif', display: 'Crimson Pro', body: 'Work Sans' },
    typographyOptions: [
      { id: 'serif-ember', name: 'Ember Serif', display: 'Crimson Pro', body: 'Work Sans' },
      { id: 'sans-heat', name: 'Heat Sans', display: 'Sora', body: 'DM Sans' },
      { id: 'organic-ember', name: 'Ember Organic', display: 'Lora', body: 'Outfit' },
    ],
    borderRadius: '6px',
    swatch: ['#f7f3f0', '#a0503c'],
    editableColors: { primary: 'ink', secondary: 'warm', tertiary: 'sand', accent: 'accent' },
  },

  /* ──────────────────────────────────────────────────────────────────────────
   * 15. ICE AIR — Clean blue-white, breath-focused
   * ────────────────────────────────────────────────────────────────────── */
  'ice-air': {
    id: 'ice-air',
    name: 'Ice Air',
    sub: 'Clean blue-white, breath-focused',
    colors: {
      ink: '#1a2a36',
      warm: '#3a5568',
      warmMid: '#6888a0',
      stone: '#a8c0d0',
      sand: '#dce8f0',
      sandLight: '#eaf1f6',
      linen: '#f2f7fa',
      cream: '#fafcfe',
      accent: '#3a8ab5',
      accentLight: '#c4dfe9',
      sectionDark: '#1a2a36',
      sectionDarkText: '#eaf1f6',
    },
    fonts: { id: 'sans-breath', name: 'Breath Sans', display: 'Outfit', body: 'Inter' },
    typographyOptions: [
      { id: 'sans-breath', name: 'Breath Sans', display: 'Outfit', body: 'Inter' },
      { id: 'serif-ice', name: 'Ice Serif', display: 'Source Serif 4', body: 'Jost' },
      { id: 'organic-air', name: 'Air Organic', display: 'Lora', body: 'Sora' },
    ],
    borderRadius: '10px',
    swatch: ['#f2f7fa', '#3a8ab5'],
    editableColors: { primary: 'ink', secondary: 'warm', tertiary: 'sand', accent: 'accent' },
  },
}
