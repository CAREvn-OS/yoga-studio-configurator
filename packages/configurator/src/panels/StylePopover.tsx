import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useConfiguratorStore } from '../store/configuratorStore'

const ANIMATION_PRESETS = [
  { id: 'none', name: 'None', preview: '' },
  { id: 'fade-in', name: 'Fade In', preview: 'fadeIn 0.6s ease' },
  { id: 'slide-up', name: 'Slide Up', preview: 'slideUp 0.5s ease' },
  { id: 'scale-in', name: 'Scale In', preview: 'scaleIn 0.4s ease' },
  { id: 'glow-pulse', name: 'Glow Pulse', preview: 'glowPulse 2s ease-in-out infinite' },
  { id: 'float', name: 'Float', preview: 'float 3s ease-in-out infinite' },
]

const GRADIENT_PRESETS = [
  { colors: ['#8B2272', '#A020C0'], name: 'Berry' },
  { colors: ['#E040A0', '#7B2FBE'], name: 'Blossom' },
  { colors: ['#1a1a1a', '#4a4a4a'], name: 'Charcoal' },
  { colors: ['#2c2420', '#9a8470'], name: 'Earth' },
  { colors: ['#c71585', '#ff69b4'], name: 'Rose' },
  { colors: ['#1e3a5f', '#4a90d9'], name: 'Ocean' },
]

type Tab = 'color' | 'weight' | 'animate'

