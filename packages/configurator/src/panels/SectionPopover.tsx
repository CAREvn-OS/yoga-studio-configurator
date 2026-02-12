import { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useConfiguratorStore } from '../store/configuratorStore'
import { SECTION_ITEM_CONFIGS } from '@care/shared-types'
import type { ButtonStyle, CardStyle, GradientType } from '@care/shared-types'
import { BUTTON_STYLES, CARD_STYLES, GRADIENT_TYPES } from './ThemePanel'

/* ── constants ── */

const LAYOUT_OPTIONS: Record<string, { id: string; name: string }[]> = {
  hero: [
    { id: 'center', name: 'Center' },
    { id: 'left', name: 'Left' },
    { id: 'split', name: 'Split' },
  ],
  about: [
    { id: 'photo-left', name: 'Photo Left' },
    { id: 'photo-right', name: 'Photo Right' },
    { id: 'stacked', name: 'Stacked' },
  ],
  schedule: [
    { id: 'grid', name: 'Grid' },
    { id: 'list', name: 'List' },
    { id: 'cards', name: 'Cards' },
  ],
  instructors: [
    { id: 'grid', name: 'Grid' },
    { id: 'duo', name: 'Duo' },
    { id: 'scroll', name: 'Scroll' },
  ],
  pricing: [
    { id: 'cards', name: 'Cards' },
    { id: 'table', name: 'Table' },
    { id: 'stacked', name: 'Stacked' },
  ],
}

const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero',
  about: 'About',
  manifesto: 'Manifesto',
  schedule: 'Schedule',
  process: 'Your Journey',
  instructors: 'Instructors',
  pricing: 'Pricing',
  studioTour: 'Studio Tour',
  testimonials: 'Testimonials',
  events: 'Events',
  blog: 'Blog',
  partners: 'Partners',
  socialMedia: 'Social Media',
  faq: 'FAQ',
  contact: 'Contact',
}

const OPTIONAL_SECTIONS = new Set([
  'manifesto', 'process', 'studioTour', 'events', 'blog', 'partners', 'socialMedia', 'faq',
])

/* ── component ── */

