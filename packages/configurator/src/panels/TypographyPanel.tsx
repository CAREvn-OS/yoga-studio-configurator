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

// 6 font style families (style names, not font names) covering yoga/pilates range
const FONT_STYLES: { id: string; name: string; family: string }[] = [
  { id: 'serene-serif', name: 'Serene Serif', family: "'Cormorant Garamond', Georgia, serif" },
  { id: 'modern-clean', name: 'Modern Clean', family: "'Outfit', 'Inter', sans-serif" },
  { id: 'organic-flow', name: 'Organic Flow', family: "'Lora', 'Playfair Display', serif" },
  { id: 'minimal-sans', name: 'Minimal Sans', family: "'Jost', 'Nunito Sans', sans-serif" },
  { id: 'warm-humanist', name: 'Warm Humanist', family: "'Source Serif 4', 'Libre Baskerville', serif" },
  { id: 'bold-statement', name: 'Bold Statement', family: "'DM Sans', 'Montserrat', sans-serif" },
]

const WEIGHT_OPTIONS = [
  { value: 200, label: 'Thin' },
  { value: 300, label: 'Light' },
  { value: 400, label: 'Regular' },
  { value: 500, label: 'Medium' },
  { value: 600, label: 'Semi' },
  { value: 700, label: 'Bold' },
  { value: 800, label: 'Heavy' },
]

export function TypographyPanel() {
  const typoCategorySettings = useConfiguratorStore(s => s.typoCategorySettings)
  const setTypoCategorySetting = useConfiguratorStore(s => s.setTypoCategorySetting)
  const clearAllTypoCategorySettings = useConfiguratorStore(s => s.clearAllTypoCategorySettings)

  const [expandedCategory, setExpandedCategory] = useState<TypoCategory | null>(null)

  const settingsCount = Object.keys(typoCategorySettings).filter(k => {
    const s = typoCategorySettings[k as TypoCategory]
    return s && (s.fontFamily || s.fontWeight || s.color)
  }).length

  const toggleCategory = (cat: TypoCategory) => {
    setExpandedCategory(prev => prev === cat ? null : cat)
  }

  return (
    <div className="cfg-typo-cascade">
      <p className="cfg-copy-instructions" style={{ marginBottom: 10 }}>
        Choose a category, then select <strong>font</strong>, <strong>weight</strong>, and <strong>color</strong>. Each selection reveals the next level.
      </p>

      <div className="cfg-typo-cascade__list">
        {CATEGORIES.map(cat => {
          const isExpanded = expandedCategory === cat.id
          const settings = typoCategorySettings[cat.id]
          const hasSettings = settings && (settings.fontFamily || settings.fontWeight || settings.color)
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
                    <label className="cfg-typo-level__label">Font Style</label>
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

                  {/* Level 2: Weight — appears after font selected */}
                  {settings?.fontFamily && (
                    <div className="cfg-typo-level cfg-typo-level--reveal">
                      <label className="cfg-typo-level__label">Weight</label>
                      <div className="cfg-typo-level__chips">
                        {WEIGHT_OPTIONS.map(w => (
                          <button
                            key={w.value}
                            className={`cfg-typo-chip cfg-typo-chip--sm ${settings?.fontWeight === w.value ? 'cfg-typo-chip--active' : ''}`}
                            onClick={() => setTypoCategorySetting(cat.id, { fontWeight: w.value })}
                          >
                            {w.label}
                          </button>
                        ))}
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
