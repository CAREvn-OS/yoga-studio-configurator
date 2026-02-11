import { create } from 'zustand'
import type { PanelId, MediaUpload, ThemeColors, ElementStyle, TypoCategory, TypoCategorySettings } from '@care/shared-types'

const DEFAULT_SECTION_ORDER: string[] = [
  'about', 'manifesto', 'schedule', 'process', 'instructors',
  'pricing', 'studioTour', 'testimonials', 'events', 'blog',
  'partners', 'faq', 'contact',
]

const DEFAULT_SECTIONS: Record<string, boolean> = {
  manifesto: false,
  process: false,
  studioTour: false,
  events: false,
  blog: false,
  partners: false,
  faq: false,
}

interface ConfiguratorState {
  // UI
  dockOpen: boolean
  activePanel: PanelId | null
  copyMode: boolean
  styleMode: boolean
  activeCopyElement: string | null
  activeStyleElement: string | null

  // Toast
  toastMessage: string | null
  toastTimeout: ReturnType<typeof setTimeout> | null

  // Config
  theme: string
  colorOverrides: Partial<ThemeColors> | null
  typographyOverride: string | null
  typoCategorySettings: Partial<Record<TypoCategory, TypoCategorySettings>>
  copySelections: Record<string, number>
  customCopy: Record<string, string>
  layouts: Record<string, string>
  sections: Record<string, boolean>
  sectionOrder: string[]
  effect: string
  mediaUploads: Record<string, MediaUpload>
  elementStyles: Record<string, ElementStyle>

  // Actions
  toggleDock: () => void
  openPanel: (panel: PanelId) => void
  closePanel: () => void
  setCopyMode: (on: boolean) => void
  setStyleMode: (on: boolean) => void
  setActiveCopyElement: (id: string | null) => void
  setActiveStyleElement: (id: string | null) => void
  setTheme: (id: string) => void
  setColorOverride: (key: string, value: string) => void
  clearColorOverrides: () => void
  setTypographyOverride: (id: string | null) => void
  setTypoCategorySetting: (category: TypoCategory, setting: Partial<TypoCategorySettings>) => void
  clearTypoCategorySetting: (category: TypoCategory) => void
  clearAllTypoCategorySettings: () => void
  setCopySelection: (elementId: string, index: number) => void
  setCustomCopy: (elementId: string, text: string) => void
  clearCustomCopy: (elementId: string) => void
  setLayout: (sectionId: string, layoutId: string) => void
  toggleSection: (sectionId: string) => void
  setSectionOrder: (order: string[]) => void
  moveSectionOrder: (fromIndex: number, toIndex: number) => void
  setEffect: (effectId: string) => void
  setMediaUpload: (slotId: string, file: File) => void
  clearMediaUpload: (slotId: string) => void
  setElementStyle: (elementId: string, style: ElementStyle) => void
  clearElementStyle: (elementId: string) => void
  clearAllElementStyles: () => void
  showToast: (message: string) => void
  exportConfig: () => string
}

export const useConfiguratorStore = create<ConfiguratorState>((set, get) => ({
  // UI defaults
  dockOpen: false,
  activePanel: null,
  copyMode: false,
  styleMode: false,
  activeCopyElement: null,
  activeStyleElement: null,

  // Toast
  toastMessage: null,
  toastTimeout: null,

  // Config defaults
  theme: 'warm-earth',
  colorOverrides: null,
  typographyOverride: null,
  typoCategorySettings: {},
  copySelections: {},
  customCopy: {},
  layouts: {},
  sections: { ...DEFAULT_SECTIONS },
  sectionOrder: [...DEFAULT_SECTION_ORDER],
  effect: 'smooth-rise',
  mediaUploads: {},
  elementStyles: {},

  // --- Actions ---

  toggleDock: () =>
    set(s => {
      if (s.dockOpen) {
        return {
          dockOpen: false,
          activePanel: null,
          copyMode: false,
          styleMode: false,
          activeCopyElement: null,
          activeStyleElement: null,
        }
      }
      return { dockOpen: true }
    }),

  openPanel: (panel) =>
    set(s => {
      if (s.activePanel === panel) {
        return { activePanel: null, copyMode: false, styleMode: false, activeCopyElement: null, activeStyleElement: null }
      }
      const isCopy = panel === 'copy'
      const isStyle = panel === 'style'
      return {
        activePanel: panel,
        copyMode: isCopy,
        styleMode: isStyle,
        activeCopyElement: isCopy ? s.activeCopyElement : null,
        activeStyleElement: isStyle ? s.activeStyleElement : null,
      }
    }),

  closePanel: () =>
    set({ activePanel: null, copyMode: false, styleMode: false, activeCopyElement: null, activeStyleElement: null }),

  setCopyMode: (on) =>
    set({ copyMode: on, activeCopyElement: null }),

  setStyleMode: (on) =>
    set({ styleMode: on, activeStyleElement: null }),

  setActiveCopyElement: (id) =>
    set({ activeCopyElement: id }),

  setActiveStyleElement: (id) =>
    set({ activeStyleElement: id }),

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

  setEffect: (effectId) =>
    set({ effect: effectId }),

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

  setElementStyle: (elementId, style) =>
    set(s => ({
      elementStyles: { ...s.elementStyles, [elementId]: { ...(s.elementStyles[elementId] ?? {}), ...style } },
    })),

  clearElementStyle: (elementId) =>
    set(s => {
      const next = { ...s.elementStyles }
      delete next[elementId]
      return { elementStyles: next }
    }),

  clearAllElementStyles: () =>
    set({ elementStyles: {} }),

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
      copySelections: s.copySelections,
      customCopy: s.customCopy,
      layouts: s.layouts,
      sections: s.sections,
      sectionOrder: s.sectionOrder,
      effect: s.effect,
      elementStyles: s.elementStyles,
      mediaUploads: Object.fromEntries(
        Object.entries(s.mediaUploads).map(([k, v]) => [
          k,
          { name: v.name, type: v.type, size: v.size, remotePath: v.remotePath, remoteUrl: v.remoteUrl },
        ])
      ),
    }
    return JSON.stringify(config, null, 2)
  },
}))
