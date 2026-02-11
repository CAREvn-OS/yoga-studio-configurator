import { CopyElement } from '../components/CopyElement'

export function Partners() {
  return (
    <section className="partners" id="partners">
      <div className="partners__inner">
        <CopyElement id="partners-eyebrow" as="p" className="section-eyebrow reveal" />
        <div className="partners__list reveal">
          {['Balanced Body', 'Lululemon', 'Manduka', 'Alo Yoga', 'STOTT Pilates'].map(name => (
            <span className="partners__name" key={name}>{name}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
