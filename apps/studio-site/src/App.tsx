import { useEffect, useMemo } from 'react'
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

// Maps typography categories to CSS selectors
const TYPO_CATEGORY_SELECTORS: Record<string, string> = {
  headers: '.section-heading, h1, h2, .hero__title',
  subheaders: '.section-eyebrow, h3, h4, .hero__subtitle',
  body: 'p, .about__text, .pricing__desc, li',
  buttons: '.btn, .nav__cta, .btn--primary, .btn--outline',
  captions: 'blockquote, .stat__label, figcaption, small, .testimonial__author',
}

const FONT_FAMILY_MAP: Record<string, string> = {
  'serene': "'Cormorant Garamond', Georgia, serif",
  'modern': "'Outfit', 'Inter', sans-serif",
  'organic': "'Lora', 'Playfair Display', serif",
  'minimal': "'Jost', 'Nunito Sans', sans-serif",
  'classic': "'Source Serif 4', 'Libre Baskerville', serif",
  'bold': "'DM Sans', 'Montserrat', sans-serif",
}

const VIBE_CLASSES: Record<string, string> = {
  zen: 'vibe-zen',
  pulse: 'vibe-pulse',
  bloom: 'vibe-bloom',
  drift: 'vibe-drift',
  spark: 'vibe-spark',
  wave: 'vibe-wave',
}

type SectionEntry = {
  component: React.ComponentType<any>
  props?: Record<string, any>
  optional?: boolean
}

function buildSectionRegistry(layouts: Record<string, string>): Record<string, SectionEntry> {
  return {
    about: { component: About, props: { layout: layouts.about ?? 'default' } },
    manifesto: { component: Manifesto, optional: true },
    schedule: { component: Schedule, props: { layout: layouts.schedule ?? 'grid' } },
    process: { component: Process, optional: true },
    instructors: { component: Instructors, props: { layout: layouts.instructors ?? 'grid' } },
    pricing: { component: Pricing, props: { layout: layouts.pricing ?? 'cards' } },
    studioTour: { component: StudioTour, optional: true },
    testimonials: { component: Testimonials },
    events: { component: Events, optional: true },
    blog: { component: Blog, optional: true },
    partners: { component: Partners, optional: true },
    faq: { component: FAQ, optional: true },
    contact: { component: Contact },
  }
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
    <button id="back-to-top" className="back-to-top" aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
      <svg viewBox="0 0 24 24" width="16" height="16" stroke="var(--color-stone)" strokeWidth="1.5" fill="none">
        <polyline points="18 15 12 9 6 15" />
      </svg>
    </button>
  )
}

function RevealObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target) }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    const observe = () => document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el))
    observe()
    const mo = new MutationObserver(observe)
    mo.observe(document.body, { childList: true, subtree: true })
    return () => { observer.disconnect(); mo.disconnect() }
  }, [])
  return null
}

function TypoCategoryApplier() {
  const typoCategorySettings = useConfiguratorStore(s => s.typoCategorySettings)

  useEffect(() => {
    const styleEl = document.getElementById('cfg-typo-category-styles') || (() => {
      const s = document.createElement('style')
      s.id = 'cfg-typo-category-styles'
      document.head.appendChild(s)
      return s
    })()

    const rules = Object.entries(typoCategorySettings).map(([cat, settings]) => {
      if (!settings) return ''
      const selector = TYPO_CATEGORY_SELECTORS[cat]
      if (!selector) return ''
      const props: string[] = []
      if (settings.fontFamily && FONT_FAMILY_MAP[settings.fontFamily]) {
        props.push(`font-family: ${FONT_FAMILY_MAP[settings.fontFamily]} !important`)
      }
      if (settings.fontWeight) props.push(`font-weight: ${settings.fontWeight} !important`)
      if (settings.color) props.push(`color: ${settings.color} !important`)
      if (settings.textShadow && settings.textShadow > 0) {
        const s = settings.textShadow / 100
        props.push(`text-shadow: 0 ${1 + s * 4}px ${2 + s * 10}px rgba(0,0,0,${(0.05 + s * 0.25).toFixed(2)}) !important`)
      }
      if (settings.glow && settings.glow > 0) {
        const g = settings.glow / 100
        props.push(`text-shadow: 0 0 ${(4 + g * 20).toFixed(0)}px currentColor !important`)
      }
      if (settings.letterSpacing && settings.letterSpacing > 0) {
        const ls = settings.letterSpacing / 100
        props.push(`letter-spacing: ${(ls * 0.3).toFixed(3)}em !important`)
      }
      if (props.length === 0) return ''
      return `${selector} { ${props.join('; ')} }`
    }).filter(Boolean).join('\n')

    const animRules = Object.entries(typoCategorySettings).map(([cat, settings]) => {
      if (!settings?.animation || settings.animation === 0) return ''
      const selector = TYPO_CATEGORY_SELECTORS[cat]
      if (!selector) return ''
      const i = settings.animation / 100
      if (i < 0.3) return `${selector} { transition: transform 0.4s ease, opacity 0.4s ease !important; }`
      if (i < 0.6) return `${selector} { animation: typoFade 0.6s ease both !important; }`
      return `${selector} { animation: typoFloat 3s ease-in-out infinite !important; }`
    }).filter(Boolean).join('\n')

    styleEl.textContent = `${rules}\n${animRules}
@keyframes typoFade { from { opacity: 0; transform: translateY(8px) } to { opacity: 1; transform: none } }
@keyframes typoFloat { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-4px) } }
`
  }, [typoCategorySettings])
  return null
}

function VibeApplier() {
  const vibe = useConfiguratorStore(s => s.vibe)

  useEffect(() => {
    document.body.classList.forEach(cls => {
      if (cls.startsWith('vibe-')) document.body.classList.remove(cls)
    })
    const vibeClass = VIBE_CLASSES[vibe.preset]
    if (vibeClass) document.body.classList.add(vibeClass)
    document.documentElement.style.setProperty('--vibe-intensity', String(vibe.intensity / 100))
  }, [vibe])
  return null
}

export default function App() {
  const theme = useConfiguratorStore(s => s.theme)
  const colorOverrides = useConfiguratorStore(s => s.colorOverrides)
  const typographyOverride = useConfiguratorStore(s => s.typographyOverride)
  const layouts = useConfiguratorStore(s => s.layouts)
  const sections = useConfiguratorStore(s => s.sections)
  const sectionOrder = useConfiguratorStore(s => s.sectionOrder)
  const copyMode = useConfiguratorStore(s => s.copyMode)

  const registry = useMemo(() => buildSectionRegistry(layouts), [layouts])

  useEffect(() => {
    applyTheme(theme, colorOverrides, typographyOverride)
  }, [theme, colorOverrides, typographyOverride])

  useEffect(() => {
    if (copyMode) document.body.classList.add('copy-mode')
    else document.body.classList.remove('copy-mode')
  }, [copyMode])

  return (
    <>
      <ScrollProgress />
      <RevealObserver />
      <TypoCategoryApplier />
      <VibeApplier />
      <Navbar />
      <Hero layout={layouts.hero ?? 'center'} />
      <div className="divider">
        <div className="divider__line" />
        <div className="divider__diamond" />
        <div className="divider__line" />
      </div>
      {sectionOrder.map(id => {
        const entry = registry[id]
        if (!entry) return null
        if (entry.optional && !sections[id]) return null
        const Component = entry.component
        return <Component key={id} {...(entry.props ?? {})} />
      })}
      <Footer />
      <BackToTop />
    </>
  )
}
