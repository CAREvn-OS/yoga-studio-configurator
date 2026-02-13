import { useMemo, useRef } from 'react'
import { themes, applyTheme } from '@care/theme-engine'
import { useConfiguratorStore } from '../store/configuratorStore'
import type { ThemeDef } from '@care/shared-types'

/* ── Editable color keys (for 4 native color inputs) ── */
const COLOR_KEYS = [
  { colorKey: 'cream', tooltip: 'Bg' },
  { colorKey: 'linen', tooltip: 'Card' },
  { colorKey: 'sectionDark', tooltip: 'Section' },
  { colorKey: 'accent', tooltip: 'Accent' },
]

export function ThemeStrip() {
  const currentTheme = useConfiguratorStore(s => s.theme)
  const colorOverrides = useConfiguratorStore(s => s.colorOverrides)
  const setTheme = useConfiguratorStore(s => s.setTheme)
  const setColorOverride = useConfiguratorStore(s => s.setColorOverride)
  const setLogoUpload = useConfiguratorStore(s => s.setLogoUpload)
  const logoInputRef = useRef<HTMLInputElement>(null)

  const themeList = useMemo(() => Object.values(themes), [])
  const activeTheme = themes[currentTheme] ?? themeList[0]

  const handleThemeClick = (theme: ThemeDef) => {
    setTheme(theme.id)
    applyTheme(theme.id)
  }

  const getColorValue = (colorKey: string): string => {
    if (colorOverrides && (colorOverrides as Record<string, string>)[colorKey]) {
      return (colorOverrides as Record<string, string>)[colorKey]
    }
    return (activeTheme.colors as Record<string, string>)[colorKey] ?? '#000000'
  }

  const handleLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setLogoUpload(file)
    if (logoInputRef.current) logoInputRef.current.value = ''
  }

  return (
    <div className="cfg-theme-strip">
      {/* Theme swatches */}
      {themeList.map(theme => (
        <button
          key={theme.id}
          className={`cfg-theme-strip__swatch ${currentTheme === theme.id ? 'cfg-theme-strip__swatch--active' : ''}`}
          onClick={() => handleThemeClick(theme)}
          title={theme.name}
        >
          <div className="cfg-theme-strip__half" style={{ background: theme.swatch[0] }} />
          <div className="cfg-theme-strip__half" style={{ background: theme.swatch[1] }} />
        </button>
      ))}

      {/* Divider */}
      <div className="cfg-dock__divider" />

      {/* Color override dots */}
      {COLOR_KEYS.map(ck => (
        <label key={ck.colorKey} className="cfg-theme-strip__color" title={ck.tooltip}>
          <input
            type="color"
            value={getColorValue(ck.colorKey)}
            onChange={e => setColorOverride(ck.colorKey, e.target.value)}
          />
          <span className="cfg-theme-strip__color-dot" style={{ background: getColorValue(ck.colorKey) }} />
        </label>
      ))}

      {/* Divider */}
      <div className="cfg-dock__divider" />

      {/* Logo upload icon */}
      <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoFile} hidden />
      <button
        className="cfg-theme-strip__logo-btn"
        onClick={() => logoInputRef.current?.click()}
        title="Logo"
      >
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </button>
    </div>
  )
}
