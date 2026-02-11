import { useConfiguratorStore } from '../store/configuratorStore'

export function Toast() {
  const message = useConfiguratorStore(s => s.toastMessage)

  return (
    <div className={`cfg-toast ${message ? 'cfg-toast--visible' : ''}`}>
      {message}
    </div>
  )
}
