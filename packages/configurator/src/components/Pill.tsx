import { useState, useEffect } from 'react'
import { useConfiguratorStore } from '../store/configuratorStore'
import { ct } from '../i18n/cfgStrings'

export function Pill() {
  const dockOpen = useConfiguratorStore(s => s.dockOpen)
  const toggleDock = useConfiguratorStore(s => s.toggleDock)
  const previewMode = useConfiguratorStore(s => s.previewMode)
  const togglePreviewMode = useConfiguratorStore(s => s.togglePreviewMode)
  const language = useConfiguratorStore(s => s.language)
  const saveStatus = useConfiguratorStore(s => s.saveStatus)
  const [showHint, setShowHint] = useState(false)

  // Show "tap to exit" hint after 1s of preview mode
  useEffect(() => {
    if (!previewMode) { setShowHint(false); return }
    const t = setTimeout(() => setShowHint(true), 1000)
    return () => clearTimeout(t)
  }, [previewMode])

  const handleClick = () => {
    if (previewMode) {
      togglePreviewMode()
    } else {
      toggleDock()
    }
  }

  return (
    <button
      className={`cfg-pill ${dockOpen ? 'cfg-pill--open' : ''} ${previewMode ? 'cfg-pill--preview' : ''}`}
      onClick={handleClick}
      aria-label={previewMode ? 'Exit preview' : dockOpen ? 'Close configurator' : 'Open configurator'}
      title={previewMode ? 'Exit Preview' : 'Configurator'}
    >
      <div className="cfg-pill__blob" />
      {previewMode && showHint && (
        <span className="cfg-pill__exit-hint">{ct(language, 'preview.exit')}</span>
      )}
      {dockOpen && !previewMode && saveStatus !== 'idle' && (
        <span className={`cfg-pill__save-dot cfg-pill__save-dot--${saveStatus}`} />
      )}
    </button>
  )
}
