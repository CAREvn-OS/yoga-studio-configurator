import { useConfiguratorStore } from '../store/configuratorStore'

const VIBE_PRESETS: { id: string; name: string; desc: string }[] = [
  { id: 'serene', name: 'Serene', desc: 'Soft fades, micro-shadows' },
  { id: 'breathe', name: 'Breathe', desc: 'Gentle living motion' },
  { id: 'spring', name: 'Spring', desc: 'Elastic, playful reveals' },
  { id: 'flow', name: 'Flow', desc: 'Fluid glide & rotation' },
  { id: 'snap', name: 'Snap', desc: 'Crisp, punchy entrances' },
]

export function VibePanel() {
  const vibe = useConfiguratorStore(s => s.vibe)
  const setVibe = useConfiguratorStore(s => s.setVibe)

  return (
    <div className="cfg-vibe-panel">
      <p className="cfg-copy-instructions" style={{ marginBottom: 12 }}>
        Choose a <strong>motion personality</strong> for your site.
      </p>

      {/* Live Preview Strip */}
      <div className="cfg-vibe-preview">
        <div className={`cfg-vibe-preview__scene vibe-${vibe.preset}`}>
          <div className="cfg-vibe-preview__card">
            <div className="cfg-vibe-preview__img" />
            <div className="cfg-vibe-preview__lines">
              <div className="cfg-vibe-preview__line cfg-vibe-preview__line--title" />
              <div className="cfg-vibe-preview__line" />
            </div>
          </div>
          <div className="cfg-vibe-preview__btn">Button</div>
          <div className="cfg-vibe-preview__circle" />
        </div>
      </div>

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
    </div>
  )
}
