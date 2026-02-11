import { CopyElement } from '../components/CopyElement'
import { MediaSlot } from '../components/MediaSlot'
import { useConfiguratorStore } from '@care/configurator'

export function Partners() {
  const count = useConfiguratorStore(s => s.sectionItems.partners ?? 5)
  const items = Array.from({ length: count }, (_, i) => i + 1)

  return (
    <section className="partners" id="partners">
      <div className="partners__inner">
        <CopyElement id="partners-eyebrow" as="p" className="section-eyebrow reveal" />
        <div className="partners__list reveal">
          {items.map(i => (
            <div className="partners__item" key={i}>
              <MediaSlot slotId={`partner-${i}-logo`} className="partners__logo" aspectRatio="3/2">
                <div className="partners__logo-placeholder">
                  <CopyElement id={`partner-${i}-name`} as="span" className="partners__name" />
                </div>
              </MediaSlot>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
