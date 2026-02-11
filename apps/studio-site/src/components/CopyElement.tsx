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
  const styleMode = useConfiguratorStore(s => s.styleMode)
  const activeStyleElement = useConfiguratorStore(s => s.activeStyleElement)
  const setActiveStyleElement = useConfiguratorStore(s => s.setActiveStyleElement)

  const alternatives = allCopy[id]
  if (!alternatives) return null

  const displayText = customText ?? alternatives[selectionIndex] ?? alternatives[0]
  const isCopyActive = activeCopyElement === id
  const isStyleActive = activeStyleElement === id

  const handleClick = (e: React.MouseEvent) => {
    if (styleMode) {
      e.preventDefault()
      e.stopPropagation()
      setActiveStyleElement(id)
      return
    }
    if (copyMode) {
      e.preventDefault()
      e.stopPropagation()
      setActiveCopyElement(id)
      return
    }
  }

  // Styles are now applied globally via <style> tag in StyleModeHandler (App.tsx)
  // so we don't need inline styles here — just data-style-id

  return (
    <Tag
      data-copy-id={id}
      data-style-id={id}
      className={`${className ?? ''} ${copyMode ? 'copy-target' : ''} ${isCopyActive ? 'copy-active' : ''} ${styleMode ? 'style-target' : ''} ${isStyleActive ? 'style-active' : ''}`}
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: displayText }}
    />
  )
}
