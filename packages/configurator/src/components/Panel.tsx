import { useConfiguratorStore } from '../store/configuratorStore'
import { ThemePanel } from '../panels/ThemePanel'
import { CopyPanel } from '../panels/CopyPanel'
import { VibePanel } from '../panels/VibePanel'
import { TypographyPanel } from '../panels/TypographyPanel'
import { SettingsPanel } from '../panels/SettingsPanel'

const PANEL_TITLES: Record<string, Record<string, string>> = {
  theme: { vi: 'Giao diện', en: 'Theme' },
  copy: { vi: 'Nội dung', en: 'Copy' },
  vibe: { vi: 'Phong cách', en: 'Vibe' },
  typography: { vi: 'Kiểu chữ', en: 'Typography' },
  settings: { vi: 'Cài đặt', en: 'Settings' },
}

function PanelContent({ panel }: { panel: string }) {
  switch (panel) {
    case 'theme':
      return <ThemePanel />
    case 'copy':
      return <CopyPanel />
    case 'vibe':
      return <VibePanel />
    case 'typography':
      return <TypographyPanel />
    case 'settings':
      return <SettingsPanel />
    default:
      return null
  }
}

export function Panel() {
  const activePanel = useConfiguratorStore(s => s.activePanel)
  const closePanel = useConfiguratorStore(s => s.closePanel)
  const language = useConfiguratorStore(s => s.language)

  return (
    <div className={`cfg-panel-wrapper ${activePanel ? 'cfg-panel-wrapper--open' : ''}`}>
      {activePanel && (
        <div className="cfg-panel">
          <div className="cfg-panel-header">
            <h3 className="cfg-panel-title">{PANEL_TITLES[activePanel]?.[language] ?? activePanel}</h3>
            <button className="cfg-panel-close" onClick={closePanel} aria-label="Close panel">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
          <div className="cfg-panel-body">
            <PanelContent panel={activePanel} />
          </div>
        </div>
      )}
    </div>
  )
}
