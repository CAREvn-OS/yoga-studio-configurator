import { useState, useEffect } from 'react'
import { CopyElement } from './CopyElement'
import { useConfiguratorStore } from '@care/configurator'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const logoUpload = useConfiguratorStore(s => s.logoUpload)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (id: string) => {
    setMobileOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const logoUrl = logoUpload?.remoteUrl ?? logoUpload?.blobUrl

  return (
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <a href="#" className="nav__logo" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className="nav__logo-img" />
        ) : (
          <CopyElement id="nav-logo" as="span" />
        )}
      </a>
      <button
        className={`nav__toggle ${mobileOpen ? 'nav__toggle--open' : ''}`}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        <span /><span /><span />
      </button>
      <ul className={`nav__links ${mobileOpen ? 'nav__links--open' : ''}`}>
        {['about', 'schedule', 'instructors', 'pricing', 'contact'].map(id => (
          <li key={id}>
            <a href={`#${id}`} onClick={e => { e.preventDefault(); handleNav(id) }}>
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          </li>
        ))}
        <li>
          <a href="#contact" className="nav__cta" onClick={e => { e.preventDefault(); handleNav('contact') }}>
            Book a Class
          </a>
        </li>
      </ul>
    </nav>
  )
}
