import { useConfiguratorStore } from '../store/configuratorStore'

const SECTION_LABELS: Record<string, string> = {
  manifesto: 'Manifesto',
  process: 'Your Journey',
  studioTour: 'Studio Tour',
  events: 'Events',
  blog: 'Blog',
  partners: 'Partners',
  faq: 'FAQ',
}

const SECTION_ORDER = ['manifesto', 'process', 'studioTour', 'events', 'blog', 'partners', 'faq']

export function SectionsPanel() {
  const sections = useConfiguratorStore(s => s.sections)
  const toggleSection = useConfiguratorStore(s => s.toggleSection)

  return (
    <div className="cfg-sections-list">
      {SECTION_ORDER.map(id => {
        const isOn = sections[id] ?? false
        return (
          <div key={id} className="cfg-section-row">
            <span className="cfg-section-row__label">{SECTION_LABELS[id]}</span>
            <button
              className={`cfg-toggle ${isOn ? 'cfg-toggle--on' : ''}`}
              onClick={() => toggleSection(id)}
              role="switch"
              aria-checked={isOn}
              aria-label={`Toggle ${SECTION_LABELS[id]}`}
            >
              <span className="cfg-toggle__knob" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
