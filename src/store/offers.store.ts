import type { ClaimStatus, Offer } from '@/types/offer'
import { create } from 'zustand'

interface OffersStoreState {
  offers: Offer[]
  isStreaming: boolean
  streamError: string | null
  currentStreamId: string | null

  setStreamId: (id: string) => void
  appendOffer: (offer: Offer, streamId: string) => void
  setClaimStatus: (offerId: string, status: ClaimStatus) => void
  setStreaming: (streaming: boolean) => void
  setStreamError: (error: string | null) => void
  resetOffers: () => void
}

export const useOffersStore = create<OffersStoreState>((set, get) => ({
  offers: [],
  isStreaming: false,
  streamError: null,
  currentStreamId: null,

  setStreamId: (id) => set({ currentStreamId: id }),

  appendOffer: (offer, streamId) => {
    if (get().currentStreamId !== streamId) return
    set((state) => ({ offers: [...state.offers, offer] }))
  },

  setClaimStatus: (offerId, status) =>
    set((state) => ({
      offers: state.offers.map((o) =>
        o.id === offerId ? { ...o, claimStatus: status } : o
      ),
    })),

  setStreaming: (streaming) => set({ isStreaming: streaming }),
  setStreamError: (error) => set({ streamError: error }),

  resetOffers: () =>
    set({
      offers: [],
      isStreaming: false,
      streamError: null,
      currentStreamId: null,
    }),
}))
