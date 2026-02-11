import { useState } from 'react'
import { useConfiguratorStore } from '../store/configuratorStore'
import type { TypoCategory } from '@care/shared-types'

// 5 text categories
const CATEGORIES: { id: TypoCategory; label: string; desc: string }[] = [
  { id: 'headers', label: 'Headers', desc: 'Main section titles & hero text' },
  { id: 'subheaders', label: 'Subheaders', desc: 'Eyebrows & secondary titles' },
  { id: 'body', label: 'Body', desc: 'Paragraphs & descriptions' },
  { id: 'buttons', label: 'Buttons', desc: 'CTAs & interactive labels' },
  { id: 'captions', label: 'Captions', desc: 'Quotes, tags & fine print' },
]

// Single-word names, no technical jargon. All fonts support full weight range (100-900).
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

const EFFECT_SLIDERS: { key: 'textShadow' | 'glow' | 'letterSpacing' | 'animation'; label: string; desc: string }[] = [
  { key: 'textShadow', label: 'Shadow', desc: 'Depth & dimension' },
  { key: 'glow', label: 'Glow', desc: 'Soft luminous halo' },
  { key: 'letterSpacing', label: 'Spacing', desc: 'Letter breathing room' },
  { key: 'animation', label: 'Motion', desc: 'Entrance & movement' },
]

export function TypographyPanel() {
  const typoCategorySettings = useConfiguratorStore(s => s.typoCategorySettings)
  const setTypoCategorySetting = useConfiguratorStore(s => s.setTypoCategorySetting)
  const clearAllTypoCategorySettings = useConfiguratorStore(s => s.clearAllTypoCategorySettings)

  const [expandedCategory, setExpandedCategory] = useState<TypoCategory | null>(null)

  const settingsCount = Object.keys(typoCategorySettings).filter(k => {
    const s = typoCategorySettings[k as TypoCategory]
    return s && (s.fontFamily || s.fontWeight || s.color || s.textShadow || s.glow || s.letterSpacing || s.animation)
  }).length

  const toggleCategory = (cat: TypoCategory) => {
    setExpandedCategory(prev => prev === cat ? null : cat)
  }

  return (
    <div className="cfg-typo-cascade">
      <p className="cfg-copy-instructions" style={{ marginBottom: 10 }}>
        Choose a category, then adjust <strong>font</strong>, <strong>weight</strong>, <strong>color</strong>, and <strong>effects</strong>. Each level reveals the next.
      </p>

      <div className="cfg-typo-cascade__list">
        {CATEGORIES.map(cat => {
          const isExpanded = expandedCategory === cat.id
          const settings = typoCategorySettings[cat.id]
          const hasSettings = settings && (settings.fontFamily || settings.fontWeight || settings.color || settings.textShadow || settings.glow || settings.letterSpacing || settings.animation)
          const selectedFont = FONT_STYLES.find(f => f.id === settings?.fontFamily)

          return (
            <div key={cat.id} className={`cfg-typo-cat ${isExpanded ? 'cfg-typo-cat--open' : ''}`}>
              {/* Category header */}
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

              {/* Expanded content - cascading levels */}
              {isExpanded && (
                <div className="cfg-typo-cat__body">
                  {/* Level 1: Font Family */}
                  <div className="cfg-typo-level">
                    <label className="cfg-typo-level__label">Font</label>
                    <div className="cfg-typo-level__chips">
                      {FONT_STYLES.map(f => (
                        <button
                          key={f.id}
                          className={`cfg-typo-chip ${settings?.fontFamily === f.id ? 'cfg-typo-chip--active' : ''}`}
                          onClick={() => setTypoCategorySetting(cat.id, { fontFamily: f.id })}
                          style={{ fontFamily: f.family }}
                        >
                          {f.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Level 2: Weight slider — appears after font selected */}
                  {settings?.fontFamily && (
                    <div className="cfg-typo-level cfg-typo-level--reveal">
                      <label className="cfg-typo-level__label">Weight</label>
                      <div className="cfg-typo-weight-slider">
                        <span className="cfg-typo-weight-slider__value" style={{ fontWeight: settings.fontWeight ?? 400 }}>
                          {getWeightLabel(settings.fontWeight ?? 400)} · {settings.fontWeight ?? 400}
                        </span>
                        <input
                          type="range"
                          min="100"
                          max="900"
                          step="100"
                          value={settings.fontWeight ?? 400}
                          onChange={e => setTypoCategorySetting(cat.id, { fontWeight: Number(e.target.value) })}
                          className="cfg-vibe-slider"
                        />
                        <div className="cfg-typo-weight-slider__labels">
                          <span>Thin</span>
                          <span>Black</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Level 3: Color — appears after weight selected */}
                  {settings?.fontFamily && settings?.fontWeight && (
                    <div className="cfg-typo-level cfg-typo-level--reveal">
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
                  )}

                  {/* Level 4: Effects — appears after color set */}
                  {settings?.fontFamily && settings?.fontWeight && (
                    <div className="cfg-typo-level cfg-typo-level--reveal">
                      <label className="cfg-typo-level__label">Effects</label>
                      <div className="cfg-typo-effects">
                        {EFFECT_SLIDERS.map(eff => (
                          <div key={eff.key} className="cfg-typo-effect-row">
                            <div className="cfg-typo-effect-row__info">
                              <span className="cfg-typo-effect-row__name">{eff.label}</span>
                              <span className="cfg-typo-effect-row__val">{settings?.[eff.key] ?? 0}%</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              step="5"
                              value={settings?.[eff.key] ?? 0}
                              onChange={e => setTypoCategorySetting(cat.id, { [eff.key]: Number(e.target.value) })}
                              className="cfg-vibe-slider cfg-vibe-slider--sm"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
