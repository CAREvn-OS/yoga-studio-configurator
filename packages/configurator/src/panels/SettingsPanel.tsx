import { useConfiguratorStore } from '../store/configuratorStore'
import type { Language } from '@care/shared-types'

export function SettingsPanel() {
  const language = useConfiguratorStore(s => s.language)
  const setLanguage = useConfiguratorStore(s => s.setLanguage)
  const previewMode = useConfiguratorStore(s => s.previewMode)
  const togglePreviewMode = useConfiguratorStore(s => s.togglePreviewMode)
  const exportConfig = useConfiguratorStore(s => s.exportConfig)
  const showToast = useConfiguratorStore(s => s.showToast)

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

  return (
    <div className="cfg-settings-panel">
      {/* Language Toggle */}
      <div className="cfg-settings-group">
        <div className="cfg-settings-label">
          {language === 'vi' ? 'Ngôn ngữ' : 'Language'}
        </div>
        <div className="cfg-lang-toggle">
          <button
            className={`cfg-lang-btn ${language === 'vi' ? 'cfg-lang-btn--active' : ''}`}
            onClick={() => setLanguage('vi' as Language)}
          >
            <span className="cfg-lang-flag">🇻🇳</span>
            VI
          </button>
          <button
            className={`cfg-lang-btn ${language === 'en' ? 'cfg-lang-btn--active' : ''}`}
            onClick={() => setLanguage('en' as Language)}
          >
            <span className="cfg-lang-flag">🇬🇧</span>
            EN
          </button>
        </div>
      </div>

      {/* Preview Mode */}
      <div className="cfg-settings-group">
        <div className="cfg-settings-label">
          {language === 'vi' ? 'Xem trước' : 'Preview'}
        </div>
        <button
          className={`cfg-settings-action-btn ${previewMode ? 'cfg-settings-action-btn--active' : ''}`}
          onClick={togglePreviewMode}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          {previewMode
            ? (language === 'vi' ? 'Thoát xem trước' : 'Exit Preview')
            : (language === 'vi' ? 'Xem trước trang' : 'Preview Site')}
        </button>
      </div>

      {/* Export Config */}
      <div className="cfg-settings-group">
        <div className="cfg-settings-label">
          {language === 'vi' ? 'Xuất cấu hình' : 'Export'}
        </div>
        <p className="cfg-settings-desc">
          {language === 'vi'
            ? 'Sao chép cấu hình dưới dạng JSON để chia sẻ với nhà phát triển.'
            : 'Export your configuration as JSON. Share it with your developer.'}
        </p>
        <button className="cfg-share-btn" onClick={handleCopy}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          {language === 'vi' ? 'Sao chép cấu hình' : 'Copy Configuration'}
        </button>
      </div>
    </div>
  )
}
