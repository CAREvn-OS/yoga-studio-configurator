import { useConfiguratorStore } from '../store/configuratorStore'

export function Toast() {
  const message = useConfiguratorStore(s => s.toastMessage)
  const dismissToast = useConfiguratorStore(s => s.dismissToast)

  return (
    <div
      className={`cfg-toast ${message ? 'cfg-toast--visible' : ''}`}
      role="alert"
      aria-live="polite"
      onClick={dismissToast}
    >
      {message}
    </div>
  )
}
