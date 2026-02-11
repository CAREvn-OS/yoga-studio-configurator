import { useConfiguratorStore } from '@care/configurator'
import { allCopy } from '@care/copy-content'

interface CopyElementProps {
  id: string
  as?: keyof JSX.IntrinsicElements
  className?: string
  children?: React.ReactNode
}

export function CopyElement({ id, as: Tag = 'span', className }: CopyElementProps) {
  const selectionIndex = useConfiguratorStore(s => s.copySelections[id] ?? 0)
  const customText = useConfiguratorStore(s => s.customCopy[id])
  const copyMode = useConfiguratorStore(s => s.copyMode)
  const activeCopyElement = useConfiguratorStore(s => s.activeCopyElement)
  const setActiveCopyElement = useConfiguratorStore(s => s.setActiveCopyElement)

  const alternatives = allCopy[id]
  if (!alternatives) return null

  const displayText = customText ?? alternatives[selectionIndex] ?? alternatives[0]
  const isActive = activeCopyElement === id

  const handleClick = (e: React.MouseEvent) => {
    if (!copyMode) return
    e.preventDefault()
    e.stopPropagation()
    setActiveCopyElement(id)
  }

  return (
    <Tag
      data-copy-id={id}
      className={`${className ?? ''} ${copyMode ? 'copy-target' : ''} ${isActive ? 'copy-active' : ''}`}
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: displayText }}
    />
  )
}
