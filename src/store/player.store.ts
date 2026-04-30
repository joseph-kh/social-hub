import { create } from 'zustand'

interface PlayerState {
  level: number
  xp: number
  xpToNextLevel: number
  claimedCount: number

  addXP: (amount: number) => boolean
  reset: () => void
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  level: 1,
  xp: 0,
  xpToNextLevel: 3,
  claimedCount: 0,

  addXP: (amount) => {
    const state = get()
    const newXP = state.xp + amount
    const newClaimedCount = state.claimedCount + amount

    if (newXP >= state.xpToNextLevel) {
      set({
        level: state.level + 1,
        xp: 0,
        xpToNextLevel: state.xpToNextLevel + 2,
        claimedCount: newClaimedCount,
      })
      return true
    }

    set({ xp: newXP, claimedCount: newClaimedCount })
    return false
  },

  reset: () =>
    set({
      level: 1,
      xp: 0,
      xpToNextLevel: 3,
      claimedCount: 0,
    }),
}))
