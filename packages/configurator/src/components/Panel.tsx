import { useConfiguratorStore } from '../store/configuratorStore'
import { ThemePanel } from '../panels/ThemePanel'
import { CopyPanel } from '../panels/CopyPanel'
import { StylePanel } from '../panels/StylePanel'
import { LayoutPanel } from '../panels/LayoutPanel'
import { SectionsPanel } from '../panels/SectionsPanel'
import { EffectsPanel } from '../panels/EffectsPanel'
import { TypographyPanel } from '../panels/TypographyPanel'
import { SharePanel } from '../panels/SharePanel'

const PANEL_TITLES: Record<string, string> = {
  theme: 'Theme',
  copy: 'Copy',
  style: 'Style',
  layout: 'Layout',
  sections: 'Sections',
  effects: 'Effects',
  typography: 'Typography',
  share: 'Share',
}

function PanelContent({ panel }: { panel: string }) {
  switch (panel) {
    case 'theme':
      return <ThemePanel />
    case 'copy':
      return <CopyPanel />
    case 'style':
      return <StylePanel />
    case 'layout':
      return <LayoutPanel />
    case 'sections':
      return <SectionsPanel />
    case 'effects':
      return <EffectsPanel />
    case 'typography':
      return <TypographyPanel />
    case 'share':
      return <SharePanel />
    default:
      return null
  }
}

export function Panel() {
  const activePanel = useConfiguratorStore(s => s.activePanel)
  const closePanel = useConfiguratorStore(s => s.closePanel)

  return (
    <div className={`cfg-panel-wrapper ${activePanel ? 'cfg-panel-wrapper--open' : ''}`}>
      {activePanel && (
        <div className="cfg-panel">
          <div className="cfg-panel-header">
            <h3 className="cfg-panel-title">{PANEL_TITLES[activePanel] ?? activePanel}</h3>
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
