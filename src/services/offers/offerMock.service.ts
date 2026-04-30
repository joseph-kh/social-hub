import type { Offer, StreamOfferHandlers } from '@/types/offer'
import { delay } from '@/utils/delay'

const MOCK_OFFERS: Omit<Offer, 'claimStatus'>[] = [
  {
    id: 'offer-1',
    gameName: 'Galaxy Dash',
    genre: 'Endless Runner',
    task: 'Reach level 15 and collect 500 stars',
    rewardAvax: '0.25',
    difficulty: 'easy',
    expiresInHours: 24,
    accentColor: '#8B5CF6',
  },
  {
    id: 'offer-2',
    gameName: 'Block Siege',
    genre: 'Tower Defense',
    task: 'Complete 3 multiplayer battles without losing',
    rewardAvax: '0.50',
    difficulty: 'medium',
    expiresInHours: 12,
    accentColor: '#38BDF8',
  },
  {
    id: 'offer-3',
    gameName: 'Neon Drift',
    genre: 'Racing',
    task: 'Win the Neon Cup championship on hard difficulty',
    rewardAvax: '1.00',
    difficulty: 'hard',
    expiresInHours: 6,
    accentColor: '#EC4899',
  },
]

export const streamMockOffers = async (
  handlers: StreamOfferHandlers,
  streamId: string
): Promise<void> => {
  handlers.onStart?.()

  for (const mockOffer of MOCK_OFFERS) {
    await delay(800 + Math.random() * 400)
    const offer: Offer = { ...mockOffer, claimStatus: 'idle' }
    handlers.onOffer(offer)
  }

  await delay(300)
  handlers.onComplete?.()
}
