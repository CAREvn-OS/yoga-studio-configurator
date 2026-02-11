import { useRef } from 'react'
import { useConfiguratorStore } from '@care/configurator'

interface MediaSlotProps {
  slotId: string
  type?: 'image' | 'video'
  aspectRatio?: string
  className?: string
  children?: React.ReactNode
}

export function MediaSlot({ slotId, type = 'image', aspectRatio, className, children }: MediaSlotProps) {
  const media = useConfiguratorStore(s => s.mediaUploads[slotId])
  const mediaMode = useConfiguratorStore(s => s.mediaMode)
  const setMediaUpload = useConfiguratorStore(s => s.setMediaUpload)
  const clearMediaUpload = useConfiguratorStore(s => s.clearMediaUpload)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClick = () => {
    if (!mediaMode) return
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

  const accept = type === 'video' ? 'video/*' : 'image/*'

  return (
    <div
      className={`media-slot ${mediaMode ? 'media-slot--active' : ''} ${media ? 'media-slot--filled' : ''} ${className ?? ''}`}
      style={{ aspectRatio }}
      onClick={handleClick}
    >
      <input ref={inputRef} type="file" accept={accept} onChange={handleFile} hidden />
      {media ? (
        <>
          {type === 'image' ? (
            <img src={media.blobUrl} alt={media.name} className="media-slot__img" />
          ) : (
            <video src={media.blobUrl} className="media-slot__video" controls />
          )}
          {mediaMode && (
            <button className="media-slot__clear" onClick={handleClear} title="Remove">
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </>
      ) : (
        <>
          {children}
          {mediaMode && (
            <div className="media-slot__placeholder">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="1.5" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span>Add {type}</span>
            </div>
          )}
        </>
      )}
    </div>
  )
}
