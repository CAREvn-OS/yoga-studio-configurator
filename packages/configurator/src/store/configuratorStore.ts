import { create } from 'zustand'
import type { DockMode, MediaUpload, ThemeColors, TypoCategory, TypoCategorySettings, VibeSettings, ImageDisplayStyle, ButtonStyle, CardStyle, MediaSlotSettings, Language } from '@care/shared-types'
import { SECTION_ITEM_CONFIGS } from '@care/shared-types'

const DEFAULT_SECTION_ORDER: string[] = [
  'about', 'manifesto', 'schedule', 'process', 'instructors',
  'pricing', 'studioTour', 'testimonials', 'events', 'blog',
  'partners', 'socialMedia', 'faq', 'contact',
]

const DEFAULT_SECTIONS: Record<string, boolean> = {
  manifesto: false,
  process: false,
  studioTour: false,
  events: false,
  blog: false,
  partners: false,
  socialMedia: false,
  faq: false,
}

interface ConfiguratorState {
  // UI
  dockOpen: boolean
  dockMode: DockMode | null
  copyMode: boolean
  activeCopyElement: string | null
  activeSectionBlob: string | null
  activeRowCategory: string | null
  autoPreview: boolean
  saveStatus: 'idle' | 'saving' | 'saved' | 'error'

  // Tutorial
  tutorialStep: number
  tutorialComplete: boolean

  // Toast
  toastMessage: string | null
  toastTimeout: ReturnType<typeof setTimeout> | null

  // Config
  theme: string
  colorOverrides: Partial<ThemeColors> | null
  typographyOverride: string | null
  typoCategorySettings: Partial<Record<TypoCategory, TypoCategorySettings>>
  vibe: VibeSettings
  copySelections: Record<string, number>
  customCopy: Record<string, string>
  layouts: Record<string, string>
  sections: Record<string, boolean>
  sectionOrder: string[]
  sectionItems: Record<string, number>
  mediaUploads: Record<string, MediaUpload>
  imageDisplayStyle: ImageDisplayStyle
  logoUpload: MediaUpload | null
  logoScale: number
  logoNaturalWidth: number
  mediaSlotSettings: Record<string, MediaSlotSettings>
  borderRadiusOverride: number | null
  buttonStyle: ButtonStyle
  cardStyle: CardStyle
  previewMode: boolean
  language: Language

  // Actions
  toggleDock: () => void
  setDockMode: (mode: DockMode | null) => void
  setCopyMode: (on: boolean) => void
  setActiveCopyElement: (id: string | null) => void
  setTheme: (id: string) => void
  setColorOverride: (key: string, value: string) => void
  clearColorOverrides: () => void
  setTypographyOverride: (id: string | null) => void
  setTypoCategorySetting: (category: TypoCategory, setting: Partial<TypoCategorySettings>) => void
  clearTypoCategorySetting: (category: TypoCategory) => void
  clearAllTypoCategorySettings: () => void
  setVibe: (vibe: Partial<VibeSettings>) => void
  setCopySelection: (elementId: string, index: number) => void
  setCustomCopy: (elementId: string, text: string) => void
  clearCustomCopy: (elementId: string) => void
  setLayout: (sectionId: string, layoutId: string) => void
  toggleSection: (sectionId: string) => void
  setSectionOrder: (order: string[]) => void
  moveSectionOrder: (fromIndex: number, toIndex: number) => void
  addSectionItem: (sectionId: string) => void
  removeSectionItem: (sectionId: string) => void
  setMediaUpload: (slotId: string, file: File) => void
  clearMediaUpload: (slotId: string) => void
  setImageDisplayStyle: (style: ImageDisplayStyle) => void
  setLogoUpload: (file: File) => void
  clearLogoUpload: () => void
  setLogoScale: (scale: number) => void
  setMediaUploadResponsiveUrls: (slotId: string, urls: { mobile: string; tablet: string; desktop: string }) => void
  setMediaSlotSetting: (slotId: string, settings: Partial<MediaSlotSettings>) => void
  clearMediaSlotSetting: (slotId: string) => void
  setBorderRadiusOverride: (value: number | null) => void
  setButtonStyle: (style: ButtonStyle) => void
  setCardStyle: (style: CardStyle) => void
  setActiveSectionBlob: (id: string | null) => void
  setActiveRowCategory: (cat: string | null) => void
  setAutoPreview: (on: boolean) => void
  setSaveStatus: (status: 'idle' | 'saving' | 'saved' | 'error') => void
  setTutorialStep: (step: number) => void
  completeTutorial: () => void
  restartTutorial: () => void
  togglePreviewMode: () => void
  setLanguage: (lang: Language) => void
  showToast: (message: string) => void
  exportConfig: () => string
  restoreConfig: (config: Record<string, any>) => void
  initPersistence: () => void
}

