import { CopyElement } from '../components/CopyElement'

export function Testimonials() {
  return (
    <section className="testimonials" id="testimonials">
      <div className="testimonials__inner">
        <CopyElement id="testimonials-eyebrow" as="p" className="section-eyebrow reveal" />
        <CopyElement id="testimonials-heading" as="h2" className="section-heading reveal" />
        <div className="testimonials__cards">
          {[1, 2, 3].map(i => (
            <div className={`testimonials__card reveal reveal-delay-${i}`} key={i}>
              <div className="testimonials__mark">&ldquo;</div>
              <CopyElement id={`testimonial-${i}-quote`} as="blockquote" className="testimonials__quote" />
              <CopyElement id={`testimonial-${i}-author`} as="div" className="testimonials__author" />
              <CopyElement id={`testimonial-${i}-detail`} as="div" className="testimonials__detail" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
