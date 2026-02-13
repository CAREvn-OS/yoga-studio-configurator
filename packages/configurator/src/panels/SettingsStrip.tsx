import { useConfiguratorStore } from '../store/configuratorStore'
import { ct } from '../i18n/cfgStrings'
import type { Language } from '@care/shared-types'

export function SettingsStrip() {
  const language = useConfiguratorStore(s => s.language)
  const setLanguage = useConfiguratorStore(s => s.setLanguage)
  const previewMode = useConfiguratorStore(s => s.previewMode)
  const togglePreviewMode = useConfiguratorStore(s => s.togglePreviewMode)
  const exportConfig = useConfiguratorStore(s => s.exportConfig)
  const showToast = useConfiguratorStore(s => s.showToast)
  const restartTutorial = useConfiguratorStore(s => s.restartTutorial)

  const handleCopy = async () => {
    const json = exportConfig()
    try {
      await navigator.clipboard.writeText(json)
      showToast(language === 'vi' ? 'Đã sao chép cấu hình!' : 'Configuration copied!')
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = json
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      showToast(language === 'vi' ? 'Đã sao chép cấu hình!' : 'Configuration copied!')
    }
  }

  const nextLang = language === 'vi' ? 'en' : 'vi'

  return (
    <div className="cfg-settings-strip">
      {/* Language toggle */}
      <button
        className="cfg-settings-strip__btn"
        onClick={() => setLanguage(nextLang as Language)}
        title={ct(language, 'settings.language')}
      >
        <span className="cfg-settings-strip__flag">{language === 'vi' ? '🇻🇳' : '🇬🇧'}</span>
      </button>

      {/* Preview toggle */}
      <button
        className={`cfg-settings-strip__btn ${previewMode ? 'cfg-settings-strip__btn--active' : ''}`}
        onClick={togglePreviewMode}
        title={ct(language, 'settings.preview')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
        </svg>
      </button>

      {/* Export config */}
      <button
        className="cfg-settings-strip__btn"
        onClick={handleCopy}
        title={ct(language, 'settings.export')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      </button>

      {/* Restart tutorial */}
      <button
        className="cfg-settings-strip__btn"
        onClick={restartTutorial}
        title={ct(language, 'settings.help')}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><text x="12" y="17" textAnchor="middle" fontSize="14" fontWeight="500" fill="currentColor" stroke="none">?</text>
        </svg>
      </button>
    </div>
  )
}