export function SectionPopover() {
  const activeSectionBlob = useConfiguratorStore(s => s.activeSectionBlob)
  const setActiveSectionBlob = useConfiguratorStore(s => s.setActiveSectionBlob)

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

  // Section items
  const sectionItems = useConfiguratorStore(s => s.sectionItems)
  const addSectionItem = useConfiguratorStore(s => s.addSectionItem)
  const removeSectionItem = useConfiguratorStore(s => s.removeSectionItem)

  // Section order / toggle
  const sectionOrder = useConfiguratorStore(s => s.sectionOrder)
  const sections = useConfiguratorStore(s => s.sections)
  const toggleSection = useConfiguratorStore(s => s.toggleSection)
  const moveSectionOrder = useConfiguratorStore(s => s.moveSectionOrder)

  // Theme info for border radius default
  const theme = useConfiguratorStore(s => s.theme)

  const popoverRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const [styleExpanded, setStyleExpanded] = useState(false)

  const sectionId = activeSectionBlob

  // Position near the mini-blob
  useEffect(() => {
    if (!sectionId) return
    const el = document.querySelector(`[data-section-id="${sectionId}"]`)
    if (!el) return
    const rect = el.getBoundingClientRect()
    const scrollY = window.scrollY
    setPos({
      top: rect.top + scrollY + 48,
      left: Math.max(12, rect.left + 12),
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
      if (!popoverRef.current) return
      const target = e.target as HTMLElement
      // Don't close if clicking the mini-blob itself
      if (target.closest('.cfg-mini-blob')) return
      if (!popoverRef.current.contains(target)) {
        setActiveSectionBlob(null)
      }
    }
    window.addEventListener('mousedown', onClick)
    return () => window.removeEventListener('mousedown', onClick)
  }, [setActiveSectionBlob])

  if (!sectionId || !pos) return null

  const label = SECTION_LABELS[sectionId] ?? sectionId
  const layoutOpts = LAYOUT_OPTIONS[sectionId]
  const currentLayout = layouts[sectionId] ?? layoutOpts?.[0]?.id
  const isOptional = OPTIONAL_SECTIONS.has(sectionId)
  const isOn = isOptional ? (sections[sectionId] ?? true) : true
  const itemCfg = SECTION_ITEM_CONFIGS[sectionId]
  const itemCount = itemCfg ? (sectionItems[sectionId] ?? itemCfg.default) : null

  // Section index for move up/down (hero is not in sectionOrder)
  const sectionIndex = sectionOrder.indexOf(sectionId)
  const canMoveUp = sectionIndex > 0
  const canMoveDown = sectionIndex >= 0 && sectionIndex < sectionOrder.length - 1

  const handleMoveUp = () => {
    if (canMoveUp) moveSectionOrder(sectionIndex, sectionIndex - 1)
  }
  const handleMoveDown = () => {
    if (canMoveDown) moveSectionOrder(sectionIndex, sectionIndex + 1)
  }

  const popover = (
    <div
      ref={popoverRef}
      className="cfg-section-popover"
      style={{ top: pos.top, left: pos.left }}
    >
      {/* Header */}
      <div className="cfg-section-popover__header">
        <span className="cfg-section-popover__title">{label}</span>
        <button
          className="cfg-section-popover__close"
          onClick={() => setActiveSectionBlob(null)}
          aria-label="Close"
        >
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Layout variants */}
      {layoutOpts && (
        <div className="cfg-section-popover__group">
          <div className="cfg-section-popover__label">Layout</div>
          <div className="cfg-section-popover__chips">
            {layoutOpts.map(opt => (
              <button
                key={opt.id}
                className={`cfg-typo-chip cfg-typo-chip--sm ${currentLayout === opt.id ? 'cfg-typo-chip--active' : ''}`}
                onClick={() => setLayout(sectionId, opt.id)}
              >
                {opt.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Style controls (expandable) */}
      <div className="cfg-section-popover__group">
        <button
          className="cfg-section-popover__expand-btn"
          onClick={() => setStyleExpanded(!styleExpanded)}
        >
          <span>Style</span>
          <svg
            viewBox="0 0 24 24" width="12" height="12"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            style={{ transform: styleExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {styleExpanded && (
          <div className="cfg-section-popover__style-body">
            {/* Border Radius */}
            <div className="cfg-section-popover__slider-row">
              <span className="cfg-section-popover__slider-label">Corners</span>
              <input
                type="range"
                min="0" max="24" step="2"
                value={borderRadiusOverride ?? 8}
                onChange={e => setBorderRadiusOverride(Number(e.target.value))}
                className="cfg-vibe-slider cfg-vibe-slider--sm"
              />
              <span className="cfg-section-popover__slider-value">{borderRadiusOverride ?? 8}px</span>
            </div>

            {/* Button Style */}
            <div className="cfg-section-popover__sub">
              <span className="cfg-section-popover__slider-label">Buttons</span>
              <div className="cfg-section-popover__chips">
                {BUTTON_STYLES.map(s => (
                  <button
                    key={s.id}
                    className={`cfg-typo-chip cfg-typo-chip--sm ${buttonStyle === s.id ? 'cfg-typo-chip--active' : ''}`}
                    onClick={() => setButtonStyle(s.id)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Card Style */}
            <div className="cfg-section-popover__sub">
              <span className="cfg-section-popover__slider-label">Cards</span>
              <div className="cfg-section-popover__chips">
                {CARD_STYLES.map(s => (
                  <button
                    key={s.id}
                    className={`cfg-typo-chip cfg-typo-chip--sm ${cardStyle === s.id ? 'cfg-typo-chip--active' : ''}`}
                    onClick={() => setCardStyle(s.id)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Gradient */}
            <div className="cfg-section-popover__sub">
              <span className="cfg-section-popover__slider-label">Gradient</span>
              <div className="cfg-section-popover__chips">
                {GRADIENT_TYPES.map(g => (
                  <button
                    key={g.id}
                    className={`cfg-typo-chip cfg-typo-chip--sm ${gradientSettings.type === g.id ? 'cfg-typo-chip--active' : ''}`}
                    onClick={() => setGradientSettings({ type: g.id })}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
              {gradientSettings.type !== 'none' && (
                <div className="cfg-section-popover__color-row">
                  <input
                    type="color"
                    value={gradientSettings.colors[0]}
                    onChange={e => setGradientSettings({ colors: [e.target.value, gradientSettings.colors[1]] })}
                    className="cfg-typo-level__color-picker"
                  />
                  <input
                    type="color"
                    value={gradientSettings.colors[1]}
                    onChange={e => setGradientSettings({ colors: [gradientSettings.colors[0], e.target.value] })}
                    className="cfg-typo-level__color-picker"
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Item count (if applicable) */}
      {itemCfg && isOn && (
        <div className="cfg-section-popover__group">
          <div className="cfg-section-popover__label">Items</div>
          <div className="cfg-section-popover__items-row">
            <button
              className="cfg-item-btn"
              onClick={() => removeSectionItem(sectionId)}
              disabled={itemCount! <= itemCfg.min}
              aria-label={`Remove ${itemCfg.label}`}
            >
              <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2.5" fill="none">
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            <span className="cfg-item-count">
              {itemCount} {itemCount === 1 ? itemCfg.label : itemCfg.labelPlural}
            </span>
            <button
              className="cfg-item-btn"
              onClick={() => addSectionItem(sectionId)}
              disabled={itemCount! >= itemCfg.max}
              aria-label={`Add ${itemCfg.label}`}
            >
              <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2.5" fill="none">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Reorder (not for hero) */}
      {sectionId !== 'hero' && sectionIndex >= 0 && (
        <div className="cfg-section-popover__group">
          <div className="cfg-section-popover__label">Order</div>
          <div className="cfg-section-popover__order-row">
            <button
              className="cfg-section-popover__move-btn"
              onClick={handleMoveUp}
              disabled={!canMoveUp}
              aria-label="Move up"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round">
                <polyline points="18 15 12 9 6 15" />
              </svg>
              Up
            </button>
            <button
              className="cfg-section-popover__move-btn"
              onClick={handleMoveDown}
              disabled={!canMoveDown}
              aria-label="Move down"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
              Down
            </button>
          </div>
        </div>
      )}

      {/* Toggle on/off (optional sections only) */}
      {isOptional && (
        <div className="cfg-section-popover__group cfg-section-popover__toggle-row">
          <span className="cfg-section-popover__label">Visible</span>
          <button
            className={`cfg-toggle ${isOn ? 'cfg-toggle--on' : ''}`}
            onClick={() => toggleSection(sectionId)}
            role="switch"
            aria-checked={isOn}
            aria-label={`Toggle ${label}`}
          >
            <span className="cfg-toggle__knob" />
          </button>
        </div>
      )}
    </div>
  )

  return createPortal(popover, document.body)
}
