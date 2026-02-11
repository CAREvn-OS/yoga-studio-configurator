import { CopyElement } from '../components/CopyElement'
import { MediaSlot } from '../components/MediaSlot'
import { useConfiguratorStore } from '@care/configurator'

interface InstructorsProps {
  layout: string
}

export function Instructors({ layout }: InstructorsProps) {
  const count = useConfiguratorStore(s => s.sectionItems.instructors ?? 4)
  const team = Array.from({ length: count }, (_, i) => i + 1)

  return (
    <section className={`instructors instructors--${layout}`} id="instructors">
      <div className="instructors__inner">
        <CopyElement id="instructors-eyebrow" as="p" className="section-eyebrow reveal" />
        <CopyElement id="instructors-heading" as="h2" className="section-heading reveal" />
        <CopyElement id="instructors-subtitle" as="p" className="instructors__subtitle reveal" />
        <div className="instructors__grid">
          {team.map(i => (
            <div className={`instructors__card reveal reveal-delay-${Math.min(i, 4)}`} key={i}>
              <MediaSlot slotId={`instructor-${i}-photo`} className="instructors__photo" aspectRatio="1/1">
                <div className="instructors__photo-placeholder">
                  <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              </MediaSlot>
              <CopyElement id={`instructor-${i}-name`} as="h3" className="instructors__name" />
              <CopyElement id={`instructor-${i}-role`} as="p" className="instructors__role" />
              <CopyElement id={`instructor-${i}-bio`} as="p" className="instructors__bio" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
