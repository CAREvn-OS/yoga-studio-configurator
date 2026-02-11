import { CopyElement } from '../components/CopyElement'
import { MediaSlot } from '../components/MediaSlot'

interface AboutProps {
  layout: string
}

export function About({ layout }: AboutProps) {
  return (
    <section className={`about about--${layout}`} id="about">
      <div className="about__image reveal">
        <MediaSlot slotId="about-img" className="about__image-frame" aspectRatio="3/4">
          <div className="about__image-placeholder">
            <span className="about__initials">YS</span>
          </div>
        </MediaSlot>
        <div className="about__image-accent" />
      </div>
      <div className="about__content">
        <CopyElement id="about-eyebrow" as="p" className="section-eyebrow reveal" />
        <CopyElement id="about-h2" as="h2" className="section-heading reveal" />
        <CopyElement id="about-p1" as="p" className="about__text reveal" />
        <CopyElement id="about-p2" as="p" className="about__text reveal" />
        <CopyElement id="about-p3" as="p" className="about__text reveal" />
        <div className="about__stats reveal">
          <div className="stat">
            <CopyElement id="about-stat-1-num" as="div" className="stat__number" />
            <CopyElement id="about-stat-1-label" as="div" className="stat__label" />
          </div>
          <div className="stat">
            <CopyElement id="about-stat-2-num" as="div" className="stat__number" />
            <CopyElement id="about-stat-2-label" as="div" className="stat__label" />
          </div>
          <div className="stat">
            <CopyElement id="about-stat-3-num" as="div" className="stat__number" />
            <CopyElement id="about-stat-3-label" as="div" className="stat__label" />
          </div>
        </div>
      </div>
    </section>
  )
}
