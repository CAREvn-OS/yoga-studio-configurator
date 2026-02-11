import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useConfiguratorStore } from '@care/configurator'
import type { ImageDisplayStyle } from '@care/shared-types'

const DISPLAY_STYLES: { id: ImageDisplayStyle; label: string }[] = [
  { id: 'none', label: 'Default' },
  { id: 'gradient-fade', label: 'Fade' },
]

// Convert slider value (0.5–1.5) to CSS aspect-ratio fraction string
function sliderToAspect(val: number): string {
  // val=0.5 → wide 2/1, val=1.0 → square 1/1, val=1.5 → tall 2/3
  return `${(1 / val).toFixed(3)}`
}

// Convert CSS aspect-ratio string back to slider value
function aspectToSlider(aspect: string | undefined): number {
  if (!aspect || aspect === 'auto') return 0.56 // default ~16:9
  const parsed = parseFloat(aspect)
  if (!parsed || parsed <= 0) return 0.56
  return Math.min(1.5, Math.max(0.5, 1 / parsed))
}

function heightLabel(val: number): string {
  if (val <= 0.58) return 'Wide (16:9)'
  if (val <= 0.78) return '4:3'
  if (val <= 1.05) return 'Square'
  if (val <= 1.3) return '3:4'
  return 'Tall (2:3)'
}

// Parse objectPosition string "X% Y%" → { x, y }
function posToPercent(pos: string | undefined): { x: number; y: number } {
  if (!pos || pos === 'center') return { x: 50, y: 50 }
  if (pos === 'top') return { x: 50, y: 20 }
  if (pos === 'bottom') return { x: 50, y: 80 }
  if (pos === 'left') return { x: 20, y: 50 }
  if (pos === 'right') return { x: 80, y: 50 }
  const parts = pos.replace(/%/g, '').split(/\s+/)
  const x = parseInt(parts[0]) || 50
  const y = parseInt(parts[1] ?? '50') || 50
  return { x, y }
}

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
  const aspectRatio = settings?.aspectRatio
  const objectPosition = settings?.objectPosition

  useEffect(() => {
    if (!anchorEl) {
      setVisible(false)
      return
    }

    const rect = anchorEl.getBoundingClientRect()
    const popoverWidth = 220
    const popoverHeight = 320

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
  const heightVal = aspectToSlider(aspectRatio)
  const focus = posToPercent(objectPosition)

  return createPortal(
    <div
      ref={popoverRef}
      className={`cfg-media-popover ${visible ? 'cfg-media-popover--visible' : ''}`}
      style={{ top: position.top, left: position.left }}
      onClick={e => e.stopPropagation()}
      onMouseDown={e => e.stopPropagation()}
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

      {/* Style — discrete chips (inherently binary) */}
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

      {/* Height — continuous slider */}
      <div className="cfg-media-popover__section">
        <label className="cfg-typo-level__label">Height — {heightLabel(heightVal)}</label>
        <input
          type="range"
          min="0.5"
          max="1.5"
          step="0.05"
          value={heightVal}
          onChange={e => {
            const val = Number(e.target.value)
            setMediaSlotSetting(slotId, { aspectRatio: sliderToAspect(val) })
          }}
          className="cfg-vibe-slider cfg-vibe-slider--sm"
          style={{ width: '100%', marginTop: 4 }}
        />
        <div className="cfg-typo-weight-slider__labels">
          <span>Wide</span>
          <span>Tall</span>
        </div>
      </div>

      {/* Focus — two continuous sliders */}
      <div className="cfg-media-popover__section">
        <label className="cfg-typo-level__label">Focus</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div>
            <span className="cfg-media-popover__sublabel">Horizontal</span>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={focus.x}
              onChange={e => {
                setMediaSlotSetting(slotId, { objectPosition: `${e.target.value}% ${focus.y}%` })
              }}
              className="cfg-vibe-slider cfg-vibe-slider--sm"
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <span className="cfg-media-popover__sublabel">Vertical</span>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={focus.y}
              onChange={e => {
                setMediaSlotSetting(slotId, { objectPosition: `${focus.x}% ${e.target.value}%` })
              }}
              className="cfg-vibe-slider cfg-vibe-slider--sm"
              style={{ width: '100%' }}
            />
          </div>
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
