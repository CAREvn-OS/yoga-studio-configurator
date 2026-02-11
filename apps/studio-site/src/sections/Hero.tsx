import { CopyElement } from '../components/CopyElement'
import { MediaSlot } from '../components/MediaSlot'

interface HeroProps {
  layout: string
}

export function Hero({ layout }: HeroProps) {
  return (
    <section className={`hero hero--${layout}`} id="hero">
      <MediaSlot slotId="hero-bg" className="hero__bg" aspectRatio="16/9">
        <div className="hero__bg-gradient" />
      </MediaSlot>
      <div className="hero__content">
        <CopyElement id="hero-eyebrow" as="p" className="hero__eyebrow reveal" />
        <CopyElement id="hero-h1" as="h1" className="hero__title reveal" />
        <CopyElement id="hero-sub" as="p" className="hero__sub reveal" />
        <div className="hero__ctas reveal">
          <a href="#contact" className="btn btn--primary">
            <CopyElement id="hero-cta" as="span" />
          </a>
          <a href="#schedule" className="btn btn--outline">
            <CopyElement id="hero-cta2" as="span" />
          </a>
        </div>
      </div>
      <div className="hero__scroll">
        <div className="hero__scroll-line" />
      </div>
    </section>
  )
}
