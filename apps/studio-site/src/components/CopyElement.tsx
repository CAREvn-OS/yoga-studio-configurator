import { useConfiguratorStore } from '@care/configurator'
import { allCopy } from '@care/copy-content'

function generatePlaceholder(id: string): string {
  // Extract meaningful label from ID like "schedule-class-7-name" → "New Class"
  // or "pricing-5-name" → "New Tier"
  const parts = id.split('-')
  const fieldMap: Record<string, string> = {
    name: 'New Item', title: 'New Title', desc: 'Add a description here',
    quote: '"Your testimonial here"', author: 'Name', detail: 'Details',
    q: 'New question?', a: 'Add your answer here',
    bio: 'Short bio', role: 'Role', level: 'All Levels',
    price: '$0', period: '/visit', features: '<li>Feature 1</li><li>Feature 2</li>',
    tag: 'Topic', excerpt: 'A brief description of this post.',
    date: 'Coming Soon',
  }
  const lastPart = parts[parts.length - 1]
  return fieldMap[lastPart] ?? 'Edit me'
}

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

  // For items beyond the default copy range, show editable placeholder
  const fallback = customText ?? (alternatives ? (alternatives[selectionIndex] ?? alternatives[0]) : generatePlaceholder(id))
  const displayText = fallback
  const isCopyActive = activeCopyElement === id

  const handleClick = (e: React.MouseEvent) => {
    if (copyMode) {
      e.preventDefault()
      e.stopPropagation()
      setActiveCopyElement(id)
    }
  }

  return (
    <Tag
      data-copy-id={id}
      className={`${className ?? ''} ${copyMode ? 'copy-target' : ''} ${isCopyActive ? 'copy-active' : ''}`}
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: displayText }}
    />
  )
}
