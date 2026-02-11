import { MediaSlot } from '../components/MediaSlot'

export function StudioTour() {
  return (
    <section className="studio-tour" id="studioTour">
      <div className="studio-tour__inner">
        <p className="section-eyebrow reveal">Our Space</p>
        <h2 className="section-heading reveal">The Studio</h2>
        <div className="studio-tour__grid">
          {[1, 2, 3, 4].map(i => (
            <MediaSlot
              key={i}
              slotId={`tour-img-${i}`}
              className={`studio-tour__img reveal reveal-delay-${i}`}
              aspectRatio={i <= 2 ? '16/10' : '1/1'}
            >
              <div className="studio-tour__placeholder">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.25">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
            </MediaSlot>
          ))}
        </div>
      </div>
    </section>
  )
}
