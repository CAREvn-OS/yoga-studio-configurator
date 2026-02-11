import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useConfiguratorStore } from '@care/configurator'
import type { ImageDisplayStyle } from '@care/shared-types'

const DISPLAY_STYLES: { id: ImageDisplayStyle; label: string }[] = [
  { id: 'none', label: 'Default' },
  { id: 'gradient-fade', label: 'Fade' },
]

const ASPECT_RATIOS: { id: string; label: string }[] = [
  { id: 'auto', label: 'Auto' },
  { id: '16/9', label: '16:9' },
  { id: '4/3', label: '4:3' },
  { id: '1/1', label: '1:1' },
  { id: '3/4', label: '3:4' },
]

const FOCUS_POSITIONS: { id: string; label: string }[] = [
  { id: 'center', label: 'Center' },
  { id: 'top', label: 'Top' },
  { id: 'bottom', label: 'Bottom' },
  { id: 'left', label: 'Left' },
  { id: 'right', label: 'Right' },
]

interface Props {
  slotId: string
  anchorEl: HTMLElement | null
  onClose: () => void
}

export function MediaSlotPopover({ slotId, anchorEl, onClose }: Props) {
  const setMediaSlotSetting = useConfiguratorStore(s => s.setMediaSlotSetting)
  const clearMediaSlotSetting = useConfiguratorStore(s => s.clearMediaSlotSetting)
  const settings = useConfiguratorStore(s => s.mediaSlotSettings[slotId])

  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
  const [visible, setVisible] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  const displayStyle = settings?.displayStyle ?? 'none'
  const aspectRatio = settings?.aspectRatio ?? 'auto'
  const objectPosition = settings?.objectPosition ?? 'center'

  useEffect(() => {
    if (!anchorEl) {
      setVisible(false)
      return
    }

    const rect = anchorEl.getBoundingClientRect()
    const popoverWidth = 220
    const popoverHeight = 260

    let top = rect.top
    let left = rect.right + 8

    if (left + popoverWidth > window.innerWidth - 12) {
      left = rect.left - popoverWidth - 8
    }
    if (left < 12) left = 12
    if (top + popoverHeight > window.innerHeight - 12) {
      top = window.innerHeight - popoverHeight - 12
    }
    if (top < 12) top = 12

    setPosition({ top, left })
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true))
    })
  }, [anchorEl])

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (!popoverRef.current) return
    if (popoverRef.current.contains(e.target as Node)) return
    onClose()
  }, [onClose])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [handleClickOutside])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  if (!position) return null

  const hasSettings = settings && (settings.displayStyle !== 'none' || settings.aspectRatio || settings.objectPosition)

  return createPortal(
    <div
      ref={popoverRef}
      className={`cfg-media-popover ${visible ? 'cfg-media-popover--visible' : ''}`}
      style={{ top: position.top, left: position.left }}
    >
      <div className="cfg-media-popover__header">
        <span className="cfg-media-popover__title">Image Settings</span>
        <button className="cfg-copy-popover__close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="cfg-media-popover__section">
        <label className="cfg-typo-level__label">Style</label>
        <div className="cfg-typo-level__chips">
          {DISPLAY_STYLES.map(s => (
            <button
              key={s.id}
              className={`cfg-typo-chip cfg-typo-chip--sm ${displayStyle === s.id ? 'cfg-typo-chip--active' : ''}`}
              onClick={() => setMediaSlotSetting(slotId, { displayStyle: s.id })}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="cfg-media-popover__section">
        <label className="cfg-typo-level__label">Height</label>
        <div className="cfg-typo-level__chips">
          {ASPECT_RATIOS.map(a => (
            <button
              key={a.id}
              className={`cfg-typo-chip cfg-typo-chip--sm ${aspectRatio === a.id ? 'cfg-typo-chip--active' : ''}`}
              onClick={() => setMediaSlotSetting(slotId, { aspectRatio: a.id === 'auto' ? undefined : a.id })}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      <div className="cfg-media-popover__section">
        <label className="cfg-typo-level__label">Focus</label>
        <div className="cfg-typo-level__chips">
          {FOCUS_POSITIONS.map(f => (
            <button
              key={f.id}
              className={`cfg-typo-chip cfg-typo-chip--sm ${objectPosition === f.id ? 'cfg-typo-chip--active' : ''}`}
              onClick={() => setMediaSlotSetting(slotId, { objectPosition: f.id === 'center' ? undefined : f.id })}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {hasSettings && (
        <button className="cfg-colors-reset" style={{ marginTop: 6 }} onClick={() => clearMediaSlotSetting(slotId)}>
          Reset
        </button>
      )}
    </div>,
    document.body
  )
}
