export interface WalletState {
  address: string | null
  avaxBalance: string
  isBalanceLoading: boolean
  lastUpdatedAt?: number
}
