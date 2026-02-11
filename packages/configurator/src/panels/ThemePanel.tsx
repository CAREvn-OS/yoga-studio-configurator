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

  const [colorsExpanded, setColorsExpanded] = useState(false)

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

  const hasOverrides = colorOverrides && Object.keys(colorOverrides).length > 0

  return (
    <div className="cfg-theme-cascade">
      {/* Level 1: Theme selection */}
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

      {/* Level 2: Inline color customization (cascading, like typography) */}
      <div className={`cfg-typo-cat ${colorsExpanded ? 'cfg-typo-cat--open' : ''}`} style={{ marginTop: 8 }}>
        <button
          className={`cfg-typo-cat__header ${hasOverrides ? 'cfg-typo-cat__header--set' : ''}`}
          onClick={() => setColorsExpanded(!colorsExpanded)}
        >
          <div className="cfg-typo-cat__info">
            <span className="cfg-typo-cat__name">Customize Colors</span>
            <span className="cfg-typo-cat__desc">Fine-tune the palette for this theme</span>
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
              {Object.keys(EDITABLE_LABELS).map(role => {
                const value = getColorValue(role)
                return (
                  <div key={role} className="cfg-theme-color-row">
                    <span className="cfg-theme-color-row__label">{EDITABLE_LABELS[role]}</span>
                    <div className="cfg-theme-color-row__controls">
                      <input
                        type="color"
                        value={value}
                        onChange={e => handleColorChange(role, e.target.value)}
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
    </div>
  )
}
