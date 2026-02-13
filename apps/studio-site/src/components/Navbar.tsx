import { useState, useEffect } from 'react'
import { CopyElement } from './CopyElement'
import { useConfiguratorStore } from '@care/configurator'
import { t } from '../i18n'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const logoUpload = useConfiguratorStore(s => s.logoUpload)
  const language = useConfiguratorStore(s => s.language)
  const dockOpen = useConfiguratorStore(s => s.dockOpen)
  const previewMode = useConfiguratorStore(s => s.previewMode)
  const activeSectionBlob = useConfiguratorStore(s => s.activeSectionBlob)
  const setActiveSectionBlob = useConfiguratorStore(s => s.setActiveSectionBlob)

  const showNavBlob = mobileOpen && dockOpen && !previewMode

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

  const navItems = [
    { id: 'about', key: 'nav.about' },
    { id: 'schedule', key: 'nav.schedule' },
    { id: 'instructors', key: 'nav.instructors' },
    { id: 'pricing', key: 'nav.pricing' },
    { id: 'contact', key: 'nav.contact' },
  ]

  return (
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <a href="#" className="nav__logo" onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
        {logoUrl ? (
          <img src={logoUrl} alt={t(language, 'logo.alt')} className="nav__logo-img" />
        ) : (
          <CopyElement id="nav-logo" as="span" />
        )}
      </a>
      <button
        className={`nav__toggle ${mobileOpen ? 'nav__toggle--open' : ''}`}
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={t(language, 'nav.toggleMenu')}
      >
        <span /><span /><span />
      </button>
      <ul className={`nav__links ${mobileOpen ? 'nav__links--open' : ''}`}>
        {showNavBlob && (
          <li className="nav__blob-row">
            <button
              className={`cfg-mini-blob cfg-mini-blob--nav ${activeSectionBlob === 'nav' ? 'cfg-mini-blob--active' : ''}`}
              onClick={() => setActiveSectionBlob(activeSectionBlob === 'nav' ? null : 'nav')}
              aria-label="Configure nav"
            >
              <div className="cfg-mini-blob__inner" />
            </button>
          </li>
        )}
        {navItems.map(item => (
          <li key={item.id}>
            <a href={`#${item.id}`} onClick={e => { e.preventDefault(); handleNav(item.id) }}>
              {t(language, item.key)}
            </a>
          </li>
        ))}
        <li>
          <a href="#contact" className="nav__cta" onClick={e => { e.preventDefault(); handleNav('contact') }}>
            {t(language, 'nav.bookClass')}
          </a>
        </li>
      </ul>
    </nav>
  )
}
