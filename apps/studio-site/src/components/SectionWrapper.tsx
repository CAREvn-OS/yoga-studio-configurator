import { useRef, useMemo } from 'react'
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
  const wrapperRef = useRef<HTMLDivElement>(null)

  const showBlob = dockOpen && !previewMode
  const isActive = activeSectionBlob === sectionId

  // When active, slime the blob up to the top edge of this section (just above it)
  const blobStyle = useMemo<React.CSSProperties>(() => {
    if (!isActive) return {}
    // Animate to just above the section (-22px puts the blob at the boundary between sections)
    return { top: -22, left: 12 }
  }, [isActive])

  return (
    <div ref={wrapperRef} data-section-id={sectionId} style={{ position: 'relative' }}>
      {children}
      {showBlob && (
        <button
          className={`cfg-mini-blob ${isActive ? 'cfg-mini-blob--active' : ''}`}
          style={blobStyle}
          onClick={() => setActiveSectionBlob(isActive ? null : sectionId)}
          aria-label={`Configure ${sectionId}`}
        >
          <div className="cfg-mini-blob__inner" />
        </button>
      )}
    </div>
  )
}
