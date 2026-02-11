import { useConfiguratorStore } from '../store/configuratorStore'

interface EffectOption {
  id: string
  name: string
}

const EFFECTS: EffectOption[] = [
  { id: 'smooth-rise', name: 'Smooth Rise' },
  { id: 'gentle-fade', name: 'Gentle Fade' },
  { id: 'grand-entrance', name: 'Grand Entrance' },
  { id: 'slide-in', name: 'Slide In' },
  { id: 'none', name: 'No Animation' },
]

export function EffectsPanel() {
  const effect = useConfiguratorStore(s => s.effect)
  const setEffect = useConfiguratorStore(s => s.setEffect)

  return (
    <div className="cfg-effects-list">
      {EFFECTS.map(fx => {
        const isActive = effect === fx.id
        return (
          <button
            key={fx.id}
            className={`cfg-effect-option ${isActive ? 'cfg-effect-option--active' : ''}`}
            onClick={() => setEffect(fx.id)}
          >
            <span className="cfg-effect-radio">
              <span className="cfg-effect-radio__dot" />
            </span>
            {fx.name}
          </button>
        )
      })}
    </div>
  )
}
