import { useRef, useState } from 'react'
import { useConfiguratorStore } from '@care/configurator'
import { MediaSlotPopover } from './MediaSlotPopover'

interface MediaSlotProps {
  slotId: string
  type?: 'image' | 'video'
  aspectRatio?: string
  className?: string
  children?: React.ReactNode
}

function deriveAlt(slotId: string, fileName: string): string {
  if (slotId.startsWith('hero-bg')) return 'Studio hero image'
  if (slotId.startsWith('instructor')) return 'Instructor photo'
  if (slotId.startsWith('testimonial')) return 'Client photo'
  if (slotId.startsWith('schedule')) return 'Class image'
  if (slotId.startsWith('event')) return 'Event image'
  if (slotId.startsWith('blog')) return 'Article image'
  if (slotId.startsWith('partner')) return 'Partner logo'
  if (slotId.startsWith('studioTour')) return 'Studio space photo'
  // Fallback: clean filename
  return fileName.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
}

export function MediaSlot({ slotId, type = 'image', aspectRatio, className, children }: MediaSlotProps) {
  const media = useConfiguratorStore(s => s.mediaUploads[slotId])
  const setMediaUpload = useConfiguratorStore(s => s.setMediaUpload)
  const clearMediaUpload = useConfiguratorStore(s => s.clearMediaUpload)
  const slotSettings = useConfiguratorStore(s => s.mediaSlotSettings[slotId])
  const copyMode = useConfiguratorStore(s => s.copyMode)
  const inputRef = useRef<HTMLInputElement>(null)
  const settingsBtnRef = useRef<HTMLButtonElement>(null)
  const [popoverOpen, setPopoverOpen] = useState(false)

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setMediaUpload(slotId, file)
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    clearMediaUpload(slotId)
  }

  const handleSettings = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPopoverOpen(!popoverOpen)
  }

  const accept = type === 'video' ? 'video/*' : 'image/*'
  const displayUrl = media?.remoteUrl ?? media?.blobUrl

  // Per-slot display style (fallback to 'none')
  const displayStyle = slotSettings?.displayStyle ?? 'none'
  const styleClass = media && displayStyle !== 'none' ? `media-slot--${displayStyle}` : ''

  // Per-slot aspect ratio, object position, and zoom
  const slotAspect = slotSettings?.aspectRatio ?? aspectRatio
  const slotPosition = slotSettings?.objectPosition
  const imageScale = slotSettings?.imageScale ?? 1

  // Build image style with position + zoom
  const imgStyle: React.CSSProperties = {}
  if (slotPosition) imgStyle.objectPosition = slotPosition
  if (imageScale !== 1) {
    imgStyle.transform = `scale(${imageScale})`
    imgStyle.transformOrigin = slotPosition ?? 'center'
  }

  // Responsive srcSet if optimized
  const hasResponsive = media?.responsiveUrls
  const srcSetStr = hasResponsive
    ? `${media.responsiveUrls!.mobile} 480w, ${media.responsiveUrls!.tablet} 768w, ${media.responsiveUrls!.desktop} 1200w`
    : undefined
  const sizesStr = hasResponsive
    ? '(max-width: 480px) 480px, (max-width: 768px) 768px, 1200px'
    : undefined

  return (
    <div
      className={`media-slot media-slot--uploadable ${media ? 'media-slot--filled' : ''} ${styleClass} ${className ?? ''}`}
      style={{ aspectRatio: slotAspect }}
      onClick={handleClick}
    >
      <input ref={inputRef} type="file" accept={accept} onChange={handleFile} hidden />
      {media ? (
        <>
          {type === 'image' ? (
            <img
              src={displayUrl}
              srcSet={srcSetStr}
              sizes={sizesStr}
              alt={deriveAlt(slotId, media.name)}
              className="media-slot__img"
              loading={slotId.startsWith('hero') ? 'eager' : 'lazy'}
              style={Object.keys(imgStyle).length > 0 ? imgStyle : undefined}
            />
          ) : (
            <video src={displayUrl} className="media-slot__video" controls />
          )}
          <button className="media-slot__clear" onClick={handleClear} title="Remove">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          {copyMode && (
            <button
              ref={settingsBtnRef}
              className="media-slot__settings"
              onClick={handleSettings}
              title="Image Settings"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
            </button>
          )}
          {popoverOpen && (
            <MediaSlotPopover
              slotId={slotId}
              anchorEl={settingsBtnRef.current}
              onClose={() => setPopoverOpen(false)}
            />
          )}
        </>
      ) : (
        <>
          {children}
          <div className="media-slot__upload-hint">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="1.5" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        </>
      )}
    </div>
  )
}
