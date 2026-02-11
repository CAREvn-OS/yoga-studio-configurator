import { CopyElement } from '../components/CopyElement'

interface ScheduleProps {
  layout: string
}

export function Schedule({ layout }: ScheduleProps) {
  const classes = [1, 2, 3, 4, 5, 6]

  return (
    <section className={`schedule schedule--${layout}`} id="schedule">
      <div className="schedule__inner">
        <CopyElement id="schedule-eyebrow" as="p" className="section-eyebrow reveal" />
        <CopyElement id="schedule-heading" as="h2" className="section-heading reveal" />
        <CopyElement id="schedule-subtitle" as="p" className="schedule__subtitle reveal" />
        <div className="schedule__grid">
          {classes.map(i => (
            <div className={`schedule__card reveal reveal-delay-${Math.min(i, 4)}`} key={i}>
              <CopyElement id={`schedule-class-${i}-name`} as="h3" className="schedule__class-name" />
              <CopyElement id={`schedule-class-${i}-level`} as="span" className="schedule__class-level" />
              <CopyElement id={`schedule-class-${i}-desc`} as="p" className="schedule__class-desc" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
