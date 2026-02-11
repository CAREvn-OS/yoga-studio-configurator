import { CopyElement } from '../components/CopyElement'

export function Events() {
  return (
    <section className="events" id="events">
      <div className="events__inner">
        <CopyElement id="events-eyebrow" as="p" className="section-eyebrow reveal" />
        <CopyElement id="events-heading" as="h2" className="section-heading reveal" />
        <div className="events__grid">
          {[1, 2, 3].map(i => (
            <div className={`events__card reveal reveal-delay-${i}`} key={i}>
              <div className="events__date">Coming Soon</div>
              <h3 className="events__title">Workshop {i}</h3>
              <p className="events__desc">Details for this upcoming workshop or retreat.</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
