import type { ClaimResult } from '@/types/claim'
import { delay } from '@/utils/delay'
import { logger } from '@/utils/logger'

export const claimOffer = async (
  offerId: string,
  rewardAvax: string
): Promise<ClaimResult> => {
  void rewardAvax
  try {
    await delay(1500)

    const mockTxHash = `0x${Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('')}`

    logger.info(`Claim successful for offer ${offerId}:`, mockTxHash)

    return {
      success: true,
      txHash: mockTxHash,
    }
  } catch (error) {
    logger.error('Claim failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Claim failed',
    }
  }
}
