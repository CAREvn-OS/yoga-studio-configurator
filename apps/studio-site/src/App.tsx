import { useEffect } from 'react'
import { useConfiguratorStore } from '@care/configurator'
import { applyTheme } from '@care/theme-engine'
import { Navbar } from './components/Navbar'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { Schedule } from './sections/Schedule'
import { Instructors } from './sections/Instructors'
import { Pricing } from './sections/Pricing'
import { Testimonials } from './sections/Testimonials'
import { Contact } from './sections/Contact'
import { Footer } from './sections/Footer'
import { Manifesto } from './sections/Manifesto'
import { Process } from './sections/Process'
import { StudioTour } from './sections/StudioTour'
import { Events } from './sections/Events'
import { Blog } from './sections/Blog'
import { Partners } from './sections/Partners'
import { FAQ } from './sections/FAQ'

const effects: Record<string, string> = {
  'smooth-rise': '',
  'gentle-fade': 'anim-subtle',
  'grand-entrance': 'anim-dramatic',
  'slide-in': 'anim-slide',
  none: 'anim-none',
}

function ScrollProgress() {
  useEffect(() => {
    const bar = document.getElementById('scroll-progress')
    const onScroll = () => {
      if (!bar) return
      const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      bar.style.width = `${pct}%`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return <div id="scroll-progress" className="scroll-progress" />
}

function BackToTop() {
  useEffect(() => {
    const btn = document.getElementById('back-to-top')
    const onScroll = () => {
      if (btn) btn.classList.toggle('visible', window.scrollY > 600)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      id="back-to-top"
      className="back-to-top"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" stroke="var(--color-stone)" strokeWidth="1.5" fill="none">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  )
}

function RevealObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    const observe = () => {
      document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el))
    }

    observe()

    // Re-observe when sections toggle
    const mo = new MutationObserver(observe)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mo.disconnect()
    }
  }, [])

  return null
}

export default function App() {
  const theme = useConfiguratorStore(s => s.theme)
  const colorOverrides = useConfiguratorStore(s => s.colorOverrides)
  const typographyOverride = useConfiguratorStore(s => s.typographyOverride)
  const layouts = useConfiguratorStore(s => s.layouts)
  const sections = useConfiguratorStore(s => s.sections)
  const effect = useConfiguratorStore(s => s.effect)
  const copyMode = useConfiguratorStore(s => s.copyMode)
  const mediaMode = useConfiguratorStore(s => s.mediaMode)

  // Apply theme
  useEffect(() => {
    applyTheme(theme, colorOverrides, typographyOverride)
  }, [theme, colorOverrides, typographyOverride])

  // Apply effect class
  useEffect(() => {
    const cls = effects[effect] ?? ''
    document.body.className = [
      cls,
      copyMode ? 'copy-mode' : '',
      mediaMode ? 'media-mode' : '',
    ].filter(Boolean).join(' ')
  }, [effect, copyMode, mediaMode])

  return (
    <>
      <ScrollProgress />
      <RevealObserver />
      <Navbar />

      <Hero layout={layouts.hero ?? 'center'} />

      <div className="divider">
        <div className="divider__line" />
        <div className="divider__diamond" />
        <div className="divider__line" />
      </div>

      <About layout={layouts.about ?? 'default'} />

      {sections.manifesto && <Manifesto />}

      <Schedule layout={layouts.schedule ?? 'grid'} />

      {sections.process && <Process />}

      <Instructors layout={layouts.instructors ?? 'grid'} />

      <Pricing layout={layouts.pricing ?? 'cards'} />

      {sections.studioTour && <StudioTour />}

      <Testimonials />

      {sections.events && <Events />}
      {sections.blog && <Blog />}
      {sections.partners && <Partners />}
      {sections.faq && <FAQ />}

      <Contact />
      <Footer />
      <BackToTop />
    </>
  )
}
