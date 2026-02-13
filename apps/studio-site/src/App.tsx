import { useEffect, useMemo } from 'react'
import { useConfiguratorStore } from '@care/configurator'
import { applyTheme } from '@care/theme-engine'
import { t } from './i18n'
import { Navbar } from './components/Navbar'
import { SectionWrapper } from './components/SectionWrapper'
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
import { SocialMedia } from './sections/SocialMedia'
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
  'script': "'Dancing Script', cursive",
  'elegant': "'Great Vibes', cursive",
  'editorial': "'Playfair Display', 'EB Garamond', serif",
  'geometric': "'Poppins', 'Raleway', sans-serif",
  'literary': "'Bitter', 'Crimson Pro', serif",
  'clean': "'Raleway', 'Montserrat', sans-serif",
}

const VIBE_CLASSES: Record<string, string> = {
  normal: 'vibe-normal',
  serene: 'vibe-serene',
  breathe: 'vibe-breathe',
  spring: 'vibe-spring',
  flow: 'vibe-flow',
  snap: 'vibe-snap',
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
    socialMedia: { component: SocialMedia, optional: true },
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
  const language = useConfiguratorStore(s => s.language)
  useEffect(() => {
    const btn = document.getElementById('back-to-top')
    const onScroll = () => {
      if (btn) btn.classList.toggle('visible', window.scrollY > 600)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button id="back-to-top" className="back-to-top" aria-label={t(language, 'backToTop')}
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
      if (settings.letterSpacing && settings.letterSpacing > 0) {
        const ls = settings.letterSpacing / 100
        props.push(`letter-spacing: ${(ls * 0.3).toFixed(3)}em !important`)
      }
      if (props.length === 0) return ''
      return `${selector} { ${props.join('; ')} }`
    }).filter(Boolean).join('\n')

    styleEl.textContent = rules
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
  }, [vibe])
  return null
}

function StylizeApplier() {
  const borderRadiusOverride = useConfiguratorStore(s => s.borderRadiusOverride)
  const buttonStyle = useConfiguratorStore(s => s.buttonStyle)
  const cardStyle = useConfiguratorStore(s => s.cardStyle)
  const logoScale = useConfiguratorStore(s => s.logoScale)

  useEffect(() => {
    const root = document.documentElement
    if (borderRadiusOverride !== null) {
      root.style.setProperty('--border-radius', `${borderRadiusOverride}px`)
    }
  }, [borderRadiusOverride])

  useEffect(() => {
    document.documentElement.style.setProperty('--logo-scale', `${logoScale}px`)
  }, [logoScale])

  useEffect(() => {
    const body = document.body
    body.classList.remove('btn-style-rounded', 'btn-style-sharp', 'btn-style-pill')
    body.classList.add(`btn-style-${buttonStyle}`)
  }, [buttonStyle])

  useEffect(() => {
    const body = document.body
    body.classList.remove('card-style-flat', 'card-style-shadow', 'card-style-outline')
    body.classList.add(`card-style-${cardStyle}`)
  }, [cardStyle])

  return null
}

function PreviewModeApplier() {
  const previewMode = useConfiguratorStore(s => s.previewMode)

  useEffect(() => {
    if (previewMode) {
      document.body.classList.add('preview-mode')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      document.body.classList.remove('preview-mode')
    }
    return () => {
      document.body.classList.remove('preview-mode')
    }
  }, [previewMode])

  return null
}

/* Hero shift: when hero blob is active, push content down for row menu room */
function HeroShiftApplier() {
  const activeSectionBlob = useConfiguratorStore(s => s.activeSectionBlob)

  useEffect(() => {
    const main = document.querySelector('.site-main') as HTMLElement | null
    if (!main) return
    if (activeSectionBlob === 'hero') {
      main.classList.add('hero-shifted')
    } else {
      main.classList.remove('hero-shifted')
    }
    return () => main.classList.remove('hero-shifted')
  }, [activeSectionBlob])

  return null
}

/* Auto-preview: fade blobs when all are scrolled off-screen */
function AutoPreviewWatcher() {
  const dockOpen = useConfiguratorStore(s => s.dockOpen)
  const previewMode = useConfiguratorStore(s => s.previewMode)
  const setAutoPreview = useConfiguratorStore(s => s.setAutoPreview)

  useEffect(() => {
    if (!dockOpen || previewMode) {
      setAutoPreview(false)
      return
    }

    let ticking = false
    const check = () => {
      const blobs = document.querySelectorAll('.cfg-mini-blob')
      if (blobs.length === 0) { setAutoPreview(false); return }
      let anyVisible = false
      blobs.forEach(blob => {
        const rect = blob.getBoundingClientRect()
        if (rect.bottom > 0 && rect.top < window.innerHeight) anyVisible = true
      })
      setAutoPreview(!anyVisible)
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => { check(); ticking = false })
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    check()
    return () => window.removeEventListener('scroll', onScroll)
  }, [dockOpen, previewMode, setAutoPreview])

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
  const initPersistence = useConfiguratorStore(s => s.initPersistence)

  const registry = useMemo(() => buildSectionRegistry(layouts), [layouts])

  useEffect(() => { initPersistence() }, [])

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
      <StylizeApplier />
      <PreviewModeApplier />
      <HeroShiftApplier />
      <AutoPreviewWatcher />
      <Navbar />
      <div className="site-main">
        <SectionWrapper sectionId="hero">
          <Hero layout={layouts.hero ?? 'center'} />
        </SectionWrapper>
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
          return (
            <SectionWrapper key={id} sectionId={id}>
              <Component {...(entry.props ?? {})} />
            </SectionWrapper>
          )
        })}
        <Footer />
      </div>
      <BackToTop />
    </>
  )
}
