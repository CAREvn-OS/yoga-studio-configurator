import { useState } from 'react'
import { useConfiguratorStore } from '../store/configuratorStore'
import type { TypoCategory } from '@care/shared-types'

const CATEGORIES: { id: TypoCategory; label: string; desc: string }[] = [
  { id: 'headers', label: 'Headers', desc: 'Main section titles & hero text' },
  { id: 'subheaders', label: 'Subheaders', desc: 'Eyebrows & secondary titles' },
  { id: 'body', label: 'Body', desc: 'Paragraphs & descriptions' },
  { id: 'buttons', label: 'Buttons', desc: 'CTAs & interactive labels' },
  { id: 'captions', label: 'Captions', desc: 'Quotes, tags & fine print' },
]

const FONT_STYLES: { id: string; name: string; family: string }[] = [
  { id: 'serene', name: 'Serene', family: "'Cormorant Garamond', Georgia, serif" },
  { id: 'modern', name: 'Modern', family: "'Outfit', 'Inter', sans-serif" },
  { id: 'organic', name: 'Organic', family: "'Lora', 'Playfair Display', serif" },
  { id: 'minimal', name: 'Minimal', family: "'Jost', 'Nunito Sans', sans-serif" },
  { id: 'classic', name: 'Classic', family: "'Source Serif 4', 'Libre Baskerville', serif" },
  { id: 'bold', name: 'Bold', family: "'DM Sans', 'Montserrat', sans-serif" },
]

function getWeightLabel(w: number): string {
  if (w <= 150) return 'Hairline'
  if (w <= 250) return 'Thin'
  if (w <= 350) return 'Light'
  if (w <= 450) return 'Regular'
  if (w <= 550) return 'Medium'
  if (w <= 650) return 'Semi'
  if (w <= 750) return 'Bold'
  if (w <= 850) return 'Heavy'
  return 'Black'
}

export function TypographyPanel() {
  const typoCategorySettings = useConfiguratorStore(s => s.typoCategorySettings)
  const setTypoCategorySetting = useConfiguratorStore(s => s.setTypoCategorySetting)
  const clearAllTypoCategorySettings = useConfiguratorStore(s => s.clearAllTypoCategorySettings)

  const [expandedCategory, setExpandedCategory] = useState<TypoCategory | null>(null)

  const settingsCount = Object.keys(typoCategorySettings).filter(k => {
    const s = typoCategorySettings[k as TypoCategory]
    return s && (s.fontFamily || s.fontWeight || s.color || s.letterSpacing)
  }).length

  const toggleCategory = (cat: TypoCategory) => {
    setExpandedCategory(prev => prev === cat ? null : cat)
  }

  return (
    <div className="cfg-typo-cascade">
      <p className="cfg-copy-instructions" style={{ marginBottom: 10 }}>
        Choose a category to adjust <strong>font</strong>, <strong>color</strong>, <strong>weight</strong>, and <strong>spacing</strong>.
      </p>

      <div className="cfg-typo-cascade__list">
        {CATEGORIES.map(cat => {
          const isExpanded = expandedCategory === cat.id
          const settings = typoCategorySettings[cat.id]
          const hasSettings = settings && (settings.fontFamily || settings.fontWeight || settings.color || settings.letterSpacing)
          const selectedFont = FONT_STYLES.find(f => f.id === settings?.fontFamily)

          return (
            <div key={cat.id} className={`cfg-typo-cat ${isExpanded ? 'cfg-typo-cat--open' : ''}`}>
              <button
                className={`cfg-typo-cat__header ${hasSettings ? 'cfg-typo-cat__header--set' : ''}`}
                onClick={() => toggleCategory(cat.id)}
              >
                <div className="cfg-typo-cat__info">
                  <span className="cfg-typo-cat__name">{cat.label}</span>
                  <span className="cfg-typo-cat__desc">{cat.desc}</span>
                </div>
                {hasSettings && (
                  <span className="cfg-typo-cat__badge">
                    {selectedFont?.name ?? ''}
                    {settings?.fontWeight ? ` · ${settings.fontWeight}` : ''}
                  </span>
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

              {isExpanded && (
                <div className="cfg-typo-cat__body">
                  {/* Font + Color side by side */}
                  <div className="cfg-typo-font-color-row">
                    <div className="cfg-typo-font-color-row__fonts">
                      <label className="cfg-typo-level__label">Font</label>
                      <div className="cfg-typo-level__chips">
                        {FONT_STYLES.map(f => (
                          <button
                            key={f.id}
                            className={`cfg-typo-chip cfg-typo-chip--sm ${settings?.fontFamily === f.id ? 'cfg-typo-chip--active' : ''}`}
                            onClick={() => setTypoCategorySetting(cat.id, { fontFamily: f.id })}
                            style={{ fontFamily: f.family }}
                          >
                            {f.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="cfg-typo-font-color-row__color">
                      <label className="cfg-typo-level__label">Color</label>
                      <div className="cfg-typo-level__color-row">
                        <input
                          type="color"
                          value={settings?.color ?? '#1a1a1a'}
                          onChange={e => setTypoCategorySetting(cat.id, { color: e.target.value })}
                          className="cfg-typo-level__color-picker"
                        />
                        <span className="cfg-typo-level__color-hex">{settings?.color ?? 'inherit'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Weight slider */}
                  <div className="cfg-typo-level">
                    <label className="cfg-typo-level__label">Weight</label>
                    <div className="cfg-typo-weight-slider">
                      <span className="cfg-typo-weight-slider__value" style={{ fontWeight: settings?.fontWeight ?? 400 }}>
                        {getWeightLabel(settings?.fontWeight ?? 400)} · {settings?.fontWeight ?? 400}
                      </span>
                      <input
                        type="range"
                        min="100"
                        max="900"
                        step="100"
                        value={settings?.fontWeight ?? 400}
                        onChange={e => setTypoCategorySetting(cat.id, { fontWeight: Number(e.target.value) })}
                        className="cfg-vibe-slider"
                      />
                      <div className="cfg-typo-weight-slider__labels">
                        <span>Thin</span>
                        <span>Black</span>
                      </div>
                    </div>
                  </div>

                  {/* Letter spacing slider */}
                  <div className="cfg-typo-level">
                    <label className="cfg-typo-level__label">Spacing</label>
                    <div className="cfg-typo-weight-slider">
                      <span className="cfg-typo-weight-slider__value">
                        {settings?.letterSpacing ?? 0}%
                      </span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={settings?.letterSpacing ?? 0}
                        onChange={e => setTypoCategorySetting(cat.id, { letterSpacing: Number(e.target.value) })}
                        className="cfg-vibe-slider cfg-vibe-slider--sm"
                      />
                      <div className="cfg-typo-weight-slider__labels">
                        <span>Tight</span>
                        <span>Airy</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {settingsCount > 0 && (
        <button className="cfg-colors-reset" style={{ marginTop: 12 }} onClick={clearAllTypoCategorySettings}>
          Reset All Categories ({settingsCount})
        </button>
      )}
    </div>
  )
}
