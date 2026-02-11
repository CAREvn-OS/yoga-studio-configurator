import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { allCopy } from '@care/copy-content'
import { useConfiguratorStore } from '../store/configuratorStore'

export function CopyPopover() {
  const activeCopyElement = useConfiguratorStore(s => s.activeCopyElement)
  const copySelections = useConfiguratorStore(s => s.copySelections)
  const customCopy = useConfiguratorStore(s => s.customCopy)
  const setCopySelection = useConfiguratorStore(s => s.setCopySelection)
  const setCustomCopy = useConfiguratorStore(s => s.setCustomCopy)
  const clearCustomCopy = useConfiguratorStore(s => s.clearCustomCopy)
  const setActiveCopyElement = useConfiguratorStore(s => s.setActiveCopyElement)

  const [customText, setCustomText] = useState('')
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
  const [visible, setVisible] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  const elementId = activeCopyElement
  const alternatives = elementId ? allCopy[elementId] ?? [] : []
  const currentIndex = elementId ? (copySelections[elementId] ?? 0) : 0
  const hasCustom = elementId ? !!customCopy[elementId] : false

  // Position the popover near the active element
  useEffect(() => {
    if (!elementId) {
      setVisible(false)
      return
    }

    const el = document.querySelector(`[data-copy-id="${elementId}"]`) as HTMLElement | null
    if (!el) {
      setVisible(false)
      return
    }

    const rect = el.getBoundingClientRect()
    const popoverWidth = 280
    const popoverHeight = 340

    let top = rect.bottom + 8
    let left = rect.left + rect.width / 2 - popoverWidth / 2

    // Keep within viewport
    if (left < 12) left = 12
    if (left + popoverWidth > window.innerWidth - 12) left = window.innerWidth - popoverWidth - 12
    if (top + popoverHeight > window.innerHeight - 12) {
      top = rect.top - popoverHeight - 8
    }
    if (top < 12) top = 12

    setPosition({ top, left })
    setCustomText(customCopy[elementId] ?? '')

    // Small delay for entrance animation
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true))
    })
  }, [elementId, customCopy])

  // Close on outside click
  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (!popoverRef.current) return
      if (popoverRef.current.contains(e.target as Node)) return
      // Don't close if clicking on a copy target
      const target = e.target as HTMLElement
      if (target.closest('[data-copy-id]')) return
      setActiveCopyElement(null)
    },
    [setActiveCopyElement]
  )

  useEffect(() => {
    if (elementId) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [elementId, handleClickOutside])

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveCopyElement(null)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [setActiveCopyElement])

  if (!elementId || !position) return null

  const handleSelect = (index: number) => {
    setCopySelection(elementId, index)
  }

  const handleApplyCustom = () => {
    if (customText.trim()) {
      setCustomCopy(elementId, customText.trim())
    }
  }

  const handleClearCustom = () => {
    clearCustomCopy(elementId)
    setCustomText('')
  }

  const handleClose = () => {
    setActiveCopyElement(null)
  }

  return createPortal(
    <div
      ref={popoverRef}
      className={`cfg-copy-popover ${visible ? 'cfg-copy-popover--visible' : ''}`}
      style={{ top: position.top, left: position.left }}
    >
      <div className="cfg-copy-popover__header">
        <span className="cfg-copy-popover__title">Choose Copy</span>
        <button className="cfg-copy-popover__close" onClick={handleClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="cfg-copy-popover__options">
        {alternatives.map((text, i) => (
          <button
            key={i}
            className={`cfg-copy-option ${!hasCustom && currentIndex === i ? 'cfg-copy-option--active' : ''}`}
            onClick={() => handleSelect(i)}
          >
            {text}
          </button>
        ))}
      </div>

      <div className="cfg-copy-popover__custom">
        <span className="cfg-copy-popover__custom-label">Custom</span>
        <textarea
          className="cfg-copy-popover__textarea"
          value={customText}
          onChange={e => setCustomText(e.target.value)}
          placeholder="Type custom text..."
          rows={2}
        />
        <div className="cfg-copy-popover__actions">
          <button
            className="cfg-copy-popover__btn cfg-copy-popover__btn--apply"
            onClick={handleApplyCustom}
          >
            Apply
          </button>
          <button className="cfg-copy-popover__btn" onClick={handleClearCustom}>
            Clear
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
