import { useConfiguratorStore } from '../store/configuratorStore'

export function Pill() {
  const dockOpen = useConfiguratorStore(s => s.dockOpen)
  const toggleDock = useConfiguratorStore(s => s.toggleDock)
  const previewMode = useConfiguratorStore(s => s.previewMode)
  const togglePreviewMode = useConfiguratorStore(s => s.togglePreviewMode)

  const handleClick = () => {
    if (previewMode) {
      togglePreviewMode() // exit preview
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
    </button>
  )
}
