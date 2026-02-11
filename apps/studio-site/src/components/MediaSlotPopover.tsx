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
  return `${(1 / val).toFixed(3)}`
}

// Convert CSS aspect-ratio string back to slider value
function aspectToSlider(aspect: string | undefined): number {
  if (!aspect || aspect === 'auto') return 0.56
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

// ---- Focus Pad (Joystick) ----
function FocusPad({
  x, y, onChange,
}: {
  x: number
  y: number
  onChange: (x: number, y: number) => void
}) {
  const padRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  const updateFromEvent = useCallback((clientX: number, clientY: number) => {
    const pad = padRef.current
    if (!pad) return
    const rect = pad.getBoundingClientRect()
    const nx = Math.round(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)))
    const ny = Math.round(Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100)))
    onChange(nx, ny)
  }, [onChange])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault()
    dragging.current = true
    const pad = padRef.current
    if (pad) pad.setPointerCapture(e.pointerId)
    updateFromEvent(e.clientX, e.clientY)
  }, [updateFromEvent])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return
    updateFromEvent(e.clientX, e.clientY)
  }, [updateFromEvent])

  const onPointerUp = useCallback(() => {
    dragging.current = false
  }, [])

  return (
    <div
      ref={padRef}
      className="cfg-focus-pad"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div className="cfg-focus-pad__crosshair cfg-focus-pad__crosshair--h" />
      <div className="cfg-focus-pad__crosshair cfg-focus-pad__crosshair--v" />
      <div
        className="cfg-focus-pad__dot"
        style={{ left: `${x}%`, top: `${y}%` }}
      />
    </div>
  )
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
  const media = useConfiguratorStore(s => s.mediaUploads[slotId])

  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
  const [visible, setVisible] = useState(false)
  const [optimizing, setOptimizing] = useState(false)
  const [optimized, setOptimized] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  const displayStyle = settings?.displayStyle ?? 'none'
  const aspectRatio = settings?.aspectRatio
  const objectPosition = settings?.objectPosition
  const imageScale = settings?.imageScale ?? 1

  useEffect(() => {
    if (!anchorEl) {
      setVisible(false)
      return
    }

    const rect = anchorEl.getBoundingClientRect()
    const popoverWidth = 220
    const popoverHeight = 420

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

  // Check if already optimized
  useEffect(() => {
    if (media?.responsiveUrls) setOptimized(true)
    else setOptimized(false)
  }, [media?.responsiveUrls])

  if (!position) return null

  const hasSettings = settings && (
    settings.displayStyle !== 'none' ||
    settings.aspectRatio ||
    settings.objectPosition ||
    (settings.imageScale && settings.imageScale !== 1)
  )
  const heightVal = aspectToSlider(aspectRatio)
  const focus = posToPercent(objectPosition)
  const zoomPercent = Math.round(imageScale * 100)

  const handleOptimize = async () => {
    if (!media || optimizing || optimized) return
    setOptimizing(true)
    try {
      const { processImage, uploadBlob } = await import('@care/media-storage')
      // Fetch the image as blob
      const response = await fetch(media.blobUrl)
      const blob = await response.blob()
      // Process into 3 responsive WebP sizes
      const variants = await processImage(blob)
      // Upload each variant
      const [mobileResult, tabletResult, desktopResult] = await Promise.all([
        uploadBlob(variants.mobile, `uploads/${slotId}_mobile.webp`),
        uploadBlob(variants.tablet, `uploads/${slotId}_tablet.webp`),
        uploadBlob(variants.desktop, `uploads/${slotId}_desktop.webp`),
      ])
      // Store responsive URLs
      if (mobileResult && tabletResult && desktopResult) {
        const store = useConfiguratorStore.getState()
        store.setMediaUploadResponsiveUrls(slotId, {
          mobile: mobileResult.url,
          tablet: tabletResult.url,
          desktop: desktopResult.url,
        })
        setOptimized(true)
      }
    } catch (err) {
      console.warn('[MediaSlotPopover] Optimize failed:', err)
    } finally {
      setOptimizing(false)
    }
  }

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

      {/* Style — discrete chips */}
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

      {/* Focus — joystick pad */}
      <div className="cfg-media-popover__section">
        <label className="cfg-typo-level__label">Focus</label>
        <FocusPad
          x={focus.x}
          y={focus.y}
          onChange={(nx, ny) => {
            setMediaSlotSetting(slotId, { objectPosition: `${nx}% ${ny}%` })
          }}
        />
      </div>

      {/* Zoom — continuous slider */}
      <div className="cfg-media-popover__section">
        <label className="cfg-typo-level__label">Zoom — {zoomPercent}%</label>
        <input
          type="range"
          min="1"
          max="2"
          step="0.05"
          value={imageScale}
          onChange={e => {
            setMediaSlotSetting(slotId, { imageScale: Number(e.target.value) })
          }}
          className="cfg-vibe-slider cfg-vibe-slider--sm"
          style={{ width: '100%', marginTop: 4 }}
        />
        <div className="cfg-typo-weight-slider__labels">
          <span>100%</span>
          <span>200%</span>
        </div>
      </div>

      {/* Optimize for Web */}
      {media && (
        <div className="cfg-media-popover__section">
          <button
            className={`cfg-share-btn cfg-share-btn--full ${optimized ? 'cfg-share-btn--success' : ''}`}
            onClick={handleOptimize}
            disabled={optimizing || optimized}
          >
            {optimizing ? (
              <>
                <svg className="cfg-spinner" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Processing...
              </>
            ) : optimized ? (
              <>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Optimized (3 sizes)
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Optimize for Web
              </>
            )}
          </button>
        </div>
      )}

      {hasSettings && (
        <button className="cfg-colors-reset" style={{ marginTop: 6 }} onClick={() => clearMediaSlotSetting(slotId)}>
          Reset
        </button>
      )}
    </div>,
    document.body
  )
}
