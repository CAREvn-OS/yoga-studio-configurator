import { useConfiguratorStore } from '../store/configuratorStore'
import { ct } from '../i18n/cfgStrings'

/* ── 6 vibes: Normal (default) + 5 animated ── */
const VIBE_PRESETS: { id: string; labelKey: string; colorA: string; colorB: string }[] = [
  { id: 'normal', labelKey: 'vibe.normal', colorA: '#b0aab8', colorB: '#8a8490' },
  { id: 'serene', labelKey: 'vibe.serene', colorA: '#c8d5b9', colorB: '#8faa7e' },
  { id: 'breathe', labelKey: 'vibe.breathe', colorA: '#e8a0a0', colorB: '#c06070' },
  { id: 'spring', labelKey: 'vibe.spring', colorA: '#f0c0c8', colorB: '#d08090' },
  { id: 'flow', labelKey: 'vibe.flow', colorA: '#a0c8d8', colorB: '#6098b0' },
  { id: 'snap', labelKey: 'vibe.snap', colorA: '#e8d0a0', colorB: '#c8a050' },
]

export function VibeStrip() {
  const vibe = useConfiguratorStore(s => s.vibe)
  const setVibe = useConfiguratorStore(s => s.setVibe)
  const language = useConfiguratorStore(s => s.language)

  return (
    <div className="cfg-vibe-strip">
      {VIBE_PRESETS.map(preset => (
        <button
          key={preset.id}
          className={`cfg-vibe-blob cfg-vibe-blob--${preset.id} ${vibe.preset === preset.id ? 'cfg-vibe-blob--active' : ''}`}
          onClick={() => setVibe({ preset: preset.id })}
          title={ct(language, preset.labelKey)}
          style={{
            background: `radial-gradient(circle at 40% 35%, ${preset.colorA}, ${preset.colorB})`,
          }}
        />
      ))}
    </div>
  )
}