export const useConfiguratorStore = create<ConfiguratorState>((set, get) => ({
  // UI defaults
  dockOpen: false,
  dockMode: null,
  copyMode: true,
  activeCopyElement: null,
  activeSectionBlob: null,
  activeRowCategory: null,
  autoPreview: false,
  saveStatus: 'idle' as 'idle' | 'saving' | 'saved' | 'error',

  // Tutorial
  tutorialStep: 0,
  tutorialComplete: typeof window !== 'undefined' ? localStorage.getItem('cfg_tutorial_complete') === 'true' : false,

  // Toast
  toastMessage: null,
  toastTimeout: null,

  // Config defaults
  theme: 'warm-earth',
  colorOverrides: null,
  typographyOverride: null,
  typoCategorySettings: {},
  vibe: { preset: 'normal' },
  copySelections: {},
  customCopy: {},
  layouts: {},
  sections: { ...DEFAULT_SECTIONS },
  sectionOrder: [...DEFAULT_SECTION_ORDER],
  sectionItems: Object.fromEntries(
    Object.entries(SECTION_ITEM_CONFIGS).map(([k, v]) => [k, v.default])
  ),
  mediaUploads: {},
  imageDisplayStyle: 'none' as ImageDisplayStyle,
  logoUpload: null,
  logoScale: 180,
  logoNaturalWidth: 300,
  mediaSlotSettings: {},
  borderRadiusOverride: null,
  buttonStyle: 'rounded' as ButtonStyle,
  cardStyle: 'flat' as CardStyle,
  previewMode: false,
  language: 'vi' as Language,

  // --- Actions ---

  toggleDock: () =>
    set(s => {
      if (s.dockOpen) {
        return { dockOpen: false, dockMode: null, activeCopyElement: null, activeSectionBlob: null }
      }
      return { dockOpen: true, activeSectionBlob: null }
    }),

  setDockMode: (mode) =>
    set({ dockMode: mode, activeSectionBlob: null }),

  setCopyMode: (on) =>
    set({ copyMode: on, activeCopyElement: null }),

  setActiveCopyElement: (id) =>
    set({ activeCopyElement: id }),

  setTheme: (id) =>
    set({ theme: id, colorOverrides: null, typographyOverride: null }),

  setColorOverride: (key, value) =>
    set(s => ({
      colorOverrides: { ...(s.colorOverrides ?? {}), [key]: value } as Partial<ThemeColors>,
    })),

  clearColorOverrides: () =>
    set({ colorOverrides: null }),

  setTypographyOverride: (id) =>
    set({ typographyOverride: id }),

  setTypoCategorySetting: (category, setting) =>
    set(s => ({
      typoCategorySettings: {
        ...s.typoCategorySettings,
        [category]: { ...(s.typoCategorySettings[category] ?? {}), ...setting },
      },
    })),

  clearTypoCategorySetting: (category) =>
    set(s => {
      const next = { ...s.typoCategorySettings }
      delete next[category]
      return { typoCategorySettings: next }
    }),

  clearAllTypoCategorySettings: () =>
    set({ typoCategorySettings: {} }),

  setVibe: (vibe) =>
    set(s => ({ vibe: { ...s.vibe, ...vibe } })),

  setCopySelection: (elementId, index) =>
    set(s => ({
      copySelections: { ...s.copySelections, [elementId]: index },
      customCopy: (() => {
        const next = { ...s.customCopy }
        delete next[elementId]
        return next
      })(),
    })),

  setCustomCopy: (elementId, text) =>
    set(s => ({
      customCopy: { ...s.customCopy, [elementId]: text },
    })),

  clearCustomCopy: (elementId) =>
    set(s => {
      const next = { ...s.customCopy }
      delete next[elementId]
      return { customCopy: next }
    }),

  setLayout: (sectionId, layoutId) =>
    set(s => ({
      layouts: { ...s.layouts, [sectionId]: layoutId },
    })),

  toggleSection: (sectionId) =>
    set(s => ({
      sections: { ...s.sections, [sectionId]: !s.sections[sectionId] },
    })),

  setSectionOrder: (order) =>
    set({ sectionOrder: order }),

  moveSectionOrder: (fromIndex, toIndex) =>
    set(s => {
      const order = [...s.sectionOrder]
      const [moved] = order.splice(fromIndex, 1)
      order.splice(toIndex, 0, moved)
      return { sectionOrder: order }
    }),

  addSectionItem: (sectionId) =>
    set(s => {
      const cfg = SECTION_ITEM_CONFIGS[sectionId]
      if (!cfg) return s
      const current = s.sectionItems[sectionId] ?? cfg.default
      if (current >= cfg.max) return s
      return { sectionItems: { ...s.sectionItems, [sectionId]: current + 1 } }
    }),

  removeSectionItem: (sectionId) =>
    set(s => {
      const cfg = SECTION_ITEM_CONFIGS[sectionId]
      if (!cfg) return s
      const current = s.sectionItems[sectionId] ?? cfg.default
      if (current <= cfg.min) return s
      return { sectionItems: { ...s.sectionItems, [sectionId]: current - 1 } }
    }),

  setMediaUpload: (slotId, file) => {
    const prev = get().mediaUploads[slotId]
    if (prev) URL.revokeObjectURL(prev.blobUrl)
    const blobUrl = URL.createObjectURL(file)
    set(s => ({
      mediaUploads: {
        ...s.mediaUploads,
        [slotId]: { blobUrl, name: file.name, type: file.type, size: file.size },
      },
    }))
    const uploadRemote = async () => {
      try {
        const { uploadMedia } = await import('@care/media-storage')
        const result = await uploadMedia(file, slotId)
        if (!result) return
        const current = get().mediaUploads[slotId]
        if (!current || current.blobUrl !== blobUrl) return
        set(s => ({
          mediaUploads: {
            ...s.mediaUploads,
            [slotId]: { ...s.mediaUploads[slotId], remotePath: result.path, remoteUrl: result.url },
          },
        }))
        // Auto image optimization: generate responsive WebP variants
        try {
          const { processImage, uploadBlob } = await import('@care/media-storage')
          const variants = await processImage(file)
          const ts = Date.now()
          const [mobileRes, tabletRes, desktopRes] = await Promise.all([
            uploadBlob(variants.mobile, `uploads/${slotId}_${ts}_mobile.webp`),
            uploadBlob(variants.tablet, `uploads/${slotId}_${ts}_tablet.webp`),
            uploadBlob(variants.desktop, `uploads/${slotId}_${ts}_desktop.webp`),
          ])
          if (mobileRes && tabletRes && desktopRes) {
            get().setMediaUploadResponsiveUrls(slotId, {
              mobile: mobileRes.url,
              tablet: tabletRes.url,
              desktop: desktopRes.url,
            })
          }
        } catch {
          // Image optimization failed silently
        }
      } catch {
        // Supabase unavailable
      }
    }
    uploadRemote()
  },

  clearMediaUpload: (slotId) => {
    const prev = get().mediaUploads[slotId]
    if (prev) {
      URL.revokeObjectURL(prev.blobUrl)
      if (prev.remotePath) {
        import('@care/media-storage')
          .then(({ deleteMedia }) => deleteMedia(prev.remotePath!))
          .catch(() => {})
      }
    }
    set(s => {
      const next = { ...s.mediaUploads }
      delete next[slotId]
      return { mediaUploads: next }
    })
  },

  setImageDisplayStyle: (style) =>
    set({ imageDisplayStyle: style }),

  setLogoUpload: (file) => {
    const prev = get().logoUpload
    if (prev) URL.revokeObjectURL(prev.blobUrl)
    const blobUrl = URL.createObjectURL(file)
    set({
      logoUpload: { blobUrl, name: file.name, type: file.type, size: file.size },
    })
    // Detect natural width for dynamic slider max
    const img = new Image()
    img.onload = () => {
      const naturalW = img.naturalWidth
      set(s => ({
        logoNaturalWidth: naturalW,
        logoScale: Math.min(s.logoScale, naturalW),
      }))
    }
    img.src = blobUrl
    const uploadRemote = async () => {
      try {
        const { uploadMedia } = await import('@care/media-storage')
        const result = await uploadMedia(file, 'logo')
        if (!result) return
        const current = get().logoUpload
        if (!current || current.blobUrl !== blobUrl) return
        set({
          logoUpload: { ...current, remotePath: result.path, remoteUrl: result.url },
        })
      } catch {
        // Supabase unavailable
      }
    }
    uploadRemote()
  },

  clearLogoUpload: () => {
    const prev = get().logoUpload
    if (prev) {
      URL.revokeObjectURL(prev.blobUrl)
      if (prev.remotePath) {
        import('@care/media-storage')
          .then(({ deleteMedia }) => deleteMedia(prev.remotePath!))
          .catch(() => {})
      }
    }
    set({ logoUpload: null, logoNaturalWidth: 300 })
  },

  setLogoScale: (scale) =>
    set({ logoScale: scale }),

  setMediaUploadResponsiveUrls: (slotId, urls) =>
    set(s => ({
      mediaUploads: {
        ...s.mediaUploads,
        [slotId]: { ...s.mediaUploads[slotId], responsiveUrls: urls },
      },
    })),

  setMediaSlotSetting: (slotId, settings) =>
    set(s => ({
      mediaSlotSettings: {
        ...s.mediaSlotSettings,
        [slotId]: { ...(s.mediaSlotSettings[slotId] ?? { displayStyle: 'none' }), ...settings },
      },
    })),

  clearMediaSlotSetting: (slotId) =>
    set(s => {
      const next = { ...s.mediaSlotSettings }
      delete next[slotId]
      return { mediaSlotSettings: next }
    }),

  setBorderRadiusOverride: (value) =>
    set({ borderRadiusOverride: value }),

  setButtonStyle: (style) =>
    set({ buttonStyle: style }),

  setCardStyle: (style) =>
    set({ cardStyle: style }),

  setActiveSectionBlob: (id) =>
    set({ activeSectionBlob: id, activeRowCategory: null, dockOpen: false, dockMode: null }),

  setActiveRowCategory: (cat) =>
    set({ activeRowCategory: cat }),

  setAutoPreview: (on) =>
    set({ autoPreview: on }),

  setSaveStatus: (status) =>
    set({ saveStatus: status }),

  setTutorialStep: (step) => set({ tutorialStep: step }),

  completeTutorial: () => {
    if (typeof window !== 'undefined') localStorage.setItem('cfg_tutorial_complete', 'true')
    set({ tutorialComplete: true, tutorialStep: 0 })
  },

  restartTutorial: () => {
    if (typeof window !== 'undefined') localStorage.removeItem('cfg_tutorial_complete')
    set({ tutorialComplete: false, tutorialStep: 0 })
  },

  togglePreviewMode: () =>
    set(s => {
      if (s.previewMode) {
        return { previewMode: false, copyMode: true, dockOpen: true, dockMode: null, activeCopyElement: null }
      }
      return { previewMode: true, copyMode: false, dockMode: null, activeCopyElement: null, activeSectionBlob: null, dockOpen: false }
    }),

  setLanguage: (lang) => set({ language: lang }),

  showToast: (message) => {
    const prev = get().toastTimeout
    if (prev) clearTimeout(prev)
    const timeout = setTimeout(() => {
      set({ toastMessage: null, toastTimeout: null })
    }, 2800)
    set({ toastMessage: message, toastTimeout: timeout })
  },

  exportConfig: () => {
    const s = get()
    const config = {
      theme: s.theme,
      colorOverrides: s.colorOverrides,
      typographyOverride: s.typographyOverride,
      typoCategorySettings: s.typoCategorySettings,
      vibe: s.vibe,
      copySelections: s.copySelections,
      customCopy: s.customCopy,
      layouts: s.layouts,
      sections: s.sections,
      sectionOrder: s.sectionOrder,
      sectionItems: s.sectionItems,
      imageDisplayStyle: s.imageDisplayStyle,
      logoScale: s.logoScale,
      mediaSlotSettings: s.mediaSlotSettings,
      borderRadiusOverride: s.borderRadiusOverride,
      buttonStyle: s.buttonStyle,
      cardStyle: s.cardStyle,
      language: s.language,
      logoUpload: s.logoUpload ? {
        name: s.logoUpload.name, type: s.logoUpload.type, size: s.logoUpload.size,
        remotePath: s.logoUpload.remotePath, remoteUrl: s.logoUpload.remoteUrl,
      } : null,
      mediaUploads: Object.fromEntries(
        Object.entries(s.mediaUploads).map(([k, v]) => [
          k,
          { name: v.name, type: v.type, size: v.size, remotePath: v.remotePath, remoteUrl: v.remoteUrl },
        ])
      ),
    }
    return JSON.stringify(config, null, 2)
  },

  restoreConfig: (config) => {
    const updates: Partial<ConfiguratorState> = {}
    if (config.theme) updates.theme = config.theme
    if (config.colorOverrides) updates.colorOverrides = config.colorOverrides
    if (config.typographyOverride) updates.typographyOverride = config.typographyOverride
    if (config.typoCategorySettings) updates.typoCategorySettings = config.typoCategorySettings
    if (config.vibe) {
      // Migrate old vibe format: strip intensity, remap old preset names
      const vibeMap: Record<string, string> = {
        zen: 'serene', pulse: 'breathe', bloom: 'spring',
        drift: 'flow', spark: 'snap', wave: 'flow',
        serene: 'serene',
      }
      const oldPreset = config.vibe.preset
      updates.vibe = { preset: vibeMap[oldPreset] ?? oldPreset }
    }
    if (config.copySelections) updates.copySelections = config.copySelections
    if (config.customCopy) updates.customCopy = config.customCopy
    if (config.layouts) updates.layouts = config.layouts
    if (config.sections) updates.sections = config.sections
    if (config.sectionOrder) {
      // Migrate: ensure new sections exist in saved order
      const order = [...config.sectionOrder]
      if (!order.includes('socialMedia')) {
        const partnersIdx = order.indexOf('partners')
        order.splice(partnersIdx >= 0 ? partnersIdx + 1 : order.length - 1, 0, 'socialMedia')
      }
      updates.sectionOrder = order
    }
    if (config.sectionItems) updates.sectionItems = config.sectionItems
    if (config.imageDisplayStyle) updates.imageDisplayStyle = config.imageDisplayStyle as ImageDisplayStyle
    if (config.logoScale !== undefined) updates.logoScale = config.logoScale
    if (config.mediaSlotSettings) updates.mediaSlotSettings = config.mediaSlotSettings
    if (config.borderRadiusOverride !== undefined) updates.borderRadiusOverride = config.borderRadiusOverride
    if (config.buttonStyle) updates.buttonStyle = config.buttonStyle as ButtonStyle
    if (config.cardStyle) updates.cardStyle = config.cardStyle as CardStyle
    // Gradient settings ignored (removed)
    updates.language = (config.language === 'en' ? 'en' : 'vi') as Language
    // Restore media references using remote URLs (blob URLs are not persisted)
    if (config.mediaUploads) {
      const restored: Record<string, MediaUpload> = {}
      for (const [k, v] of Object.entries(config.mediaUploads as Record<string, any>)) {
        if (v.remoteUrl) {
          restored[k] = { blobUrl: v.remoteUrl, name: v.name, type: v.type, size: v.size, remotePath: v.remotePath, remoteUrl: v.remoteUrl }
        }
      }
      if (Object.keys(restored).length > 0) updates.mediaUploads = restored
    }
    if (config.logoUpload && config.logoUpload.remoteUrl) {
      const l = config.logoUpload
      updates.logoUpload = { blobUrl: l.remoteUrl, name: l.name, type: l.type, size: l.size, remotePath: l.remotePath, remoteUrl: l.remoteUrl }
      // Detect natural width from remote logo
      const img = new Image()
      img.onload = () => {
        set(s => ({
          logoNaturalWidth: img.naturalWidth,
          logoScale: Math.min(s.logoScale, img.naturalWidth),
        }))
      }
      img.src = l.remoteUrl
    }
    set(updates)
  },

  initPersistence: () => {
    let ipHash: string | null = null
    let saveTimer: ReturnType<typeof setTimeout> | null = null

    const doInit = async () => {
      try {
        const { getIpHash, loadConfig, saveConfig } = await import('@care/media-storage')
        ipHash = await getIpHash()
        if (!ipHash) return

        // Load saved config
        const saved = await loadConfig(ipHash)
        if (saved) {
          get().restoreConfig(saved)
        }

        // Auto-save on changes (debounced 3s)
        const unsub = useConfiguratorStore.subscribe(() => {
          if (!ipHash) return
          if (saveTimer) clearTimeout(saveTimer)
          set({ saveStatus: 'saving' })
          saveTimer = setTimeout(() => {
            const configJson = get().exportConfig()
            saveConfig(ipHash!, configJson)
              .then(() => {
                set({ saveStatus: 'saved' })
                setTimeout(() => {
                  if (get().saveStatus === 'saved') set({ saveStatus: 'idle' })
                }, 2000)
              })
              .catch(() => {
                set({ saveStatus: 'error' })
                setTimeout(() => {
                  if (get().saveStatus === 'error') set({ saveStatus: 'idle' })
                }, 3000)
              })
          }, 3000)
        })

        // Store unsub reference for cleanup if ever needed
        ;(window as any).__cfgUnsub = unsub
      } catch {
        // Supabase unavailable — silent fail
      }
    }
    doInit()
  },
}))
