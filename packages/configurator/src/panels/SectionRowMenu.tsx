import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useConfiguratorStore } from '../store/configuratorStore'
import { SECTION_ITEM_CONFIGS } from '@care/shared-types'
import { BUTTON_STYLES, CARD_STYLES, GRADIENT_TYPES } from './ThemePanel'
import { ct } from '../i18n/cfgStrings'

/* ── Layout options per section ── */
const LAYOUT_OPTIONS: Record<string, { id: string; labelKey: string }[]> = {
  hero: [
    { id: 'center', labelKey: 'lo.center' },
    { id: 'left', labelKey: 'lo.left' },
    { id: 'split', labelKey: 'lo.split' },
  ],
  about: [
    { id: 'photo-left', labelKey: 'lo.photo-left' },
    { id: 'photo-right', labelKey: 'lo.photo-right' },
    { id: 'stacked', labelKey: 'lo.stacked' },
  ],
  schedule: [
    { id: 'grid', labelKey: 'lo.grid' },
    { id: 'list', labelKey: 'lo.list' },
    { id: 'cards', labelKey: 'lo.cards' },
  ],
  instructors: [
    { id: 'grid', labelKey: 'lo.grid' },
    { id: 'duo', labelKey: 'lo.duo' },
    { id: 'scroll', labelKey: 'lo.scroll' },
  ],
  pricing: [
    { id: 'cards', labelKey: 'lo.cards' },
    { id: 'table', labelKey: 'lo.table' },
    { id: 'stacked', labelKey: 'lo.stacked' },
  ],
}

const OPTIONAL_SECTIONS = new Set([
  'manifesto', 'process', 'studioTour', 'events', 'blog', 'partners', 'socialMedia', 'faq',
])

/* ── Tab icon SVGs ── */
const TabIcons = {
  layout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  ),
  style: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="10.5" r="2.5" /><circle cx="8.5" cy="7.5" r="2.5" /><circle cx="6.5" cy="12.5" r="2.5" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  ),
  items: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  order: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="18 15 12 9 6 15" /><polyline points="6 9 12 15 18 9" transform="translate(0,10)" />
    </svg>
  ),
  toggle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
}

