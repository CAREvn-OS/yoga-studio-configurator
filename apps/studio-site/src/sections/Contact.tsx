import { CopyElement } from '../components/CopyElement'

export function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="contact__inner">
        <CopyElement id="contact-eyebrow" as="p" className="section-eyebrow reveal" />
        <CopyElement id="contact-heading" as="h2" className="section-heading reveal" />
        <CopyElement id="contact-sub" as="p" className="contact__sub reveal" />
        <a href="mailto:hello@yourstudio.com" className="contact__email reveal">hello@yourstudio.com</a>
        <div className="contact__details reveal">
          <div className="contact__detail">123 Wellness Street, District 2</div>
          <div className="contact__detail-sep" />
          <div className="contact__detail">Open 6am — 9pm Daily</div>
        </div>
        <div className="contact__cta reveal">
          <CopyElement id="contact-cta" as="a" className="btn btn--primary" />
        </div>
      </div>
    </section>
  )
}
