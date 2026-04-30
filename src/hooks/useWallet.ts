import { getAvaxBalance } from '@/services/sequence/sequenceWallet'
import { useWalletStore } from '@/store/wallet.store'
import { formatAddress } from '@/utils/formatAddress'
import { formatBalance } from '@/utils/formatBalance'
import { useCallback } from 'react'

export function useWallet() {
  const address = useWalletStore((s) => s.address)
  const avaxBalance = useWalletStore((s) => s.avaxBalance)
  const isBalanceLoading = useWalletStore((s) => s.isBalanceLoading)
  const setBalance = useWalletStore((s) => s.setBalance)
  const setBalanceLoading = useWalletStore((s) => s.setBalanceLoading)

  const refresh = useCallback(async () => {
    if (!address) return
    setBalanceLoading(true)
    try {
      const balance = await getAvaxBalance(address)
      setBalance(balance)
    } finally {
      setBalanceLoading(false)
    }
  }, [address, setBalance, setBalanceLoading])

  return {
    address,
    formattedAddress: address ? formatAddress(address) : '',
    avaxBalance,
    formattedBalance: formatBalance(avaxBalance),
    isBalanceLoading,
    refresh,
  }
}
