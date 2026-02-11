import { CopyElement } from '../components/CopyElement'
import { MediaSlot } from '../components/MediaSlot'
import { useConfiguratorStore } from '@care/configurator'

export function Testimonials() {
  const count = useConfiguratorStore(s => s.sectionItems.testimonials ?? 3)
  const items = Array.from({ length: count }, (_, i) => i + 1)

  return (
    <section className="testimonials" id="testimonials">
      <div className="testimonials__inner">
        <CopyElement id="testimonials-eyebrow" as="p" className="section-eyebrow reveal" />
        <CopyElement id="testimonials-heading" as="h2" className="section-heading reveal" />
        <div className="testimonials__cards">
          {items.map(i => (
            <div className={`testimonials__card reveal reveal-delay-${Math.min(i, 4)}`} key={i}>
              <MediaSlot slotId={`testimonial-${i}-avatar`} className="testimonials__avatar" aspectRatio="1/1">
                <div className="testimonials__avatar-placeholder">
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              </MediaSlot>
              <div className="testimonials__mark">&ldquo;</div>
              <CopyElement id={`testimonial-${i}-quote`} as="blockquote" className="testimonials__quote" />
              <CopyElement id={`testimonial-${i}-author`} as="div" className="testimonials__author" />
              <CopyElement id={`testimonial-${i}-detail`} as="div" className="testimonials__detail" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
