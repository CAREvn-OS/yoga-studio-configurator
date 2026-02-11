import { useConfiguratorStore } from '../store/configuratorStore'

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

export function LayoutPanel() {
  const layouts = useConfiguratorStore(s => s.layouts)
  const setLayout = useConfiguratorStore(s => s.setLayout)

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
    </>
  )
}
