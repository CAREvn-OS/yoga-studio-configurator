import { useEffect, useMemo, useCallback } from 'react'
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

// Maps typography categories to CSS selectors
const TYPO_CATEGORY_SELECTORS: Record<string, string> = {
  headers: '.section-heading, h1, h2, .hero__title',
  subheaders: '.section-eyebrow, h3, h4, .hero__subtitle',
  body: 'p, .about__text, .pricing__desc, li',
  buttons: '.btn, .nav__cta, .btn--primary, .btn--outline',
  captions: 'blockquote, .stat__label, figcaption, small, .testimonial__author',
}

// Font style definitions (must match TypographyPanel)
const FONT_FAMILY_MAP: Record<string, string> = {
  'serene-serif': "'Cormorant Garamond', Georgia, serif",
  'modern-clean': "'Outfit', 'Inter', sans-serif",
  'organic-flow': "'Lora', 'Playfair Display', serif",
  'minimal-sans': "'Jost', 'Nunito Sans', sans-serif",
  'warm-humanist': "'Source Serif 4', 'Libre Baskerville', serif",
  'bold-statement': "'DM Sans', 'Montserrat', sans-serif",
}

// Section registry — maps IDs to components
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

    const mo = new MutationObserver(observe)
    mo.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mo.disconnect()
    }
  }, [])

  return null
}

/**
 * Generate a unique style ID for any element in style mode.
 */
function getStyleIdForElement(el: HTMLElement): string | null {
  if (el.dataset.styleId) return el.dataset.styleId

  const section = el.closest('section, [data-section-id], header, footer, .hero')
  if (!section) return null

  const sectionId = (section as HTMLElement).dataset.sectionId
    || section.id
    || section.className.split(' ')[0]
    || 'unknown'

  const tag = el.tagName.toLowerCase()
  const siblings = el.parentElement ? Array.from(el.parentElement.children).filter(c => c.tagName === el.tagName) : [el]
  const sibIndex = siblings.indexOf(el)

  return `${sectionId}__${tag}${sibIndex > 0 ? sibIndex : ''}`
}

/**
 * Global click handler for style mode.
 */
function StyleModeHandler() {
  const styleMode = useConfiguratorStore(s => s.styleMode)
  const setActiveStyleElement = useConfiguratorStore(s => s.setActiveStyleElement)
  const elementStyles = useConfiguratorStore(s => s.elementStyles)

  const handleStyleClick = useCallback((e: MouseEvent) => {
    if (!styleMode) return

    const target = e.target as HTMLElement

    // Don't intercept configurator UI
    if (target.closest('.cfg-pill, .cfg-dock-wrapper, .cfg-panel-wrapper, .cfg-style-pop, .cfg-toast')) return

    // Find the most specific styleable element
    const el = target.closest('[data-style-id]') as HTMLElement
      ?? target.closest('h1, h2, h3, h4, h5, h6, p, span, a, button, blockquote, li, section, .hero, .media-slot') as HTMLElement

    if (!el) return

    e.preventDefault()
    e.stopPropagation()

    let styleId = el.dataset.styleId
    if (!styleId) {
      styleId = getStyleIdForElement(el)
      if (!styleId) return
      el.dataset.styleId = styleId
    }

    el.classList.add('style-target')
    setActiveStyleElement(styleId)
  }, [styleMode, setActiveStyleElement])

  useEffect(() => {
    if (styleMode) {
      document.addEventListener('click', handleStyleClick, true)
      return () => document.removeEventListener('click', handleStyleClick, true)
    }
  }, [styleMode, handleStyleClick])

  // Apply element styles globally via <style> tag
  useEffect(() => {
    const styleEl = document.getElementById('cfg-element-styles') || (() => {
      const s = document.createElement('style')
      s.id = 'cfg-element-styles'
      document.head.appendChild(s)
      return s
    })()

    const rules = Object.entries(elementStyles).map(([id, style]) => {
      const props: string[] = []
      if (style.color && !style.gradient) props.push(`color: ${style.color} !important`)
      if (style.gradient) {
        props.push(`background: ${style.gradient} !important`)
        props.push(`-webkit-background-clip: text !important`)
        props.push(`-webkit-text-fill-color: transparent !important`)
        props.push(`background-clip: text !important`)
      }
      if (style.fontWeight) props.push(`font-weight: ${style.fontWeight} !important`)
      if (style.animation) {
        const animMap: Record<string, string> = {
          'fade-in': 'fadeIn 0.6s ease both',
          'slide-up': 'slideUp 0.5s ease both',
          'scale-in': 'scaleIn 0.4s ease both',
          'glow-pulse': 'glowPulse 2s ease-in-out infinite',
          'float': 'floatAnim 3s ease-in-out infinite',
        }
        if (animMap[style.animation]) props.push(`animation: ${animMap[style.animation]} !important`)
      }
      if (props.length === 0) return ''
      return `[data-style-id="${id}"] { ${props.join('; ')} }`
    }).filter(Boolean).join('\n')

    styleEl.textContent = `
${rules}

@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
@keyframes scaleIn { from { opacity: 0; transform: scale(0.9) } to { opacity: 1; transform: scale(1) } }
@keyframes glowPulse { 0%, 100% { filter: brightness(1) } 50% { filter: brightness(1.15) drop-shadow(0 0 8px currentColor) } }
@keyframes floatAnim { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
`
  }, [elementStyles])

  return null
}

/**
 * Applies typography category settings as CSS rules.
 */
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

      if (props.length === 0) return ''
      return `${selector} { ${props.join('; ')} }`
    }).filter(Boolean).join('\n')

    styleEl.textContent = rules
  }, [typoCategorySettings])

  return null
}

export default function App() {
  const theme = useConfiguratorStore(s => s.theme)
  const colorOverrides = useConfiguratorStore(s => s.colorOverrides)
  const typographyOverride = useConfiguratorStore(s => s.typographyOverride)
  const layouts = useConfiguratorStore(s => s.layouts)
  const sections = useConfiguratorStore(s => s.sections)
  const sectionOrder = useConfiguratorStore(s => s.sectionOrder)
  const effect = useConfiguratorStore(s => s.effect)
  const copyMode = useConfiguratorStore(s => s.copyMode)
  const styleMode = useConfiguratorStore(s => s.styleMode)

  const registry = useMemo(() => buildSectionRegistry(layouts), [layouts])

  useEffect(() => {
    applyTheme(theme, colorOverrides, typographyOverride)
  }, [theme, colorOverrides, typographyOverride])

  useEffect(() => {
    const cls = effects[effect] ?? ''
    document.body.className = [
      cls,
      copyMode ? 'copy-mode' : '',
      styleMode ? 'style-mode' : '',
    ].filter(Boolean).join(' ')
  }, [effect, copyMode, styleMode])

  return (
    <>
      <ScrollProgress />
      <RevealObserver />
      <StyleModeHandler />
      <TypoCategoryApplier />
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
