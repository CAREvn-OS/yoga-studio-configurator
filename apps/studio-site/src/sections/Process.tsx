import { CopyElement } from '../components/CopyElement'
import { useConfiguratorStore } from '@care/configurator'

export function Process() {
  const count = useConfiguratorStore(s => s.sectionItems.process ?? 4)
  const steps = Array.from({ length: count }, (_, i) => i + 1)

  return (
    <section className="process" id="process">
      <div className="process__inner">
        <CopyElement id="process-eyebrow" as="p" className="section-eyebrow reveal" />
        <CopyElement id="process-heading" as="h2" className="section-heading reveal" />
        <CopyElement id="process-subtitle" as="p" className="process__subtitle reveal" />
        <div className="process__steps">
          {steps.map(i => (
            <div className={`process__step reveal reveal-delay-${Math.min(i, 4)}`} key={i}>
              <div className="process__step-num">{String(i).padStart(2, '0')}</div>
              <CopyElement id={`process-${i}-title`} as="h3" className="process__step-title" />
              <CopyElement id={`process-${i}-desc`} as="p" className="process__step-desc" />
              {i < count && <div className="process__step-connector" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
