import { useConfiguratorStore } from '../store/configuratorStore'

export function SharePanel() {
  const exportConfig = useConfiguratorStore(s => s.exportConfig)
  const showToast = useConfiguratorStore(s => s.showToast)

  const handleCopy = async () => {
    const json = exportConfig()
    try {
      await navigator.clipboard.writeText(json)
      showToast('Configuration copied!')
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = json
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      showToast('Configuration copied!')
    }
  }

  return (
    <div className="cfg-share-panel">
      <p className="cfg-share-panel__desc">
        Export your current configuration as JSON. Share it with your developer or paste it into your project to apply these settings.
      </p>
      <button className="cfg-share-btn" onClick={handleCopy}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        Copy Configuration
      </button>
    </div>
  )
}
