import { useEffect } from 'react'
import { useConfiguratorStore } from '@care/configurator'
import { allCopyVi, allCopyEn } from '@care/copy-content'
import { themes } from '@care/theme-engine'

const BASE_URL = 'https://carevn-os.github.io/yoga-studio-configurator/'
const OG_DEFAULT = `${BASE_URL}og-default.svg`

/** Create or update a <meta> tag. */
function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

/** Create or update <script type="application/ld+json" id="seo-jsonld">. */
function setJsonLd(data: object) {
  let el = document.getElementById('seo-jsonld') as HTMLScriptElement | null
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = 'seo-jsonld'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

/** Resolve copy text for a given element ID. */
function getCopyText(
  id: string,
  language: 'vi' | 'en',
  copySelections: Record<string, number>,
  customCopy: Record<string, string>,
): string {
  if (customCopy[id]) return customCopy[id]
  const pool = language === 'vi' ? allCopyVi : allCopyEn
  const alts = pool[id]
  if (!alts || alts.length === 0) return ''
  const idx = copySelections[id] ?? 0
  return alts[idx] ?? alts[0] ?? ''
}

/**
 * HeadManager — null-rendering "Applier" component.
 * Subscribes to store and applies SEO-related DOM side effects:
 * - <html lang>
 * - document.title
 * - Meta description, theme-color
 * - OG + Twitter Card tags
 * - JSON-LD structured data (HealthClub + FAQPage when FAQ enabled)
 */
export function HeadManager() {
  const language = useConfiguratorStore(s => s.language)
  const theme = useConfiguratorStore(s => s.theme)
  const colorOverrides = useConfiguratorStore(s => s.colorOverrides)
  const copySelections = useConfiguratorStore(s => s.copySelections)
  const customCopy = useConfiguratorStore(s => s.customCopy)
  const seoOverrides = useConfiguratorStore(s => s.seoOverrides)
  const heroMedia = useConfiguratorStore(s => s.mediaUploads['hero-bg'])
  const sections = useConfiguratorStore(s => s.sections)
  const sectionItems = useConfiguratorStore(s => s.sectionItems)

  useEffect(() => {
    // ── 1. <html lang> ──
    document.documentElement.lang = language

    // ── 2. Derive studio name & description ──
    const studioName = seoOverrides.studioName || getCopyText('hero-eyebrow', language, copySelections, customCopy) || 'Yoga & Pilates Studio'
    const description = seoOverrides.description || getCopyText('hero-sub', language, copySelections, customCopy) || ''
    const truncDesc = description.slice(0, 160)
    const city = seoOverrides.city || ''

    // ── 3. document.title ──
    document.title = `${studioName} — Yoga & Pilates`

    // ── 4. Meta description ──
    setMeta('name', 'description', truncDesc)

    // ── 5. Theme-color ──
    const themeDef = themes[theme]
    const accentColor = (colorOverrides as any)?.accent ?? themeDef?.colors.accent ?? '#9a8470'
    setMeta('name', 'theme-color', accentColor)

    // ── 6. OG tags ──
    const ogImage = heroMedia?.remoteUrl ?? OG_DEFAULT
    const locale = language === 'vi' ? 'vi_VN' : 'en_US'
    const localeAlt = language === 'vi' ? 'en_US' : 'vi_VN'

    setMeta('property', 'og:title', studioName)
    setMeta('property', 'og:description', truncDesc)
    setMeta('property', 'og:image', ogImage)
    setMeta('property', 'og:url', BASE_URL)
    setMeta('property', 'og:locale', locale)
    setMeta('property', 'og:locale:alternate', localeAlt)

    // ── 7. Twitter Card tags ──
    setMeta('name', 'twitter:title', studioName)
    setMeta('name', 'twitter:description', truncDesc)
    setMeta('name', 'twitter:image', ogImage)

    // ── 8. JSON-LD structured data ──
    const graph: object[] = []

    // HealthClub schema
    const healthClub: Record<string, any> = {
      '@type': 'HealthClub',
      name: studioName,
      description: truncDesc,
      url: BASE_URL,
    }
    if (ogImage !== OG_DEFAULT) healthClub.image = ogImage
    if (city) healthClub.address = { '@type': 'PostalAddress', addressLocality: city }
    graph.push(healthClub)

    // FAQPage schema (when FAQ section is enabled)
    if (sections.faq) {
      const faqCount = sectionItems.faq ?? 4
      const faqEntries: { '@type': string; name: string; acceptedAnswer: { '@type': string; text: string } }[] = []
      for (let i = 1; i <= faqCount; i++) {
        const q = getCopyText(`faq-${i}-q`, language, copySelections, customCopy)
        const a = getCopyText(`faq-${i}-a`, language, copySelections, customCopy)
        if (q && a) {
          faqEntries.push({
            '@type': 'Question',
            name: q,
            acceptedAnswer: { '@type': 'Answer', text: a },
          })
        }
      }
      if (faqEntries.length > 0) {
        graph.push({
          '@type': 'FAQPage',
          mainEntity: faqEntries,
        })
      }
    }

    setJsonLd({
      '@context': 'https://schema.org',
      '@graph': graph,
    })
  }, [language, theme, colorOverrides, copySelections, customCopy, seoOverrides, heroMedia, sections, sectionItems])

  return null
}
