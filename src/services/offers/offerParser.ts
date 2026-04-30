import type { Offer } from '@/types/offer'
import { logger } from '@/utils/logger'

export const parseOffers = (raw: string): Offer[] => {
  try {
    const parsed = JSON.parse(raw)
    const offers: unknown[] = Array.isArray(parsed) ? parsed : []

    return offers
      .filter(isValidOffer)
      .map((o) => ({ ...o, claimStatus: 'idle' as const }))
  } catch (error) {
    logger.error('Failed to parse offers:', error)
    return []
  }
}

function isValidOffer(o: unknown): o is Omit<Offer, 'claimStatus'> {
  if (!o || typeof o !== 'object') return false
  const obj = o as Record<string, unknown>
  return (
    typeof obj.id === 'string' &&
    typeof obj.gameName === 'string' &&
    typeof obj.genre === 'string' &&
    typeof obj.task === 'string' &&
    typeof obj.rewardAvax === 'string' &&
    typeof obj.difficulty === 'string' &&
    typeof obj.expiresInHours === 'number' &&
    typeof obj.accentColor === 'string'
  )
}
