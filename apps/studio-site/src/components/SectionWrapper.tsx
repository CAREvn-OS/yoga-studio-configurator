import { useConfiguratorStore } from '@care/configurator'

interface SectionWrapperProps {
  sectionId: string
  children: React.ReactNode
}

export function SectionWrapper({ sectionId, children }: SectionWrapperProps) {
  const dockOpen = useConfiguratorStore(s => s.dockOpen)
  const previewMode = useConfiguratorStore(s => s.previewMode)
  const activeSectionBlob = useConfiguratorStore(s => s.activeSectionBlob)
  const setActiveSectionBlob = useConfiguratorStore(s => s.setActiveSectionBlob)

  const showBlob = dockOpen && !previewMode
  const isActive = activeSectionBlob === sectionId

  return (
    <div data-section-id={sectionId} style={{ position: 'relative' }}>
      {children}
      {showBlob && (
        <button
          className={`cfg-mini-blob ${isActive ? 'cfg-mini-blob--active' : ''}`}
          onClick={() => setActiveSectionBlob(isActive ? null : sectionId)}
          aria-label={`Configure ${sectionId}`}
        >
          <div className="cfg-mini-blob__inner" />
        </button>
      )}
    </div>
  )
}
