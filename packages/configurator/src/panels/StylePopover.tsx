import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useConfiguratorStore } from '../store/configuratorStore'

export function StylePopover() {
  const activeStyleElement = useConfiguratorStore(s => s.activeStyleElement)
  const elementStyles = useConfiguratorStore(s => s.elementStyles)
  const setActiveStyleElement = useConfiguratorStore(s => s.setActiveStyleElement)
  const setElementStyle = useConfiguratorStore(s => s.setElementStyle)
  const clearElementStyle = useConfiguratorStore(s => s.clearElementStyle)

  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
  const [visible, setVisible] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  const elementId = activeStyleElement
  const currentStyle = elementId ? (elementStyles[elementId] ?? {}) : {}

  // Position near the active element
  useEffect(() => {
    if (!elementId) {
      setVisible(false)
      return
    }
    const el = document.querySelector(`[data-style-id="${elementId}"]`) as HTMLElement | null
    if (!el) {
      setVisible(false)
      return
    }
    const rect = el.getBoundingClientRect()
    const popoverWidth = 240
    const popoverHeight = 220

    let top = rect.bottom + 8
    let left = rect.left + rect.width / 2 - popoverWidth / 2
    if (left < 12) left = 12
    if (left + popoverWidth > window.innerWidth - 12) left = window.innerWidth - popoverWidth - 12
    if (top + popoverHeight > window.innerHeight - 12) top = rect.top - popoverHeight - 8
    if (top < 12) top = 12

    setPosition({ top, left })
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true))
    })
  }, [elementId])

  // Close on outside click
  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (!popoverRef.current) return
      if (popoverRef.current.contains(e.target as Node)) return
      const target = e.target as HTMLElement
      if (target.closest('[data-style-id]')) return
      setActiveStyleElement(null)
    },
    [setActiveStyleElement]
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
      if (e.key === 'Escape') setActiveStyleElement(null)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [setActiveStyleElement])

  if (!elementId || !position) return null

  const handleColorChange = (color: string) => {
    setElementStyle(elementId, { ...currentStyle, color })
  }

  const handleWeightChange = (fontWeight: number) => {
    setElementStyle(elementId, { ...currentStyle, fontWeight })
  }

  const handleReset = () => {
    clearElementStyle(elementId)
  }

  const handleClose = () => {
    setActiveStyleElement(null)
  }

  return createPortal(
    <div
      ref={popoverRef}
      className={`cfg-style-popover ${visible ? 'cfg-style-popover--visible' : ''}`}
      style={{ top: position.top, left: position.left }}
    >
      <div className="cfg-copy-popover__header">
        <span className="cfg-copy-popover__title">Element Style</span>
        <button className="cfg-copy-popover__close" onClick={handleClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="cfg-style-popover__body">
        <div className="cfg-style-popover__field">
          <label className="cfg-style-popover__label">Color</label>
          <div className="cfg-color-input__wrapper">
            <input
              type="color"
              value={currentStyle.color ?? '#1a1a1a'}
              onChange={e => handleColorChange(e.target.value)}
            />
            <span className="cfg-color-input__hex">{currentStyle.color ?? 'inherit'}</span>
          </div>
        </div>

        <div className="cfg-style-popover__field">
          <label className="cfg-style-popover__label">
            Font Weight: <strong>{currentStyle.fontWeight ?? 'inherit'}</strong>
          </label>
          <input
            type="range"
            min={100}
            max={900}
            step={100}
            value={currentStyle.fontWeight ?? 400}
            onChange={e => handleWeightChange(Number(e.target.value))}
            className="cfg-style-popover__slider"
          />
          <div className="cfg-style-popover__slider-labels">
            <span>Thin</span>
            <span>Regular</span>
            <span>Bold</span>
            <span>Black</span>
          </div>
        </div>

        <button className="cfg-colors-reset" onClick={handleReset}>
          Reset Element
        </button>
      </div>
    </div>,
    document.body
  )
}
