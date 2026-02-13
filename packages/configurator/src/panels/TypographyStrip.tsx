import { useState } from 'react'
import { useConfiguratorStore } from '../store/configuratorStore'
import { ct } from '../i18n/cfgStrings'
import type { TypoCategory } from '@care/shared-types'

/* ── Category icon definitions ── */
const CATEGORIES: { id: TypoCategory; icon: JSX.Element; labelKey: string }[] = [
  {
    id: 'headers',
    labelKey: 'typo.headers',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><text x="5" y="18" fontSize="16" fontWeight="700" fill="currentColor" stroke="none">H</text></svg>,
  },
  {
    id: 'subheaders',
    labelKey: 'typo.subheaders',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><text x="7" y="18" fontSize="14" fontWeight="400" fill="currentColor" stroke="none">h</text></svg>,
  },
  {
    id: 'body',
    labelKey: 'typo.body',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="11" x2="18" y2="11" /><line x1="4" y1="16" x2="14" y2="16" /></svg>,
  },
  {
    id: 'buttons',
    labelKey: 'typo.buttons',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="7" width="18" height="10" rx="5" /></svg>,
  },
  {
    id: 'captions',
    labelKey: 'typo.captions',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="5" y1="8" x2="19" y2="8" /><line x1="5" y1="13" x2="15" y2="13" /><line x1="5" y1="18" x2="10" y2="18" /></svg>,
  },
]

/* ── Font options (compact) ── */
const FONTS: { id: string; name: string; family: string }[] = [
  { id: 'serene', name: 'Serene', family: "'Cormorant Garamond', serif" },
  { id: 'modern', name: 'Modern', family: "'Outfit', sans-serif" },
  { id: 'organic', name: 'Organic', family: "'Lora', serif" },
  { id: 'minimal', name: 'Minimal', family: "'Jost', sans-serif" },
  { id: 'classic', name: 'Classic', family: "'Source Serif 4', serif" },
  { id: 'bold', name: 'Bold', family: "'DM Sans', sans-serif" },
  { id: 'editorial', name: 'Editorial', family: "'Playfair Display', serif" },
  { id: 'geometric', name: 'Geometric', family: "'Poppins', sans-serif" },
  { id: 'literary', name: 'Literary', family: "'Bitter', serif" },
  { id: 'clean', name: 'Clean', family: "'Raleway', sans-serif" },
  { id: 'script', name: 'Script', family: "'Dancing Script', cursive" },
  { id: 'elegant', name: 'Elegant', family: "'Great Vibes', cursive" },
]

export function TypographyStrip() {
  const [activeCat, setActiveCat] = useState<TypoCategory | null>(null)
  const typoCategorySettings = useConfiguratorStore(s => s.typoCategorySettings)
  const setTypoCategorySetting = useConfiguratorStore(s => s.setTypoCategorySetting)
  const language = useConfiguratorStore(s => s.language)

  if (activeCat) {
    /* ── Sub-strip: inline controls for selected category ── */
    const settings = typoCategorySettings[activeCat]

    return (
      <div className="cfg-typo-strip cfg-typo-strip--sub">
        {/* Back to categories */}
        <button className="cfg-dock-back cfg-dock-back--sm" onClick={() => setActiveCat(null)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <div className="cfg-dock__divider" />

        {/* Font chips (scrollable) */}
        <div className="cfg-typo-strip__fonts">
          {FONTS.map(f => (
            <button
              key={f.id}
              className={`cfg-typo-chip cfg-typo-chip--sm ${settings?.fontFamily === f.id ? 'cfg-typo-chip--active' : ''}`}
              onClick={() => setTypoCategorySetting(activeCat, { fontFamily: f.id })}
              style={{ fontFamily: f.family }}
            >
              {f.name}
            </button>
          ))}
        </div>

        <div className="cfg-dock__divider" />

        {/* Weight slider */}
        <div className="cfg-typo-strip__control">
          <input
            type="range" min="100" max="900" step="100"
            value={settings?.fontWeight ?? 400}
            onChange={e => setTypoCategorySetting(activeCat, { fontWeight: Number(e.target.value) })}
            className="cfg-vibe-slider cfg-vibe-slider--sm"
            style={{ width: 50 }}
            title={`${ct(language, 'typo.weight')}: ${settings?.fontWeight ?? 400}`}
          />
        </div>

        {/* Color */}
        <label className="cfg-theme-strip__color" title={ct(language, 'typo.color')}>
          <input
            type="color"
            value={settings?.color ?? '#1a1a1a'}
            onChange={e => setTypoCategorySetting(activeCat, { color: e.target.value })}
          />
          <span className="cfg-theme-strip__color-dot" style={{ background: settings?.color ?? '#1a1a1a' }} />
        </label>

        {/* Spacing slider */}
        <div className="cfg-typo-strip__control">
          <input
            type="range" min="0" max="100" step="5"
            value={settings?.letterSpacing ?? 0}
            onChange={e => setTypoCategorySetting(activeCat, { letterSpacing: Number(e.target.value) })}
            className="cfg-vibe-slider cfg-vibe-slider--sm"
            style={{ width: 40 }}
            title={`${ct(language, 'typo.spacing')}: ${settings?.letterSpacing ?? 0}%`}
          />
        </div>
      </div>
    )
  }

  /* ── Root: 5 category icons ── */
  return (
    <div className="cfg-typo-strip">
      {CATEGORIES.map(cat => {
        const hasSettings = !!typoCategorySettings[cat.id]?.fontFamily || !!typoCategorySettings[cat.id]?.color
        return (
          <button
            key={cat.id}
            className={`cfg-typo-strip__cat ${hasSettings ? 'cfg-typo-strip__cat--set' : ''}`}
            onClick={() => setActiveCat(cat.id)}
            title={ct(language, cat.labelKey)}
          >
            {cat.icon}
          </button>
        )
      })}
    </div>
  )
}
