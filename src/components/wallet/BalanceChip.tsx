import { colors } from '@/theme/colors'
import { spacing } from '@/theme/spacing'
import { typography } from '@/theme/typography'
import { formatBalance } from '@/utils/formatBalance'
import LottieView from 'lottie-react-native'
import { MotiView } from 'moti'
import { useEffect, useRef } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'

const diamondAnimation = require('../../../assets/animations/diamond.json')

interface BalanceChipProps {
  balance: string
  isLoading: boolean
}

export function BalanceChip({ balance, isLoading }: BalanceChipProps) {
  const prevBalance = useRef(balance)
  const didChange = prevBalance.current !== balance

  useEffect(() => {
    prevBalance.current = balance
  }, [balance])

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.success} />
      ) : (
        <MotiView
          animate={{ scale: didChange ? [1, 1.1, 1] : 1 }}
          transition={{ type: 'timing', duration: 500 }}
          style={[styles.row, didChange && styles.glowActive]}
        >
          <MotiView
            animate={{ scale: didChange ? [1, 1.25, 1] : 1 }}
            transition={{ type: 'timing', duration: 400 }}
          >
            <LottieView
              source={diamondAnimation}
              autoPlay
              loop
              style={styles.diamond}
              speed={0.8}
            />
          </MotiView>
          <Text style={styles.amount}>{formatBalance(balance)}</Text>
          <Text style={styles.unit}>AVAX</Text>
        </MotiView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  glowActive: {
    shadowColor: colors.neonGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 6,
  },
  diamond: {
    width: 40,
    height: 40,
  },
  amount: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.success,
    lineHeight: 36,
    textShadowColor: colors.neonGreen,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  unit: {
    ...typography.bodyBold,
    color: colors.success,
    opacity: 0.7,
    marginTop: 4,
  },
})
