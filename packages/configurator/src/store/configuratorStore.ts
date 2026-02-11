import { create } from 'zustand'
import type { PanelId, MediaUpload, ThemeColors } from '@care/shared-types'

interface ConfiguratorState {
  // UI
  dockOpen: boolean
  activePanel: PanelId | null
  copyMode: boolean
  mediaMode: boolean
  activeCopyElement: string | null

  // Toast
  toastMessage: string | null
  toastTimeout: ReturnType<typeof setTimeout> | null

  // Config
  theme: string
  colorOverrides: Partial<ThemeColors> | null
  typographyOverride: string | null
  copySelections: Record<string, number>
  customCopy: Record<string, string>
  layouts: Record<string, string>
  sections: Record<string, boolean>
  effect: string
  mediaUploads: Record<string, MediaUpload>

  // Actions
  toggleDock: () => void
  openPanel: (panel: PanelId) => void
  closePanel: () => void
  setCopyMode: (on: boolean) => void
  setMediaMode: (on: boolean) => void
  setActiveCopyElement: (id: string | null) => void
  setTheme: (id: string) => void
  setColorOverride: (key: string, value: string) => void
  clearColorOverrides: () => void
  setTypographyOverride: (id: string | null) => void
  setCopySelection: (elementId: string, index: number) => void
  setCustomCopy: (elementId: string, text: string) => void
  clearCustomCopy: (elementId: string) => void
  setLayout: (sectionId: string, layoutId: string) => void
  toggleSection: (sectionId: string) => void
  setEffect: (effectId: string) => void
  setMediaUpload: (slotId: string, file: File) => void
  clearMediaUpload: (slotId: string) => void
  showToast: (message: string) => void
  exportConfig: () => string
}

const DEFAULT_SECTIONS: Record<string, boolean> = {
  manifesto: false,
  process: false,
  studioTour: false,
  events: false,
  blog: false,
  partners: false,
  faq: false,
}

export const useConfiguratorStore = create<ConfiguratorState>((set, get) => ({
  // UI defaults
  dockOpen: false,
  activePanel: null,
  copyMode: false,
  mediaMode: false,
  activeCopyElement: null,

  // Toast
  toastMessage: null,
  toastTimeout: null,

  // Config defaults
  theme: 'warm-earth',
  colorOverrides: null,
  typographyOverride: null,
  copySelections: {},
  customCopy: {},
  layouts: {},
  sections: { ...DEFAULT_SECTIONS },
  effect: 'smooth-rise',
  mediaUploads: {},

  // --- Actions ---

  toggleDock: () =>
    set(s => {
      if (s.dockOpen) {
        return { dockOpen: false, activePanel: null, copyMode: false, mediaMode: false, activeCopyElement: null }
      }
      return { dockOpen: true }
    }),

  openPanel: (panel) =>
    set(s => {
      if (s.activePanel === panel) {
        return { activePanel: null }
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
    set({ copyMode: on, activeCopyElement: on ? null : null }),

  setMediaMode: (on) =>
    set({ mediaMode: on }),

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
  },

  clearMediaUpload: (slotId) => {
    const prev = get().mediaUploads[slotId]
    if (prev) URL.revokeObjectURL(prev.blobUrl)
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
      copySelections: s.copySelections,
      customCopy: s.customCopy,
      layouts: s.layouts,
      sections: s.sections,
      effect: s.effect,
      mediaUploads: Object.fromEntries(
        Object.entries(s.mediaUploads).map(([k, v]) => [k, { name: v.name, type: v.type, size: v.size }])
      ),
    }
    return JSON.stringify(config, null, 2)
  },
}))
