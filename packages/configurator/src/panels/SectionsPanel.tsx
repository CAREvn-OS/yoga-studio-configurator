import { useState, useRef, useCallback } from 'react'
import { useConfiguratorStore } from '../store/configuratorStore'
import { SECTION_ITEM_CONFIGS } from '@care/shared-types'

const SECTION_LABELS: Record<string, string> = {
  about: 'About',
  manifesto: 'Manifesto',
  schedule: 'Schedule',
  process: 'Your Journey',
  instructors: 'Instructors',
  pricing: 'Pricing',
  studioTour: 'Studio Tour',
  testimonials: 'Testimonials',
  events: 'Events',
  blog: 'Blog',
  partners: 'Partners',
  faq: 'FAQ',
  contact: 'Contact',
}

// Sections that can be toggled off
const OPTIONAL_SECTIONS = new Set([
  'manifesto', 'process', 'studioTour', 'events', 'blog', 'partners', 'faq',
])

export function SectionsPanel() {
  const sectionOrder = useConfiguratorStore(s => s.sectionOrder)
  const sections = useConfiguratorStore(s => s.sections)
  const sectionItems = useConfiguratorStore(s => s.sectionItems)
  const toggleSection = useConfiguratorStore(s => s.toggleSection)
  const moveSectionOrder = useConfiguratorStore(s => s.moveSectionOrder)
  const addSectionItem = useConfiguratorStore(s => s.addSectionItem)
  const removeSectionItem = useConfiguratorStore(s => s.removeSectionItem)

  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const dragCounter = useRef(0)

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDragIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(index))
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5'
    }
  }, [])

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1'
    }
    setDragIndex(null)
    setDragOverIndex(null)
    dragCounter.current = 0
  }, [])

  const handleDragEnter = useCallback((index: number) => {
    dragCounter.current++
    setDragOverIndex(index)
  }, [])

  const handleDragLeave = useCallback(() => {
    dragCounter.current--
    if (dragCounter.current <= 0) {
      setDragOverIndex(null)
      dragCounter.current = 0
    }
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent, toIndex: number) => {
      e.preventDefault()
      const fromIndex = dragIndex
      if (fromIndex !== null && fromIndex !== toIndex) {
        moveSectionOrder(fromIndex, toIndex)
      }
      setDragIndex(null)
      setDragOverIndex(null)
      dragCounter.current = 0
    },
    [dragIndex, moveSectionOrder]
  )

  return (
    <div className="cfg-sections-list">
      {sectionOrder.map((id, index) => {
        const isOptional = OPTIONAL_SECTIONS.has(id)
        const isOn = isOptional ? (sections[id] ?? true) : true
        const isDragging = dragIndex === index
        const isDragOver = dragOverIndex === index && dragIndex !== index
        const itemCfg = SECTION_ITEM_CONFIGS[id]
        const itemCount = itemCfg ? (sectionItems[id] ?? itemCfg.default) : null

        return (
          <div
            key={id}
            className={`cfg-section-row ${isDragging ? 'cfg-section-row--dragging' : ''} ${isDragOver ? 'cfg-section-row--dragover' : ''}`}
            draggable
            onDragStart={e => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragEnter={() => handleDragEnter(index)}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={e => handleDrop(e, index)}
          >
            <div className="cfg-section-row__top">
              <div className="cfg-section-row__left">
                <span className="cfg-section-row__grip" title="Drag to reorder">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
                    <circle cx="9" cy="6" r="1.5" />
                    <circle cx="15" cy="6" r="1.5" />
                    <circle cx="9" cy="12" r="1.5" />
                    <circle cx="15" cy="12" r="1.5" />
                    <circle cx="9" cy="18" r="1.5" />
                    <circle cx="15" cy="18" r="1.5" />
                  </svg>
                </span>
                <span className={`cfg-section-row__label ${!isOn ? 'cfg-section-row__label--off' : ''}`}>
                  {SECTION_LABELS[id] ?? id}
                </span>
              </div>
              {isOptional ? (
                <button
                  className={`cfg-toggle ${isOn ? 'cfg-toggle--on' : ''}`}
                  onClick={() => toggleSection(id)}
                  role="switch"
                  aria-checked={isOn}
                  aria-label={`Toggle ${SECTION_LABELS[id]}`}
                >
                  <span className="cfg-toggle__knob" />
                </button>
              ) : (
                <span className="cfg-section-row__always" title="Always visible">●</span>
              )}
            </div>
            {itemCfg && isOn && (
              <div className="cfg-section-row__items">
                <button
                  className="cfg-item-btn"
                  onClick={() => removeSectionItem(id)}
                  disabled={itemCount! <= itemCfg.min}
                  aria-label={`Remove ${itemCfg.label}`}
                >
                  <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2.5" fill="none">
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
                <span className="cfg-item-count">
                  {itemCount} {itemCount === 1 ? itemCfg.label : itemCfg.labelPlural}
                </span>
                <button
                  className="cfg-item-btn"
                  onClick={() => addSectionItem(id)}
                  disabled={itemCount! >= itemCfg.max}
                  aria-label={`Add ${itemCfg.label}`}
                >
                  <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2.5" fill="none">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
