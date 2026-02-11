import { CopyElement } from '../components/CopyElement'

export function Process() {
  const steps = [1, 2, 3, 4]

  return (
    <section className="process" id="process">
      <div className="process__inner">
        <CopyElement id="process-eyebrow" as="p" className="section-eyebrow reveal" />
        <CopyElement id="process-heading" as="h2" className="section-heading reveal" />
        <CopyElement id="process-subtitle" as="p" className="process__subtitle reveal" />
        <div className="process__steps">
          {steps.map(i => (
            <div className={`process__step reveal reveal-delay-${i}`} key={i}>
              <div className="process__step-num">0{i}</div>
              <CopyElement id={`process-${i}-title`} as="h3" className="process__step-title" />
              <CopyElement id={`process-${i}-desc`} as="p" className="process__step-desc" />
              {i < 4 && <div className="process__step-connector" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
