import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useConfiguratorStore } from '../store/configuratorStore'
import { ct } from '../i18n/cfgStrings'

interface TutorialStepDef {
  targetSelector: string
  titleKey: string
  descKey: string
  position: 'top' | 'bottom' | 'left' | 'right'
  onEnter?: () => void
}

export function Tutorial() {
  const tutorialStep = useConfiguratorStore(s => s.tutorialStep)
  const setTutorialStep = useConfiguratorStore(s => s.setTutorialStep)
  const completeTutorial = useConfiguratorStore(s => s.completeTutorial)
  const tutorialComplete = useConfiguratorStore(s => s.tutorialComplete)
  const toggleDock = useConfiguratorStore(s => s.toggleDock)
  const dockOpen = useConfiguratorStore(s => s.dockOpen)
  const language = useConfiguratorStore(s => s.language)

  const [spotRect, setSpotRect] = useState<DOMRect | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })

  const STEPS: TutorialStepDef[] = [
    {
      targetSelector: '.cfg-pill',
      titleKey: 'tut.step1.title',
      descKey: 'tut.step1.desc',
      position: 'left',
    },
    {
      targetSelector: '.cfg-dock',
      titleKey: 'tut.step2.title',
      descKey: 'tut.step2.desc',
      position: 'top',
      onEnter: () => { if (!dockOpen) toggleDock() },
    },
    {
      targetSelector: '.cfg-mini-blob',
      titleKey: 'tut.step3.title',
      descKey: 'tut.step3.desc',
      position: 'right',
      onEnter: () => {
        // Scroll first mini-blob into view
        const blob = document.querySelector('.cfg-mini-blob')
        if (blob) blob.scrollIntoView({ behavior: 'smooth', block: 'center' })
      },
    },
    {
      targetSelector: '.cfg-dock',
      titleKey: 'tut.step4.title',
      descKey: 'tut.step4.desc',
      position: 'top',
    },
  ]

  // Auto-start after delay on first visit
  useEffect(() => {
    if (tutorialComplete || tutorialStep > 0) return
    const timer = setTimeout(() => {
      setTutorialStep(1)
    }, 1500)
    return () => clearTimeout(timer)
  }, [tutorialComplete, tutorialStep, setTutorialStep])

  // Escape key to skip/close tutorial
  useEffect(() => {
    if (tutorialComplete || tutorialStep < 1) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { completeTutorial() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [tutorialComplete, tutorialStep, completeTutorial])

  // Update spotlight position when step changes
  const updatePosition = useCallback(() => {
    if (tutorialStep < 1 || tutorialStep > STEPS.length) return
    const step = STEPS[tutorialStep - 1]
    if (step.onEnter) step.onEnter()

    // Small delay to allow DOM to update after onEnter
    setTimeout(() => {
      const el = document.querySelector(step.targetSelector)
      if (!el) return
      const rect = el.getBoundingClientRect()
      setSpotRect(rect)

      // Calculate tooltip position
      const pad = 16
      let top = 0, left = 0
      switch (step.position) {
        case 'top':
          top = rect.top - 160 - pad
          left = rect.left + rect.width / 2 - 130
          break
        case 'bottom':
          top = rect.bottom + pad
          left = rect.left + rect.width / 2 - 130
          break
        case 'left':
          top = rect.top + rect.height / 2 - 60
          left = rect.left - 260 - pad
          break
        case 'right':
          top = rect.top + rect.height / 2 - 60
          left = rect.right + pad
          break
      }
      // Keep on screen
      top = Math.max(12, Math.min(top, window.innerHeight - 200))
      left = Math.max(12, Math.min(left, window.innerWidth - 272))
      setTooltipPos({ top, left })
    }, 200)
  }, [tutorialStep, dockOpen])

  useEffect(() => {
    updatePosition()
  }, [updatePosition])

  const handleNext = () => {
    if (tutorialStep >= STEPS.length) {
      completeTutorial()
    } else {
      setTutorialStep(tutorialStep + 1)
    }
  }

  const handleSkip = () => {
    completeTutorial()
  }

  if (tutorialComplete || tutorialStep < 1) return null

  const step = STEPS[tutorialStep - 1]
  const isLast = tutorialStep >= STEPS.length

  const overlay = (
    <div className="cfg-tutorial-overlay">
      {/* Backdrop with spotlight cutout */}
      <svg className="cfg-tutorial-backdrop" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <mask id="cfg-tut-mask">
            <rect fill="white" width="100%" height="100%" />
            {spotRect && (
              <rect
                fill="black"
                x={spotRect.left - 8}
                y={spotRect.top - 8}
                width={spotRect.width + 16}
                height={spotRect.height + 16}
                rx="12"
              />
            )}
          </mask>
        </defs>
        <rect
          fill="rgba(0,0,0,0.55)"
          width="100%" height="100%"
          mask="url(#cfg-tut-mask)"
        />
        {/* Highlight border around spotlight */}
        {spotRect && (
          <rect
            x={spotRect.left - 8}
            y={spotRect.top - 8}
            width={spotRect.width + 16}
            height={spotRect.height + 16}
            rx="12"
            fill="none"
            stroke="rgba(140, 90, 180, 0.5)"
            strokeWidth="2"
          />
        )}
      </svg>

      {/* Tooltip */}
      <div className="cfg-tutorial-tooltip" style={{ top: tooltipPos.top, left: tooltipPos.left }}>
        <h4 className="cfg-tutorial-tooltip__title">{ct(language, step.titleKey)}</h4>
        <p className="cfg-tutorial-tooltip__desc">{ct(language, step.descKey)}</p>
        <div className="cfg-tutorial-tooltip__actions">
          <button className="cfg-tutorial-tooltip__btn" onClick={handleSkip}>
            {ct(language, 'tut.skip')}
          </button>
          <button className="cfg-tutorial-tooltip__btn cfg-tutorial-tooltip__btn--primary" onClick={handleNext}>
            {isLast ? ct(language, 'tut.done') : ct(language, 'tut.next')}
          </button>
        </div>
        <div className="cfg-tutorial-tooltip__dots">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`cfg-tutorial-tooltip__dot ${i === tutorialStep - 1 ? 'cfg-tutorial-tooltip__dot--active' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  )

  return createPortal(overlay, document.body)
}
