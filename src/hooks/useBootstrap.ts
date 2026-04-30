import { restoreSession } from '@/services/sequence/sequenceAuth'
import { getAvaxBalance } from '@/services/sequence/sequenceWallet'
import { useAuthStore } from '@/store/auth.store'
import { useWalletStore } from '@/store/wallet.store'
import { logger } from '@/utils/logger'
import { useEffect, useState } from 'react'

interface BootstrapState {
  isReady: boolean
  isAuthenticated: boolean
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ])
}

export function useBootstrap(): BootstrapState {
  const [isReady, setIsReady] = useState(false)
  const authStatus = useAuthStore((s) => s.status)
  const setAuthStatus = useAuthStore((s) => s.setStatus)
  const setUser = useAuthStore((s) => s.setUser)
  const setAddress = useWalletStore((s) => s.setAddress)
  const setBalance = useWalletStore((s) => s.setBalance)
  const setBalanceLoading = useWalletStore((s) => s.setBalanceLoading)

  useEffect(() => {
    let mounted = true

    const bootstrap = async () => {
      try {
        const result = await withTimeout(restoreSession(), 5000)

        if (!mounted) return

        if (result) {
          setUser(result.user)
          setAddress(result.walletAddress)
          setAuthStatus('authenticated')

          setBalanceLoading(true)
          const balance = await withTimeout(
            getAvaxBalance(result.walletAddress),
            5000
          )
          if (mounted) {
            setBalance(balance ?? '0.0000')
            setBalanceLoading(false)
          }
        } else {
          setAuthStatus('unauthenticated')
        }
      } catch (error) {
        logger.error('Bootstrap failed:', error)
        if (mounted) setAuthStatus('unauthenticated')
      } finally {
        if (mounted) setIsReady(true)
      }
    }

    bootstrap()
    return () => {
      mounted = false
    }
  }, [])

  return {
    isReady,
    isAuthenticated: authStatus === 'authenticated',
  }
}
