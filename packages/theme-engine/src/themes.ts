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
    category: 'warm',
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
    category: 'light',
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
    category: 'dark',
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
    category: 'cool',
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
    category: 'cool',
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
    category: 'warm',
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
    category: 'light',
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
    category: 'dark',
  },

}
