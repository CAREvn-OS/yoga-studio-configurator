import { useConfiguratorStore } from '../store/configuratorStore'
import type { ImageDisplayStyle } from '@care/shared-types'

interface LayoutGroupDef {
  sectionId: string
  label: string
  options: { id: string; name: string }[]
}

const LAYOUT_GROUPS: LayoutGroupDef[] = [
  {
    sectionId: 'hero',
    label: 'Hero',
    options: [
      { id: 'center', name: 'Center' },
      { id: 'left', name: 'Left' },
      { id: 'split', name: 'Split' },
    ],
  },
  {
    sectionId: 'about',
    label: 'About',
    options: [
      { id: 'photo-left', name: 'Photo Left' },
      { id: 'photo-right', name: 'Photo Right' },
      { id: 'stacked', name: 'Stacked' },
    ],
  },
  {
    sectionId: 'schedule',
    label: 'Schedule',
    options: [
      { id: 'grid', name: 'Grid' },
      { id: 'list', name: 'List' },
      { id: 'cards', name: 'Cards' },
    ],
  },
  {
    sectionId: 'instructors',
    label: 'Instructors',
    options: [
      { id: 'grid', name: 'Grid' },
      { id: 'duo', name: 'Duo' },
      { id: 'scroll', name: 'Scroll' },
    ],
  },
  {
    sectionId: 'pricing',
    label: 'Pricing',
    options: [
      { id: 'cards', name: 'Cards' },
      { id: 'table', name: 'Table' },
      { id: 'stacked', name: 'Stacked' },
    ],
  },
]

const IMAGE_STYLES: { id: ImageDisplayStyle; name: string }[] = [
  { id: 'none', name: 'Default' },
  { id: 'gradient-fade', name: 'Fade' },
  { id: 'duotone', name: 'Duotone' },
  { id: 'vignette', name: 'Vignette' },
  { id: 'soft-edge', name: 'Soft Edge' },
]

export function LayoutPanel() {
  const layouts = useConfiguratorStore(s => s.layouts)
  const setLayout = useConfiguratorStore(s => s.setLayout)
  const imageDisplayStyle = useConfiguratorStore(s => s.imageDisplayStyle)
  const setImageDisplayStyle = useConfiguratorStore(s => s.setImageDisplayStyle)

  return (
    <>
      {LAYOUT_GROUPS.map(group => {
        const current = layouts[group.sectionId] ?? group.options[0].id
        return (
          <div key={group.sectionId} className="cfg-layout-group">
            <div className="cfg-layout-group__label">{group.label}</div>
            <div className="cfg-layout-group__options">
              {group.options.map(opt => (
                <button
                  key={opt.id}
                  className={`cfg-layout-option ${current === opt.id ? 'cfg-layout-option--active' : ''}`}
                  onClick={() => setLayout(group.sectionId, opt.id)}
                >
                  {opt.name}
                </button>
              ))}
            </div>
          </div>
        )
      })}

      <div className="cfg-layout-group">
        <div className="cfg-layout-group__label">Image Style</div>
        <div className="cfg-layout-group__options">
          {IMAGE_STYLES.map(opt => (
            <button
              key={opt.id}
              className={`cfg-layout-option ${imageDisplayStyle === opt.id ? 'cfg-layout-option--active' : ''}`}
              onClick={() => setImageDisplayStyle(opt.id)}
            >
              {opt.name}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
