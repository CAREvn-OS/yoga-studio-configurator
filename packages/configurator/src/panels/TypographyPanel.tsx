import { themes } from '@care/theme-engine'
import { useConfiguratorStore } from '../store/configuratorStore'
import type { FontPairing } from '@care/shared-types'

export function TypographyPanel() {
  const currentThemeId = useConfiguratorStore(s => s.theme)
  const typographyOverride = useConfiguratorStore(s => s.typographyOverride)
  const setTypographyOverride = useConfiguratorStore(s => s.setTypographyOverride)

  const activeTheme = themes[currentThemeId] ?? Object.values(themes)[0]
  const options: FontPairing[] = activeTheme.typographyOptions ?? []

  const currentFontId = typographyOverride ?? activeTheme.fonts.id

  const handleSelect = (font: FontPairing) => {
    if (font.id === activeTheme.fonts.id) {
      setTypographyOverride(null)
    } else {
      setTypographyOverride(font.id)
    }
  }

  if (options.length === 0) {
    return (
      <p className="cfg-copy-instructions" style={{ margin: 0, color: 'var(--cfg-text-dim)' }}>
        No typography options available for this theme.
      </p>
    )
  }

  return (
    <div className="cfg-typo-list">
      {options.map(font => {
        const isActive = currentFontId === font.id
        return (
          <button
            key={font.id}
            className={`cfg-typo-card ${isActive ? 'cfg-typo-card--active' : ''}`}
            onClick={() => handleSelect(font)}
          >
            <div className="cfg-typo-card__display" style={{ fontFamily: font.display }}>
              Aa
            </div>
            <div className="cfg-typo-card__sample" style={{ fontFamily: font.body }}>
              Strength, balance and stillness in every breath.
            </div>
            <div className="cfg-typo-card__name">
              {font.name}
            </div>
          </button>
        )
      })}
    </div>
  )
}
