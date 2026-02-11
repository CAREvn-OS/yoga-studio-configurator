import { CopyElement } from '../components/CopyElement'
import { useConfiguratorStore } from '@care/configurator'

interface PricingProps {
  layout: string
}

export function Pricing({ layout }: PricingProps) {
  const count = useConfiguratorStore(s => s.sectionItems.pricing ?? 4)
  const tiers = Array.from({ length: count }, (_, i) => i + 1)

  return (
    <section className={`pricing pricing--${layout}`} id="pricing">
      <div className="pricing__inner">
        <CopyElement id="pricing-eyebrow" as="p" className="section-eyebrow reveal" />
        <CopyElement id="pricing-heading" as="h2" className="section-heading reveal" />
        <CopyElement id="pricing-subtitle" as="p" className="pricing__subtitle reveal" />
        <div className="pricing__grid">
          {tiers.map(i => (
            <div className={`pricing__card reveal reveal-delay-${Math.min(i, 4)} ${i === 3 ? 'pricing__card--featured' : ''}`} key={i}>
              <CopyElement id={`pricing-${i}-name`} as="h3" className="pricing__name" />
              <div className="pricing__price-wrap">
                <CopyElement id={`pricing-${i}-price`} as="span" className="pricing__price" />
                <CopyElement id={`pricing-${i}-period`} as="span" className="pricing__period" />
              </div>
              <CopyElement id={`pricing-${i}-desc`} as="p" className="pricing__desc" />
              <CopyElement id={`pricing-${i}-features`} as="ul" className="pricing__features" />
              <a href="#contact" className="btn btn--outline pricing__cta">Get Started</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
