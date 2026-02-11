import { create } from 'zustand'
import type { PanelId, MediaUpload, ThemeColors, TypoCategory, TypoCategorySettings, VibeSettings } from '@care/shared-types'
import { SECTION_ITEM_CONFIGS } from '@care/shared-types'

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
  activeCopyElement: string | null

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

  // Actions
  toggleDock: () => void
  openPanel: (panel: PanelId) => void
  closePanel: () => void
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
  showToast: (message: string) => void
  exportConfig: () => string
}

export const useConfiguratorStore = create<ConfiguratorState>((set, get) => ({
  // UI defaults
  dockOpen: false,
  activePanel: null,
  copyMode: false,
  activeCopyElement: null,

  // Toast
  toastMessage: null,
  toastTimeout: null,

  // Config defaults
  theme: 'warm-earth',
  colorOverrides: null,
  typographyOverride: null,
  typoCategorySettings: {},
  vibe: { preset: 'zen', intensity: 40 },
  copySelections: {},
  customCopy: {},
  layouts: {},
  sections: { ...DEFAULT_SECTIONS },
  sectionOrder: [...DEFAULT_SECTION_ORDER],
  sectionItems: Object.fromEntries(
    Object.entries(SECTION_ITEM_CONFIGS).map(([k, v]) => [k, v.default])
  ),
  mediaUploads: {},

  // --- Actions ---

  toggleDock: () =>
    set(s => {
      if (s.dockOpen) {
        return { dockOpen: false, activePanel: null, copyMode: false, activeCopyElement: null }
      }
      return { dockOpen: true }
    }),

  openPanel: (panel) =>
    set(s => {
      if (s.activePanel === panel) {
        return { activePanel: null, copyMode: false, activeCopyElement: null }
      }
      const isCopy = panel === 'copy'
      return {
        activePanel: panel,
        copyMode: isCopy,
        activeCopyElement: isCopy ? s.activeCopyElement : null,
      }
    }),

  closePanel: () =>
    set({ activePanel: null, copyMode: false, activeCopyElement: null }),

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
