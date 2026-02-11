import { useConfiguratorStore } from '../store/configuratorStore'

const VIBE_PRESETS: { id: string; name: string; desc: string }[] = [
  { id: 'zen', name: 'Zen', desc: 'Soft & calm' },
  { id: 'pulse', name: 'Pulse', desc: 'Breathe & grow' },
  { id: 'bloom', name: 'Bloom', desc: 'Open & unfold' },
  { id: 'drift', name: 'Drift', desc: 'Float & glide' },
  { id: 'spark', name: 'Spark', desc: 'Pop & bounce' },
  { id: 'wave', name: 'Wave', desc: 'Flow & ripple' },
]

function getIntensityLabel(value: number): string {
  if (value <= 20) return 'Whisper'
  if (value <= 40) return 'Gentle'
  if (value <= 60) return 'Balanced'
  if (value <= 80) return 'Expressive'
  return 'Wild'
}

export function VibePanel() {
  const vibe = useConfiguratorStore(s => s.vibe)
  const setVibe = useConfiguratorStore(s => s.setVibe)

  return (
    <div className="cfg-vibe-panel">
      <p className="cfg-copy-instructions" style={{ marginBottom: 12 }}>
        Choose a <strong>motion personality</strong> for your site. Slide right for more.
      </p>

      <div className="cfg-vibe-presets">
        {VIBE_PRESETS.map(preset => (
          <button
            key={preset.id}
            className={`cfg-vibe-preset ${vibe.preset === preset.id ? 'cfg-vibe-preset--active' : ''}`}
            onClick={() => setVibe({ preset: preset.id })}
          >
            <span className={`cfg-vibe-dot cfg-vibe-dot--${preset.id}`} />
            <div className="cfg-vibe-preset__info">
              <span className="cfg-vibe-preset__name">{preset.name}</span>
              <span className="cfg-vibe-preset__desc">{preset.desc}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="cfg-vibe-intensity">
        <div className="cfg-vibe-intensity__header">
          <label className="cfg-typo-level__label">Intensity</label>
          <span className="cfg-vibe-intensity__value">{getIntensityLabel(vibe.intensity)}</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={vibe.intensity}
          onChange={e => setVibe({ intensity: Number(e.target.value) })}
          className="cfg-vibe-slider"
        />
        <div className="cfg-vibe-intensity__labels">
          <span>Safe</span>
          <span>Experimental</span>
        </div>
      </div>
    </div>
  )
}
