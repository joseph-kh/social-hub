import { create } from 'zustand'

interface WalletStoreState {
  address: string | null
  avaxBalance: string
  isBalanceLoading: boolean
  lastUpdatedAt?: number

  setAddress: (address: string | null) => void
  setBalance: (balance: string) => void
  setBalanceLoading: (loading: boolean) => void
  incrementBalance: (amount: string) => void
  reset: () => void
}

export const useWalletStore = create<WalletStoreState>((set, get) => ({
  address: null,
  avaxBalance: '0.0000',
  isBalanceLoading: false,
  lastUpdatedAt: undefined,

  setAddress: (address) => set({ address }),
  setBalance: (balance) =>
    set({ avaxBalance: balance, lastUpdatedAt: Date.now() }),
  setBalanceLoading: (loading) => set({ isBalanceLoading: loading }),
  incrementBalance: (amount) => {
    const current = parseFloat(get().avaxBalance)
    const increment = parseFloat(amount)
    set({
      avaxBalance: (current + increment).toFixed(4),
      lastUpdatedAt: Date.now(),
    })
  },
  reset: () =>
    set({
      address: null,
      avaxBalance: '0.0000',
      isBalanceLoading: false,
      lastUpdatedAt: undefined,
    }),
}))
