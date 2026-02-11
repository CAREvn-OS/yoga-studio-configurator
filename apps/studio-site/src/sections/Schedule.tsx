import { CopyElement } from '../components/CopyElement'
import { MediaSlot } from '../components/MediaSlot'
import { useConfiguratorStore } from '@care/configurator'

interface ScheduleProps {
  layout: string
}

export function Schedule({ layout }: ScheduleProps) {
  const count = useConfiguratorStore(s => s.sectionItems.schedule ?? 6)
  const classes = Array.from({ length: count }, (_, i) => i + 1)

  return (
    <section className={`schedule schedule--${layout}`} id="schedule">
      <div className="schedule__inner">
        <CopyElement id="schedule-eyebrow" as="p" className="section-eyebrow reveal" />
        <CopyElement id="schedule-heading" as="h2" className="section-heading reveal" />
        <CopyElement id="schedule-subtitle" as="p" className="schedule__subtitle reveal" />
        <div className="schedule__grid">
          {classes.map(i => (
            <div className={`schedule__card reveal reveal-delay-${Math.min(i, 4)}`} key={i}>
              <MediaSlot slotId={`schedule-class-${i}-img`} className="schedule__card-img" aspectRatio="16/9">
                <div className="schedule__card-img-placeholder">
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              </MediaSlot>
              <div className="schedule__card-body">
                <CopyElement id={`schedule-class-${i}-name`} as="h3" className="schedule__class-name" />
                <CopyElement id={`schedule-class-${i}-level`} as="span" className="schedule__class-level" />
                <CopyElement id={`schedule-class-${i}-desc`} as="p" className="schedule__class-desc" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
