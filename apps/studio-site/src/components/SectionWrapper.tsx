import { useRef, useMemo, useCallback } from 'react'
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
  const autoPreview = useConfiguratorStore(s => s.autoPreview)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const showBlob = dockOpen && !previewMode && !autoPreview
  const isActive = activeSectionBlob === sectionId

  // When active, slime the blob up to the top edge of this section (just above it)
  const blobStyle = useMemo<React.CSSProperties>(() => {
    if (!isActive) return {}
    return { top: -22, left: 12 }
  }, [isActive])

  const handleBlobClick = useCallback(() => {
    if (isActive) {
      setActiveSectionBlob(null)
      return
    }

    // Activate this section blob (store handles mutual exclusivity with dock)
    setActiveSectionBlob(sectionId)

    // Scroll section into optimal position
    if (sectionId === 'hero') {
      // Hero: scroll to top, the hero-shifted class adds room for row menu
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (wrapperRef.current) {
      // Other sections: scroll so blob sits ~60px from viewport top
      const rect = wrapperRef.current.getBoundingClientRect()
      const scrollTarget = window.scrollY + rect.top - 60
      window.scrollTo({ top: Math.max(0, scrollTarget), behavior: 'smooth' })
    }
  }, [isActive, sectionId, setActiveSectionBlob])

  return (
    <div ref={wrapperRef} data-section-id={sectionId} style={{ position: 'relative' }}>
      {children}
      {showBlob && (
        <button
          className={`cfg-mini-blob ${isActive ? 'cfg-mini-blob--active' : ''}`}
          style={blobStyle}
          onClick={handleBlobClick}
          aria-label={`Configure ${sectionId}`}
        >
          <div className="cfg-mini-blob__inner" />
        </button>
      )}
    </div>
  )
}
