import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'warning'

interface Toast {
  message: string
  type: ToastType
  visible: boolean
}

interface UIStoreState {
  toast: Toast
  showToast: (message: string, type: ToastType) => void
  hideToast: () => void
}

let toastTimer: ReturnType<typeof setTimeout> | null = null

export const useUIStore = create<UIStoreState>((set) => ({
  toast: { message: '', type: 'success', visible: false },

  showToast: (message, type) => {
    if (toastTimer) clearTimeout(toastTimer)
    set({ toast: { message, type, visible: true } })
    toastTimer = setTimeout(() => {
      set((state) => ({ toast: { ...state.toast, visible: false } }))
    }, 3000)
  },

  hideToast: () =>
    set((state) => ({ toast: { ...state.toast, visible: false } })),
}))
