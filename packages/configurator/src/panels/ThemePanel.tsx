import { useState, useMemo } from 'react'
import { themes, applyTheme } from '@care/theme-engine'
import { useConfiguratorStore } from '../store/configuratorStore'
import type { ThemeDef } from '@care/shared-types'

const EDITABLE_LABELS: Record<string, string> = {
  primary: 'Primary',
  secondary: 'Secondary',
  tertiary: 'Tertiary',
  accent: 'Accent',
}

export function ThemePanel() {
  const currentTheme = useConfiguratorStore(s => s.theme)
  const colorOverrides = useConfiguratorStore(s => s.colorOverrides)
  const setTheme = useConfiguratorStore(s => s.setTheme)
  const setColorOverride = useConfiguratorStore(s => s.setColorOverride)
  const clearColorOverrides = useConfiguratorStore(s => s.clearColorOverrides)

  const [colorsOpen, setColorsOpen] = useState(false)

  const themeList = useMemo(() => Object.values(themes), [])

  const handleThemeClick = (theme: ThemeDef) => {
    setTheme(theme.id)
    applyTheme(theme.id)
  }

  const activeTheme = themes[currentTheme] ?? themeList[0]

  const getColorValue = (role: string): string => {
    const colorKey = activeTheme.editableColors[role as keyof typeof activeTheme.editableColors]
    if (colorOverrides && colorKey && (colorOverrides as Record<string, string>)[colorKey]) {
      return (colorOverrides as Record<string, string>)[colorKey]
    }
    return (activeTheme.colors as Record<string, string>)[colorKey] ?? '#000000'
  }

  const handleColorChange = (role: string, value: string) => {
    const colorKey = activeTheme.editableColors[role as keyof typeof activeTheme.editableColors]
    if (colorKey) {
      setColorOverride(colorKey, value)
    }
  }

  return (
    <>
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

      <button
        className={`cfg-colors-toggle ${colorsOpen ? 'cfg-colors-toggle--open' : ''}`}
        onClick={() => setColorsOpen(!colorsOpen)}
      >
        <span>Customize Colors</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {colorsOpen && (
        <>
          <div className="cfg-colors-grid">
            {Object.keys(EDITABLE_LABELS).map(role => {
              const value = getColorValue(role)
              return (
                <div key={role} className="cfg-color-input">
                  <span className="cfg-color-input__label">{EDITABLE_LABELS[role]}</span>
                  <div className="cfg-color-input__wrapper">
                    <input
                      type="color"
                      value={value}
                      onChange={e => handleColorChange(role, e.target.value)}
                    />
                    <span className="cfg-color-input__hex">{value}</span>
                  </div>
                </div>
              )
            })}
          </div>
          {colorOverrides && (
            <button className="cfg-colors-reset" onClick={clearColorOverrides}>
              Reset to Theme Defaults
            </button>
          )}
        </>
      )}
    </>
  )
}
