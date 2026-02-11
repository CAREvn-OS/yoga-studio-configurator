import { useConfiguratorStore } from '../store/configuratorStore'

export function Pill() {
  const dockOpen = useConfiguratorStore(s => s.dockOpen)
  const toggleDock = useConfiguratorStore(s => s.toggleDock)

  return (
    <button
      className={`cfg-pill ${dockOpen ? 'cfg-pill--open' : ''}`}
      onClick={toggleDock}
      aria-label={dockOpen ? 'Close configurator' : 'Open configurator'}
      title="Configurator"
    >
      <div className="cfg-pill__blob" />
    </button>
  )
}
