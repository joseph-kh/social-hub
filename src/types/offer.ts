export type ClaimStatus = 'idle' | 'pending' | 'claimed' | 'error'

export interface Offer {
  id: string
  gameName: string
  genre: string
  task: string
  rewardAvax: string
  difficulty: 'easy' | 'medium' | 'hard'
  expiresInHours: number
  accentColor: string
  claimStatus: ClaimStatus
}

export type StreamOfferHandlers = {
  onStart?: () => void
  onOffer: (offer: Offer) => void
  onComplete?: () => void
  onError?: (error: Error) => void
}
