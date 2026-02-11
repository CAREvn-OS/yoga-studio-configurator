import { useState, useMemo, useRef } from 'react'
import { themes, applyTheme } from '@care/theme-engine'
import { useConfiguratorStore } from '../store/configuratorStore'
import type { ThemeDef } from '@care/shared-types'

// Map UI labels to ThemeColors keys for bg/card/section editing
const EDITABLE_COLORS: { role: string; label: string; colorKey: string }[] = [
  { role: 'background', label: 'Background', colorKey: 'cream' },
  { role: 'card', label: 'Card', colorKey: 'linen' },
  { role: 'section', label: 'Section', colorKey: 'sectionDark' },
  { role: 'accent', label: 'Accent', colorKey: 'accent' },
]

export function ThemePanel() {
  const currentTheme = useConfiguratorStore(s => s.theme)
  const colorOverrides = useConfiguratorStore(s => s.colorOverrides)
  const setTheme = useConfiguratorStore(s => s.setTheme)
  const setColorOverride = useConfiguratorStore(s => s.setColorOverride)
  const clearColorOverrides = useConfiguratorStore(s => s.clearColorOverrides)
  const logoUpload = useConfiguratorStore(s => s.logoUpload)
  const setLogoUpload = useConfiguratorStore(s => s.setLogoUpload)
  const clearLogoUpload = useConfiguratorStore(s => s.clearLogoUpload)

  const [colorsExpanded, setColorsExpanded] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)

  const themeList = useMemo(() => Object.values(themes), [])

  const handleThemeClick = (theme: ThemeDef) => {
    setTheme(theme.id)
    applyTheme(theme.id)
  }

  const activeTheme = themes[currentTheme] ?? themeList[0]

  const getColorValue = (colorKey: string): string => {
    if (colorOverrides && (colorOverrides as Record<string, string>)[colorKey]) {
      return (colorOverrides as Record<string, string>)[colorKey]
    }
    return (activeTheme.colors as Record<string, string>)[colorKey] ?? '#000000'
  }

  const handleColorChange = (colorKey: string, value: string) => {
    setColorOverride(colorKey, value)
  }

  const hasOverrides = colorOverrides && Object.keys(colorOverrides).length > 0

  const handleLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setLogoUpload(file)
    if (logoInputRef.current) logoInputRef.current.value = ''
  }

  const logoUrl = logoUpload?.remoteUrl ?? logoUpload?.blobUrl

  return (
    <div className="cfg-theme-cascade">
      {/* Theme selection */}
      <div className="cfg-theme-list">
        {themeList.map(theme => (
          <button
            key={theme.id}
            className={`cfg-theme-swatch ${currentTheme === theme.id ? 'cfg-theme-swatch--active' : ''}`}
            onClick={() => handleThemeClick(theme)}
          >
            <div className="cfg-theme-swatch__color">
              <div className="cfg-theme-swatch__color-half" style={{ background: theme.swatch[0] }} />
              <div className="cfg-theme-swatch__color-half" style={{ background: theme.swatch[1] }} />
            </div>
            <div className="cfg-theme-swatch__info">
              <span className="cfg-theme-swatch__name">{theme.name}</span>
              <span className="cfg-theme-swatch__sub">{theme.sub}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Color customization dropdown */}
      <div className={`cfg-typo-cat ${colorsExpanded ? 'cfg-typo-cat--open' : ''}`} style={{ marginTop: 8 }}>
        <button
          className={`cfg-typo-cat__header ${hasOverrides ? 'cfg-typo-cat__header--set' : ''}`}
          onClick={() => setColorsExpanded(!colorsExpanded)}
        >
          <div className="cfg-typo-cat__info">
            <span className="cfg-typo-cat__name">Customize Colors</span>
            <span className="cfg-typo-cat__desc">Background, cards & accent</span>
          </div>
          {hasOverrides && (
            <span className="cfg-typo-cat__badge">Custom</span>
          )}
          <svg
            className="cfg-typo-cat__chevron"
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {colorsExpanded && (
          <div className="cfg-typo-cat__body">
            <div className="cfg-theme-colors-inline">
              {EDITABLE_COLORS.map(({ role, label, colorKey }) => {
                const value = getColorValue(colorKey)
                return (
                  <div key={role} className="cfg-theme-color-row">
                    <span className="cfg-theme-color-row__label">{label}</span>
                    <div className="cfg-theme-color-row__controls">
                      <input
                        type="color"
                        value={value}
                        onChange={e => handleColorChange(colorKey, e.target.value)}
                        className="cfg-typo-level__color-picker"
                      />
                      <span className="cfg-typo-level__color-hex">{value}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {hasOverrides && (
              <button className="cfg-colors-reset" style={{ marginTop: 8 }} onClick={clearColorOverrides}>
                Reset to Theme Defaults
              </button>
            )}
          </div>
        )}
      </div>

      {/* Logo upload */}
      <div style={{ marginTop: 12 }}>
        <div className="cfg-layout-group__label">Logo</div>
        <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoFile} hidden />
        {logoUrl ? (
          <div className="cfg-logo-preview">
            <img src={logoUrl} alt="Logo" className="cfg-logo-preview__img" />
            <button className="cfg-colors-reset" onClick={clearLogoUpload}>
              Remove Logo
            </button>
          </div>
        ) : (
          <button
            className="cfg-share-btn"
            onClick={() => logoInputRef.current?.click()}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            Upload Logo
          </button>
        )}
      </div>
    </div>
  )
}
