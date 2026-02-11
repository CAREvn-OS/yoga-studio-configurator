import { CopyElement } from '../components/CopyElement'

export function Manifesto() {
  return (
    <section className="manifesto" id="manifesto">
      <div className="manifesto__inner">
        <CopyElement id="manifesto-text" as="p" className="manifesto__text reveal" />
        <div className="manifesto__accent" />
      </div>
    </section>
  )
}
