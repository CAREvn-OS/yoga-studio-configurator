import { useConfiguratorStore } from '../store/configuratorStore'

export function StylePanel() {
  const styleMode = useConfiguratorStore(s => s.styleMode)
  const setStyleMode = useConfiguratorStore(s => s.setStyleMode)
  const elementStyles = useConfiguratorStore(s => s.elementStyles)
  const clearAllElementStyles = useConfiguratorStore(s => s.clearAllElementStyles)

  const styleCount = Object.keys(elementStyles).length

  return (
    <div className="cfg-style-panel">
      <button
        className={`cfg-toggle-btn ${styleMode ? 'cfg-toggle-btn--active' : ''}`}
        onClick={() => setStyleMode(!styleMode)}
      >
        {styleMode ? 'Exit Style Mode' : 'Enter Style Mode'}
      </button>

      <p className="cfg-copy-instructions" style={{ marginTop: 10 }}>
        {styleMode ? (
          <>Click <strong>any element</strong> — text, headings, sections — to adjust its <strong>color</strong>, create <strong>gradients</strong>, change <strong>weight</strong>, or add <strong>animations</strong>.</>
        ) : (
          <>Enable style mode to customize any element with colors, gradients, weights, and animations.</>
        )}
      </p>

      {styleCount > 0 && (
        <button
          className="cfg-colors-reset"
          style={{ marginTop: 12 }}
          onClick={clearAllElementStyles}
        >
          Reset All Styles ({styleCount})
        </button>
      )}
    </div>
  )
}
