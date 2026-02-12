import { CopyElement } from '../components/CopyElement'

export function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="contact__inner">
        <CopyElement id="contact-eyebrow" as="p" className="section-eyebrow reveal" />
        <CopyElement id="contact-heading" as="h2" className="section-heading reveal" />
        <CopyElement id="contact-sub" as="p" className="contact__sub reveal" />
        <a href="mailto:hello@yourstudio.com" className="contact__email reveal">hello@yourstudio.com</a>

        {/* Messenger links */}
        <div className="contact__messengers reveal">
          <a href="https://wa.me/1234567890" className="contact__messenger-link" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            WhatsApp
          </a>
          <a href="https://t.me/yourstudio" className="contact__messenger-link" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
            Telegram
          </a>
        </div>

        <div className="contact__details reveal">
          <div className="contact__detail">123 Wellness Street, District 2</div>
          <div className="contact__detail-sep" />
          <div className="contact__detail">Open 6am — 9pm Daily</div>
        </div>

        {/* Contact form */}
        <form className="contact__form reveal" onSubmit={e => e.preventDefault()}>
          <div className="contact__form-row">
            <input type="text" className="contact__input" placeholder="Your name" aria-label="Your name" />
            <input type="email" className="contact__input" placeholder="Email address" aria-label="Email address" />
          </div>
          <textarea className="contact__textarea" placeholder="Your message…" aria-label="Your message" />
          <div className="contact__form-submit">
            <button type="submit" className="btn btn--primary">Send Message</button>
          </div>
        </form>

        {/* Google Maps placeholder */}
        <div className="contact__map-placeholder reveal">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          Google Maps Embed
        </div>

        <div className="contact__cta reveal">
          <CopyElement id="contact-cta" as="a" className="btn btn--primary" />
        </div>
      </div>
    </section>
  )
}
