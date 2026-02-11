import { useState, useMemo, useRef } from 'react'
import { themes, applyTheme } from '@care/theme-engine'
import { useConfiguratorStore } from '../store/configuratorStore'
import type { ThemeDef, ButtonStyle, CardStyle, GradientType } from '@care/shared-types'

const EDITABLE_COLORS: { role: string; label: string; colorKey: string }[] = [
  { role: 'background', label: 'Background', colorKey: 'cream' },
  { role: 'card', label: 'Card', colorKey: 'linen' },
  { role: 'section', label: 'Section', colorKey: 'sectionDark' },
  { role: 'accent', label: 'Accent', colorKey: 'accent' },
]

const BUTTON_STYLES: { id: ButtonStyle; label: string }[] = [
  { id: 'rounded', label: 'Rounded' },
  { id: 'sharp', label: 'Sharp' },
  { id: 'pill', label: 'Pill' },
]

const CARD_STYLES: { id: CardStyle; label: string }[] = [
  { id: 'flat', label: 'Flat' },
  { id: 'shadow', label: 'Shadow' },
  { id: 'outline', label: 'Outline' },
]

const GRADIENT_TYPES: { id: GradientType; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'linear', label: 'Linear' },
  { id: 'radial', label: 'Radial' },
  { id: 'diagonal', label: 'Diagonal' },
  { id: 'mesh', label: 'Mesh' },
  { id: 'subtle', label: 'Subtle' },
]