/* ── Component ── */
export function SectionRowMenu() {
  const sectionId = useConfiguratorStore(s => s.activeSectionBlob)
  const setActiveSectionBlob = useConfiguratorStore(s => s.setActiveSectionBlob)
  const activeRowCategory = useConfiguratorStore(s => s.activeRowCategory)
  const setActiveRowCategory = useConfiguratorStore(s => s.setActiveRowCategory)
  const language = useConfiguratorStore(s => s.language)

  // Layout
  const layouts = useConfiguratorStore(s => s.layouts)
  const setLayout = useConfiguratorStore(s => s.setLayout)

  // Style
  const borderRadiusOverride = useConfiguratorStore(s => s.borderRadiusOverride)
  const setBorderRadiusOverride = useConfiguratorStore(s => s.setBorderRadiusOverride)
  const buttonStyle = useConfiguratorStore(s => s.buttonStyle)
  const setButtonStyle = useConfiguratorStore(s => s.setButtonStyle)
  const cardStyle = useConfiguratorStore(s => s.cardStyle)
  const setCardStyle = useConfiguratorStore(s => s.setCardStyle)
  const gradientSettings = useConfiguratorStore(s => s.gradientSettings)
  const setGradientSettings = useConfiguratorStore(s => s.setGradientSettings)

  // Items
  const sectionItems = useConfiguratorStore(s => s.sectionItems)
  const addSectionItem = useConfiguratorStore(s => s.addSectionItem)
  const removeSectionItem = useConfiguratorStore(s => s.removeSectionItem)

  // Order / Toggle
  const sectionOrder = useConfiguratorStore(s => s.sectionOrder)
  const sections = useConfiguratorStore(s => s.sections)
  const toggleSection = useConfiguratorStore(s => s.toggleSection)
  const moveSectionOrder = useConfiguratorStore(s => s.moveSectionOrder)

  const menuRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)

  // Position near the slimed-up blob
  useEffect(() => {
    if (!sectionId) return
    const el = document.querySelector(`[data-section-id="${sectionId}"]`)
    if (!el) return
    const rect = el.getBoundingClientRect()
    const scrollY = window.scrollY
    // Row menu sits at the top of the section (where blob slimed to), offset to the right of blob
    setPos({
      top: rect.top + scrollY - 18,
      left: Math.max(12, rect.left + 50),
    })
  }, [sectionId])

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveSectionBlob(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [setActiveSectionBlob])

  // Close on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current) return
      const target = e.target as HTMLElement
      if (target.closest('.cfg-mini-blob')) return
      if (!menuRef.current.contains(target)) setActiveSectionBlob(null)
    }
    window.addEventListener('mousedown', onClick)
    return () => window.removeEventListener('mousedown', onClick)
  }, [setActiveSectionBlob])

  if (!sectionId || !pos) return null

  const layoutOpts = LAYOUT_OPTIONS[sectionId]
  const currentLayout = layouts[sectionId] ?? layoutOpts?.[0]?.id
  const isOptional = OPTIONAL_SECTIONS.has(sectionId)
  const isOn = isOptional ? (sections[sectionId] ?? true) : true
  const itemCfg = SECTION_ITEM_CONFIGS[sectionId]
  const itemCount = itemCfg ? (sectionItems[sectionId] ?? itemCfg.default) : null
  const sectionIndex = sectionOrder.indexOf(sectionId)
  const canMoveUp = sectionIndex > 0
  const canMoveDown = sectionIndex >= 0 && sectionIndex < sectionOrder.length - 1

  const toggleCat = (cat: string) => setActiveRowCategory(activeRowCategory === cat ? null : cat)

  /* ── Tabs ── */
  const tabs: { id: string; icon: JSX.Element; labelKey: string }[] = []
  if (layoutOpts) tabs.push({ id: 'layout', icon: TabIcons.layout, labelKey: 'cat.layout' })
  tabs.push({ id: 'style', icon: TabIcons.style, labelKey: 'cat.style' })
  if (itemCfg && isOn) tabs.push({ id: 'items', icon: TabIcons.items, labelKey: 'cat.items' })
  if (sectionId !== 'hero' && sectionIndex >= 0) tabs.push({ id: 'order', icon: TabIcons.order, labelKey: 'cat.order' })
  if (isOptional) tabs.push({ id: 'toggle', icon: TabIcons.toggle, labelKey: 'cat.toggle' })

  /* ── Content renderers ── */
  const renderContent = () => {
    switch (activeRowCategory) {
      case 'layout':
        if (!layoutOpts) return null
        return (
          <div className="cfg-row-menu__content">
            {layoutOpts.map(opt => (
              <button
                key={opt.id}
                className={`cfg-typo-chip cfg-typo-chip--sm ${currentLayout === opt.id ? 'cfg-typo-chip--active' : ''}`}
                onClick={() => setLayout(sectionId, opt.id)}
              >
                {ct(language, opt.labelKey)}
              </button>
            ))}
          </div>
        )

      case 'style':
        return (
          <div className="cfg-row-menu__content">
            {/* Corners */}
            <span className="cfg-row-menu__label">{ct(language, 'style.corners')}</span>
            <div className="cfg-row-menu__slider">
              <input
                type="range" min="0" max="24" step="2"
                value={borderRadiusOverride ?? 8}
                onChange={e => setBorderRadiusOverride(Number(e.target.value))}
                className="cfg-vibe-slider cfg-vibe-slider--sm"
                style={{ width: 60 }}
              />
              <span className="cfg-row-menu__slider-val">{borderRadiusOverride ?? 8}px</span>
            </div>

            {/* Buttons */}
            <span className="cfg-row-menu__label">{ct(language, 'style.buttons')}</span>
            <div className="cfg-row-menu__chips">
              {BUTTON_STYLES.map(s => (
                <button key={s.id}
                  className={`cfg-typo-chip cfg-typo-chip--sm ${buttonStyle === s.id ? 'cfg-typo-chip--active' : ''}`}
                  onClick={() => setButtonStyle(s.id)}
                >{ct(language, `chip.${s.id}`)}</button>
              ))}
            </div>

            {/* Cards */}
            <span className="cfg-row-menu__label">{ct(language, 'style.cards')}</span>
            <div className="cfg-row-menu__chips">
              {CARD_STYLES.map(s => (
                <button key={s.id}
                  className={`cfg-typo-chip cfg-typo-chip--sm ${cardStyle === s.id ? 'cfg-typo-chip--active' : ''}`}
                  onClick={() => setCardStyle(s.id)}
                >{ct(language, `chip.${s.id}`)}</button>
              ))}
            </div>

            {/* Gradient */}
            <span className="cfg-row-menu__label">{ct(language, 'style.gradient')}</span>
            <div className="cfg-row-menu__chips">
              {GRADIENT_TYPES.map(g => (
                <button key={g.id}
                  className={`cfg-typo-chip cfg-typo-chip--sm ${gradientSettings.type === g.id ? 'cfg-typo-chip--active' : ''}`}
                  onClick={() => setGradientSettings({ type: g.id })}
                >{ct(language, `chip.${g.id}`)}</button>
              ))}
            </div>
            {gradientSettings.type !== 'none' && (
              <div className="cfg-row-menu__color-pair">
                <input type="color" value={gradientSettings.colors[0]}
                  onChange={e => setGradientSettings({ colors: [e.target.value, gradientSettings.colors[1]] })}
                  className="cfg-typo-level__color-picker" />
                <input type="color" value={gradientSettings.colors[1]}
                  onChange={e => setGradientSettings({ colors: [gradientSettings.colors[0], e.target.value] })}
                  className="cfg-typo-level__color-picker" />
              </div>
            )}
          </div>
        )

      case 'items':
        if (!itemCfg) return null
        return (
          <div className="cfg-row-menu__content">
            <div className="cfg-row-menu__items">
              <button className="cfg-item-btn" onClick={() => removeSectionItem(sectionId)}
                disabled={itemCount! <= itemCfg.min}>
                <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2.5" fill="none">
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
              <span className="cfg-item-count">
                {itemCount} {itemCount === 1 ? itemCfg.label : itemCfg.labelPlural}
              </span>
              <button className="cfg-item-btn" onClick={() => addSectionItem(sectionId)}
                disabled={itemCount! >= itemCfg.max}>
                <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2.5" fill="none">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            </div>
          </div>
        )

      case 'order':
        return (
          <div className="cfg-row-menu__content">
            <button className="cfg-row-menu__move-btn" onClick={() => canMoveUp && moveSectionOrder(sectionIndex, sectionIndex - 1)} disabled={!canMoveUp}>
              <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round">
                <polyline points="18 15 12 9 6 15" />
              </svg>
              {ct(language, 'order.up')}
            </button>
            <button className="cfg-row-menu__move-btn" onClick={() => canMoveDown && moveSectionOrder(sectionIndex, sectionIndex + 1)} disabled={!canMoveDown}>
              <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
              {ct(language, 'order.down')}
            </button>
          </div>
        )

      case 'toggle':
        return (
          <div className="cfg-row-menu__content">
            <div className="cfg-row-menu__toggle-row">
              <span className="cfg-row-menu__label">{ct(language, 'cat.toggle')}</span>
              <button
                className={`cfg-toggle ${isOn ? 'cfg-toggle--on' : ''}`}
                onClick={() => toggleSection(sectionId)}
                role="switch" aria-checked={isOn}
              >
                <span className="cfg-toggle__knob" />
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const menu = (
    <div ref={menuRef} className="cfg-row-menu" style={{ top: pos.top, left: pos.left }}>
      {/* Tabs */}
      <div className="cfg-row-menu__tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`cfg-row-menu__tab ${activeRowCategory === tab.id ? 'cfg-row-menu__tab--active' : ''}`}
            onClick={() => toggleCat(tab.id)}
            aria-label={ct(language, tab.labelKey)}
            title={ct(language, tab.labelKey)}
          >
            {tab.icon}
          </button>
        ))}
      </div>

      {/* Divider + Content (only when a tab is active) */}
      {activeRowCategory && (
        <>
          <div className="cfg-row-menu__divider" />
          {renderContent()}
        </>
      )}

      {/* Close */}
      <button className="cfg-row-menu__close" onClick={() => setActiveSectionBlob(null)} aria-label="Close">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )

  return createPortal(menu, document.body)
}
