import { useCelebration } from '@/contexts/CelebrationContext'
import { useLoader } from '@/contexts/LoaderContext'
import { claimOffer } from '@/services/claim/claim.service'
import { useOffersStore } from '@/store/offers.store'
import { usePlayerStore } from '@/store/player.store'
import { useUIStore } from '@/store/ui.store'
import { useWalletStore } from '@/store/wallet.store'
import { delay } from '@/utils/delay'
import * as Haptics from 'expo-haptics'
import { useCallback } from 'react'

export function useClaimOffer() {
  const offers = useOffersStore((s) => s.offers)
  const setClaimStatus = useOffersStore((s) => s.setClaimStatus)
  const incrementBalance = useWalletStore((s) => s.incrementBalance)
  const addXP = usePlayerStore((s) => s.addXP)
  const showToast = useUIStore((s) => s.showToast)
  const { triggerCoinCollect, triggerLevelUp } = useCelebration()
  const { showLoader, hideLoader } = useLoader()

  const claim = useCallback(
    async (offerId: string) => {
      const offer = offers.find((o) => o.id === offerId)
      if (
        !offer ||
        offer.claimStatus === 'pending' ||
        offer.claimStatus === 'claimed'
      ) {
        return
      }

      setClaimStatus(offerId, 'pending')
      showLoader('Claiming reward...')

      const result = await claimOffer(offerId, offer.rewardAvax)

      hideLoader()

      if (result.success) {
        setClaimStatus(offerId, 'claimed')
        incrementBalance(offer.rewardAvax)

        const didLevelUp = addXP(1)

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
        await delay(60)
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

        if (didLevelUp) {
          triggerLevelUp()
          const newLevel = usePlayerStore.getState().level
          showToast(`Level ${newLevel} reached! 🎉`, 'success')
        } else {
          triggerCoinCollect()
          showToast(
            `${offer.gameName} — ${offer.rewardAvax} AVAX claimed!`,
            'success'
          )
        }
      } else {
        setClaimStatus(offerId, 'error')
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        showToast(result.error ?? 'Claim failed. Tap to retry.', 'error')
      }
    },
    [
      offers,
      setClaimStatus,
      incrementBalance,
      addXP,
      showToast,
      triggerCoinCollect,
      triggerLevelUp,
      showLoader,
      hideLoader,
    ]
  )

  return { claim }
}