const THEME_CATEGORIES: { id: string; label: string }[] = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'warm', label: 'Warm' },
  { id: 'cool', label: 'Cool' },
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
  const borderRadiusOverride = useConfiguratorStore(s => s.borderRadiusOverride)
  const setBorderRadiusOverride = useConfiguratorStore(s => s.setBorderRadiusOverride)
  const buttonStyle = useConfiguratorStore(s => s.buttonStyle)
  const setButtonStyle = useConfiguratorStore(s => s.setButtonStyle)
  const cardStyle = useConfiguratorStore(s => s.cardStyle)
  const setCardStyle = useConfiguratorStore(s => s.setCardStyle)
  const gradientSettings = useConfiguratorStore(s => s.gradientSettings)
  const setGradientSettings = useConfiguratorStore(s => s.setGradientSettings)
  const logoScale = useConfiguratorStore(s => s.logoScale)
  const setLogoScale = useConfiguratorStore(s => s.setLogoScale)

  const [stylizeExpanded, setStylizeExpanded] = useState(false)
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
  const hasStylize = hasOverrides || borderRadiusOverride !== null || buttonStyle !== 'rounded' || cardStyle !== 'flat' || gradientSettings.type !== 'none'

  const handleLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setLogoUpload(file)
    if (logoInputRef.current) logoInputRef.current.value = ''
  }

  const logoUrl = logoUpload?.remoteUrl ?? logoUpload?.blobUrl

  // Group themes by category
  const themesByCategory = useMemo(() => {
    const groups: Record<string, ThemeDef[]> = {}
    for (const cat of THEME_CATEGORIES) {
      groups[cat.id] = themeList.filter(t => t.category === cat.id)
    }
    return groups
  }, [themeList])

  return (
    <div className="cfg-theme-cascade">
      {/* 1. Logo upload (top) */}
      <div style={{ marginBottom: 12 }}>
        <div className="cfg-layout-group__label">Logo</div>
        <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoFile} hidden />
        {logoUrl ? (
          <div className="cfg-logo-preview">
            <img src={logoUrl} alt="Logo" className="cfg-logo-preview__img" />
            <div className="cfg-typo-level" style={{ marginTop: 6 }}>
              <label className="cfg-typo-level__label">Logo Size</label>
              <div className="cfg-typo-weight-slider">
                <span className="cfg-typo-weight-slider__value">{logoScale}px</span>
                <input
                  type="range"
                  min="30"
                  max="300"
                  step="5"
                  value={logoScale}
                  onChange={e => setLogoScale(Number(e.target.value))}
                  className="cfg-vibe-slider cfg-vibe-slider--sm"
                />
                <div className="cfg-typo-weight-slider__labels">
                  <span>Small</span>
                  <span>Large</span>
                </div>
              </div>
            </div>
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

      {/* 2. Stylize Options (expandable) */}
      <div className={`cfg-typo-cat ${stylizeExpanded ? 'cfg-typo-cat--open' : ''}`} style={{ marginBottom: 8 }}>
        <button
          className={`cfg-typo-cat__header ${hasStylize ? 'cfg-typo-cat__header--set' : ''}`}
          onClick={() => setStylizeExpanded(!stylizeExpanded)}
        >
          <div className="cfg-typo-cat__info">
            <span className="cfg-typo-cat__name">Stylize Options</span>
            <span className="cfg-typo-cat__desc">Colors, corners, buttons & cards</span>
          </div>
          {hasStylize && (
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

        {stylizeExpanded && (
          <div className="cfg-typo-cat__body">
            {/* Colors */}
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

            {/* Border Radius slider */}
            <div className="cfg-typo-level" style={{ marginTop: 10 }}>
              <label className="cfg-typo-level__label">Corners</label>
              <div className="cfg-typo-weight-slider">
                <span className="cfg-typo-weight-slider__value">
                  {borderRadiusOverride ?? parseInt(activeTheme.borderRadius)}px
                </span>
                <input
                  type="range"
                  min="0"
                  max="24"
                  step="2"
                  value={borderRadiusOverride ?? parseInt(activeTheme.borderRadius)}
                  onChange={e => setBorderRadiusOverride(Number(e.target.value))}
                  className="cfg-vibe-slider cfg-vibe-slider--sm"
                />
                <div className="cfg-typo-weight-slider__labels">
                  <span>Square</span>
                  <span>Round</span>
                </div>
              </div>
            </div>

            {/* Button Style */}
            <div className="cfg-typo-level" style={{ marginTop: 8 }}>
              <label className="cfg-typo-level__label">Buttons</label>
              <div className="cfg-typo-level__chips">
                {BUTTON_STYLES.map(s => (
                  <button
                    key={s.id}
                    className={`cfg-typo-chip cfg-typo-chip--sm ${buttonStyle === s.id ? 'cfg-typo-chip--active' : ''}`}
                    onClick={() => setButtonStyle(s.id)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Card Style */}
            <div className="cfg-typo-level" style={{ marginTop: 8 }}>
              <label className="cfg-typo-level__label">Cards</label>
              <div className="cfg-typo-level__chips">
                {CARD_STYLES.map(s => (
                  <button
                    key={s.id}
                    className={`cfg-typo-chip cfg-typo-chip--sm ${cardStyle === s.id ? 'cfg-typo-chip--active' : ''}`}
                    onClick={() => setCardStyle(s.id)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Gradient */}
            <div className="cfg-typo-level" style={{ marginTop: 8 }}>
              <label className="cfg-typo-level__label">Gradient</label>
              <div className="cfg-typo-level__chips">
                {GRADIENT_TYPES.map(g => (
                  <button
                    key={g.id}
                    className={`cfg-typo-chip cfg-typo-chip--sm ${gradientSettings.type === g.id ? 'cfg-typo-chip--active' : ''}`}
                    onClick={() => setGradientSettings({ type: g.id })}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
              {gradientSettings.type !== 'none' && (
                <div className="cfg-typo-level__color-row" style={{ marginTop: 6 }}>
                  <input
                    type="color"
                    value={gradientSettings.colors[0]}
                    onChange={e => setGradientSettings({ colors: [e.target.value, gradientSettings.colors[1]] })}
                    className="cfg-typo-level__color-picker"
                  />
                  <input
                    type="color"
                    value={gradientSettings.colors[1]}
                    onChange={e => setGradientSettings({ colors: [gradientSettings.colors[0], e.target.value] })}
                    className="cfg-typo-level__color-picker"
                  />
                </div>
              )}
            </div>

            {hasOverrides && (
              <button className="cfg-colors-reset" style={{ marginTop: 8 }} onClick={clearColorOverrides}>
                Reset Colors
              </button>
            )}
          </div>
        )}
      </div>

      {/* 3. Theme list with categories */}
      <div className="cfg-theme-list cfg-theme-list--categorized">
        {THEME_CATEGORIES.map(cat => {
          const catThemes = themesByCategory[cat.id]
          if (!catThemes || catThemes.length === 0) return null
          return (
            <div key={cat.id}>
              <div className="cfg-theme-category-label">{cat.label}</div>
              {catThemes.map(theme => (
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
          )
        })}
      </div>
    </div>
  )
}