export function StylePopover() {
  const activeStyleElement = useConfiguratorStore(s => s.activeStyleElement)
  const elementStyles = useConfiguratorStore(s => s.elementStyles)
  const setActiveStyleElement = useConfiguratorStore(s => s.setActiveStyleElement)
  const setElementStyle = useConfiguratorStore(s => s.setElementStyle)
  const clearElementStyle = useConfiguratorStore(s => s.clearElementStyle)

  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
  const [visible, setVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('color')
  const [useGradient, setUseGradient] = useState(false)
  const [gradColor1, setGradColor1] = useState('#8B2272')
  const [gradColor2, setGradColor2] = useState('#A020C0')
  const [gradAngle, setGradAngle] = useState(135)
  const popoverRef = useRef<HTMLDivElement>(null)

  const elementId = activeStyleElement
  const currentStyle = elementId ? (elementStyles[elementId] ?? {}) : {}

  // Sync gradient state from current style
  useEffect(() => {
    if (currentStyle.gradient) {
      setUseGradient(true)
      const match = currentStyle.gradient.match(/(\d+)deg,\s*(#[0-9a-fA-F]+),\s*(#[0-9a-fA-F]+)/)
      if (match) {
        setGradAngle(Number(match[1]))
        setGradColor1(match[2])
        setGradColor2(match[3])
      }
    } else {
      setUseGradient(false)
    }
  }, [elementId]) // eslint-disable-line react-hooks/exhaustive-deps

  // Position near the active element
  useEffect(() => {
    if (!elementId) {
      setVisible(false)
      return
    }
    const el = document.querySelector(`[data-style-id="${elementId}"]`) as HTMLElement | null
    if (!el) {
      setVisible(false)
      return
    }
    const rect = el.getBoundingClientRect()
    const popoverWidth = 280
    const popoverHeight = 360

    let top = rect.bottom + 10
    let left = rect.left + rect.width / 2 - popoverWidth / 2
    if (left < 12) left = 12
    if (left + popoverWidth > window.innerWidth - 12) left = window.innerWidth - popoverWidth - 12
    if (top + popoverHeight > window.innerHeight - 12) top = rect.top - popoverHeight - 10
    if (top < 12) top = 12

    setPosition({ top, left })
    setActiveTab('color')
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true))
    })
  }, [elementId])

  // Close on outside click
  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (!popoverRef.current) return
      if (popoverRef.current.contains(e.target as Node)) return
      const target = e.target as HTMLElement
      if (target.closest('[data-style-id]')) return
      setActiveStyleElement(null)
    },
    [setActiveStyleElement]
  )

  useEffect(() => {
    if (elementId) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [elementId, handleClickOutside])

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveStyleElement(null)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [setActiveStyleElement])

  if (!elementId || !position) return null

  const handleSolidColor = (color: string) => {
    setElementStyle(elementId, { color, gradient: undefined })
    setUseGradient(false)
  }

  const applyGradient = (c1: string, c2: string, angle: number) => {
    const grad = `linear-gradient(${angle}deg, ${c1}, ${c2})`
    setElementStyle(elementId, { gradient: grad, color: undefined })
  }

  const handleGradColor1 = (c: string) => {
    setGradColor1(c)
    applyGradient(c, gradColor2, gradAngle)
  }

  const handleGradColor2 = (c: string) => {
    setGradColor2(c)
    applyGradient(gradColor1, c, gradAngle)
  }

  const handleGradAngle = (a: number) => {
    setGradAngle(a)
    applyGradient(gradColor1, gradColor2, a)
  }

  const handleGradPreset = (colors: string[]) => {
    setGradColor1(colors[0])
    setGradColor2(colors[1])
    applyGradient(colors[0], colors[1], gradAngle)
    setUseGradient(true)
  }

  const handleWeightChange = (fontWeight: number) => {
    setElementStyle(elementId, { fontWeight })
  }

  const handleAnimChange = (animation: string) => {
    setElementStyle(elementId, { animation: animation === 'none' ? undefined : animation })
  }

  const handleReset = () => {
    clearElementStyle(elementId)
    setUseGradient(false)
  }

  const handleClose = () => {
    setActiveStyleElement(null)
  }

  const tabs: { id: Tab; label: string; icon: JSX.Element }[] = [
    {
      id: 'color',
      label: 'Color',
      icon: (
        <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="8" cy="8" r="6" />
          <path d="M8 2a6 6 0 0 1 0 12" fill="currentColor" opacity="0.3" />
        </svg>
      ),
    },
    {
      id: 'weight',
      label: 'Weight',
      icon: (
        <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5">
          <text x="2" y="13" fontSize="13" fontWeight="bold" fill="currentColor" stroke="none">B</text>
        </svg>
      ),
    },
    {
      id: 'animate',
      label: 'Animate',
      icon: (
        <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 8h2l2-4 2 8 2-4h2" />
        </svg>
      ),
    },
  ]

  return createPortal(
    <div
      ref={popoverRef}
      className={`cfg-style-pop ${visible ? 'cfg-style-pop--visible' : ''}`}
      style={{ top: position.top, left: position.left }}
    >
      {/* Header */}
      <div className="cfg-style-pop__header">
        <div className="cfg-style-pop__tabs">
          {tabs.map(t => (
            <button
              key={t.id}
              className={`cfg-style-pop__tab ${activeTab === t.id ? 'cfg-style-pop__tab--active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>
        <button className="cfg-style-pop__close" onClick={handleClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Color Tab */}
      {activeTab === 'color' && (
        <div className="cfg-style-pop__body">
          {/* Solid / Gradient toggle */}
          <div className="cfg-style-pop__mode-toggle">
            <button
              className={`cfg-style-pop__mode-btn ${!useGradient ? 'cfg-style-pop__mode-btn--active' : ''}`}
              onClick={() => { setUseGradient(false); if (currentStyle.gradient) handleSolidColor(gradColor1) }}
            >
              Solid
            </button>
            <button
              className={`cfg-style-pop__mode-btn ${useGradient ? 'cfg-style-pop__mode-btn--active' : ''}`}
              onClick={() => { setUseGradient(true); applyGradient(gradColor1, gradColor2, gradAngle) }}
            >
              Gradient
            </button>
          </div>

          {!useGradient ? (
            /* Solid color picker */
            <div className="cfg-style-pop__color-section">
              <div className="cfg-style-pop__color-preview" style={{ background: currentStyle.color ?? 'var(--color-ink)' }} />
              <input
                type="color"
                className="cfg-style-pop__color-input"
                value={currentStyle.color ?? '#1a1a1a'}
                onChange={e => handleSolidColor(e.target.value)}
              />
              <span className="cfg-style-pop__color-hex">{currentStyle.color ?? 'inherit'}</span>
            </div>
          ) : (
            /* Gradient editor */
            <div className="cfg-style-pop__gradient-section">
              <div
                className="cfg-style-pop__gradient-preview"
                style={{ background: `linear-gradient(${gradAngle}deg, ${gradColor1}, ${gradColor2})` }}
              />
              <div className="cfg-style-pop__gradient-controls">
                <div className="cfg-style-pop__grad-stop">
                  <input type="color" value={gradColor1} onChange={e => handleGradColor1(e.target.value)} />
                  <span>{gradColor1}</span>
                </div>
                <div className="cfg-style-pop__grad-stop">
                  <input type="color" value={gradColor2} onChange={e => handleGradColor2(e.target.value)} />
                  <span>{gradColor2}</span>
                </div>
              </div>
              <div className="cfg-style-pop__angle-row">
                <label>Angle</label>
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={gradAngle}
                  onChange={e => handleGradAngle(Number(e.target.value))}
                  className="cfg-style-pop__slider"
                />
                <span>{gradAngle}°</span>
              </div>
              <div className="cfg-style-pop__grad-presets">
                {GRADIENT_PRESETS.map(p => (
                  <button
                    key={p.name}
                    className="cfg-style-pop__grad-chip"
                    style={{ background: `linear-gradient(135deg, ${p.colors[0]}, ${p.colors[1]})` }}
                    onClick={() => handleGradPreset(p.colors)}
                    title={p.name}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Weight Tab */}
      {activeTab === 'weight' && (
        <div className="cfg-style-pop__body">
          <div className="cfg-style-pop__weight-preview" style={{ fontWeight: currentStyle.fontWeight ?? 400 }}>
            Aa Bb Cc
          </div>
          <div className="cfg-style-pop__weight-value">{currentStyle.fontWeight ?? 400}</div>
          <input
            type="range"
            min={100}
            max={900}
            step={100}
            value={currentStyle.fontWeight ?? 400}
            onChange={e => handleWeightChange(Number(e.target.value))}
            className="cfg-style-pop__slider"
          />
          <div className="cfg-style-pop__weight-labels">
            <span>Thin</span>
            <span>Light</span>
            <span>Regular</span>
            <span>Medium</span>
            <span>Bold</span>
            <span>Black</span>
          </div>
        </div>
      )}

      {/* Animate Tab */}
      {activeTab === 'animate' && (
        <div className="cfg-style-pop__body">
          <div className="cfg-style-pop__anim-list">
            {ANIMATION_PRESETS.map(a => (
              <button
                key={a.id}
                className={`cfg-style-pop__anim-btn ${
                  (currentStyle.animation ?? 'none') === a.id || (!currentStyle.animation && a.id === 'none')
                    ? 'cfg-style-pop__anim-btn--active'
                    : ''
                }`}
                onClick={() => handleAnimChange(a.id)}
              >
                <span className="cfg-style-pop__anim-name">{a.name}</span>
                {a.id !== 'none' && (
                  <span className="cfg-style-pop__anim-dot" style={{ animation: a.preview }} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="cfg-style-pop__footer">
        <button className="cfg-style-pop__reset" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>,
    document.body
  )
}
