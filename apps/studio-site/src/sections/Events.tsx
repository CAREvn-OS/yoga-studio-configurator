import { CopyElement } from '../components/CopyElement'
import { MediaSlot } from '../components/MediaSlot'
import { useConfiguratorStore } from '@care/configurator'

export function Events() {
  const count = useConfiguratorStore(s => s.sectionItems.events ?? 3)
  const items = Array.from({ length: count }, (_, i) => i + 1)

  return (
    <section className="events" id="events">
      <div className="events__inner">
        <CopyElement id="events-eyebrow" as="p" className="section-eyebrow reveal" />
        <CopyElement id="events-heading" as="h2" className="section-heading reveal" />
        <div className="events__grid">
          {items.map(i => (
            <div className={`events__card reveal reveal-delay-${Math.min(i, 4)}`} key={i}>
              <MediaSlot slotId={`event-${i}-img`} className="events__card-img" aspectRatio="16/9">
                <div className="events__card-img-placeholder">
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              </MediaSlot>
              <div className="events__card-body">
                <CopyElement id={`event-${i}-date`} as="span" className="events__date" />
                <CopyElement id={`event-${i}-title`} as="h3" className="events__title" />
                <CopyElement id={`event-${i}-desc`} as="p" className="events__desc" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
