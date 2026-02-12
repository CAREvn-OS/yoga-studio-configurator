import { useConfiguratorStore } from '@care/configurator'
import { allCopyVi, allCopyEn } from '@care/copy-content'

const placeholderMapVi: Record<string, string> = {
  name: 'Mục mới', title: 'Tiêu đề mới', desc: 'Thêm mô tả tại đây',
  quote: '"Cảm nhận của bạn tại đây"', author: 'Tên', detail: 'Chi tiết',
  q: 'Câu hỏi mới?', a: 'Thêm câu trả lời tại đây',
  bio: 'Tiểu sử ngắn', role: 'Vai trò', level: 'Mọi Trình Độ',
  price: '0₫', period: '/buổi', features: '<li>Tính năng 1</li><li>Tính năng 2</li>',
  tag: 'Chủ đề', excerpt: 'Mô tả ngắn về bài viết này.',
  date: 'Sắp diễn ra',
}

const placeholderMapEn: Record<string, string> = {
  name: 'New Item', title: 'New Title', desc: 'Add a description here',
  quote: '"Your testimonial here"', author: 'Name', detail: 'Details',
  q: 'New question?', a: 'Add your answer here',
  bio: 'Short bio', role: 'Role', level: 'All Levels',
  price: '$0', period: '/visit', features: '<li>Feature 1</li><li>Feature 2</li>',
  tag: 'Topic', excerpt: 'A brief description of this post.',
  date: 'Coming Soon',
}

function generatePlaceholder(id: string, lang: string): string {
  const parts = id.split('-')
  const lastPart = parts[parts.length - 1]
  const map = lang === 'vi' ? placeholderMapVi : placeholderMapEn
  const fallbackText = lang === 'vi' ? 'Chỉnh sửa' : 'Edit me'
  return map[lastPart] ?? fallbackText
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
  const language = useConfiguratorStore(s => s.language)

  const copyMap = language === 'vi' ? allCopyVi : allCopyEn
  const alternatives = copyMap[id]

  // For items beyond the default copy range, show editable placeholder
  const fallback = customText ?? (alternatives ? (alternatives[selectionIndex] ?? alternatives[0]) : generatePlaceholder(id, language))
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
