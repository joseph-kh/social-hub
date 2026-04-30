import { useAuthStore } from '@/store/auth.store'
import { useWalletStore } from '@/store/wallet.store'
import { colors } from '@/theme/colors'
import { radius } from '@/theme/radius'
import { spacing } from '@/theme/spacing'
import { typography } from '@/theme/typography'
import LottieView from 'lottie-react-native'
import { MotiView } from 'moti'
import { StyleSheet, Text, View } from 'react-native'
import { AddressChip } from './AddressChip'
import { BalanceChip } from './BalanceChip'
import { LevelProgressBar } from './LevelProgressBar'

const trophyAnimation = require('../../../assets/animations/trophy.json')

export function WalletHeader() {
  const address = useWalletStore((s) => s.address)
  const balance = useWalletStore((s) => s.avaxBalance)
  const isLoading = useWalletStore((s) => s.isBalanceLoading)
  const user = useAuthStore((s) => s.user)

  if (!address) return null

  return (
    <MotiView
      from={{ opacity: 0, translateY: -10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 300 }}
    >
      <View style={styles.card}>
        <View style={styles.labelRow}>
          <LottieView
            source={trophyAnimation}
            autoPlay
            loop
            style={styles.trophyLottie}
            speed={0.7}
          />
          <Text style={styles.label}>Rewards Wallet</Text>
          {user?.isDemoSession && (
            <View style={styles.demoPill}>
              <Text style={styles.demoText}>Demo</Text>
            </View>
          )}
        </View>
        <BalanceChip balance={balance} isLoading={isLoading} />
        <LevelProgressBar />
        <AddressChip address={address} />
      </View>
    </MotiView>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.15)',
    shadowColor: colors.purple,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: spacing.sm + 2,
  },
  trophyLottie: {
    width: 24,
    height: 24,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  demoPill: {
    backgroundColor: 'rgba(255, 184, 77, 0.15)',
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 4,
  },
  demoText: {
    ...typography.small,
    color: colors.warning,
    fontWeight: '700',
    fontSize: 9,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
})
