import { CopyElement } from '../components/CopyElement'
import { MediaSlot } from '../components/MediaSlot'
import { useConfiguratorStore } from '@care/configurator'

export function Blog() {
  const count = useConfiguratorStore(s => s.sectionItems.blog ?? 3)
  const items = Array.from({ length: count }, (_, i) => i + 1)

  return (
    <section className="blog" id="blog">
      <div className="blog__inner">
        <CopyElement id="blog-eyebrow" as="p" className="section-eyebrow reveal" />
        <CopyElement id="blog-heading" as="h2" className="section-heading reveal" />
        <div className="blog__grid">
          {items.map(i => (
            <div className={`blog__card reveal reveal-delay-${Math.min(i, 4)}`} key={i}>
              <MediaSlot slotId={`blog-${i}-img`} className="blog__card-img" aspectRatio="16/9">
                <div className="blog__card-img-placeholder">
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
              </MediaSlot>
              <div className="blog__card-body">
                <CopyElement id={`blog-${i}-tag`} as="span" className="blog__tag" />
                <CopyElement id={`blog-${i}-title`} as="h3" className="blog__title" />
                <CopyElement id={`blog-${i}-excerpt`} as="p" className="blog__excerpt" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
