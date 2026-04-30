import { config } from '@/config/env'
import { delay } from '@/utils/delay'
import { logger } from '@/utils/logger'

const MOCK_BALANCE = '1.2500'

export const getAvaxBalance = async (address: string): Promise<string> => {
  const rpcUrl = config.avalancheRpcUrl.trim()
  if (!rpcUrl) {
    logger.warn(
      'EXPO_PUBLIC_AVALANCHE_RPC_URL is unset; using mock AVAX balance'
    )
    await delay(500)
    return MOCK_BALANCE
  }

  try {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getBalance',
        params: [address, 'latest'],
      }),
    })

    const data = await response.json()

    if (data.result) {
      const wei = BigInt(data.result)
      const avax = Number(wei) / 1e18
      return avax.toFixed(4)
    }

    throw new Error('No result from RPC')
  } catch (error) {
    logger.warn('Balance fetch failed, using mock:', error)
    await delay(500)
    return MOCK_BALANCE
  }
}
