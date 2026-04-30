import { useLoader } from '@/contexts/LoaderContext'
import {
  signInWithEmail as authEmail,
  signInWithGoogle as authGoogle,
  signOut as authSignOut,
  type AuthResult,
} from '@/services/sequence/sequenceAuth'
import { getAvaxBalance } from '@/services/sequence/sequenceWallet'
import { useAuthStore } from '@/store/auth.store'
import { useOffersStore } from '@/store/offers.store'
import { usePlayerStore } from '@/store/player.store'
import { useUIStore } from '@/store/ui.store'
import { useWalletStore } from '@/store/wallet.store'
import { logger } from '@/utils/logger'
import * as Haptics from 'expo-haptics'
import { useCallback, useState } from 'react'

export function useSequenceAuth() {
  const [isLoading, setIsLoading] = useState(false)

  const setAuthStatus = useAuthStore((s) => s.setStatus)
  const setUser = useAuthStore((s) => s.setUser)
  const resetAuth = useAuthStore((s) => s.reset)

  const setAddress = useWalletStore((s) => s.setAddress)
  const setBalance = useWalletStore((s) => s.setBalance)
  const setBalanceLoading = useWalletStore((s) => s.setBalanceLoading)
  const resetWallet = useWalletStore((s) => s.reset)
  const resetPlayer = usePlayerStore((s) => s.reset)
  const resetOffers = useOffersStore((s) => s.resetOffers)

  const showToast = useUIStore((s) => s.showToast)
  const { showLoader, hideLoader } = useLoader()

  const handleAuthResult = useCallback(
    async (result: AuthResult) => {
      setUser(result.user)
      setAddress(result.walletAddress)
      setAuthStatus('authenticated')
      hideLoader()
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)

      const modeLabel = result.isDemoMode ? ' (Demo)' : ''
      showToast(`Welcome to TapNation!${modeLabel}`, 'success')

      setBalanceLoading(true)
      try {
        const balance = await getAvaxBalance(result.walletAddress)
        setBalance(balance)
      } finally {
        setBalanceLoading(false)
      }
    },
    [
      setUser,
      setAddress,
      setAuthStatus,
      setBalance,
      setBalanceLoading,
      showToast,
      hideLoader,
    ]
  )

  const signInEmail = useCallback(
    async (email: string) => {
      setIsLoading(true)
      setAuthStatus('loading')
      showLoader('Signing in...')
      try {
        const result = await authEmail(email)
        await handleAuthResult(result)
      } catch (error) {
        logger.error('Email sign-in error:', error)
        hideLoader()
        setAuthStatus('unauthenticated')
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
        showToast('Sign in failed. Please try again.', 'error')
      } finally {
        setIsLoading(false)
      }
    },
    [handleAuthResult, setAuthStatus, showToast, showLoader, hideLoader]
  )

  const signInGoogle = useCallback(async () => {
    setIsLoading(true)
    setAuthStatus('loading')
    showLoader('Signing in with Google...')
    try {
      const result = await authGoogle()
      await handleAuthResult(result)
    } catch (error) {
      logger.error('Google sign-in error:', error)
      hideLoader()
      setAuthStatus('unauthenticated')
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
      showToast('Sign in failed. Please try again.', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [handleAuthResult, setAuthStatus, showToast, showLoader, hideLoader])

  const signOut = useCallback(async () => {
    showLoader('Signing out...')
    try {
      await authSignOut()
    } finally {
      hideLoader()
      resetAuth()
      resetWallet()
      resetPlayer()
      resetOffers()
      showToast('Signed out', 'success')
    }
  }, [
    resetAuth,
    resetWallet,
    resetPlayer,
    resetOffers,
    showToast,
    showLoader,
    hideLoader,
  ])

  return {
    isLoading,
    signInEmail,
    signInGoogle,
    signOut,
  }
}
