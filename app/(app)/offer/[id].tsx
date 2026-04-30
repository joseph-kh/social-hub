import { Screen } from '@/components/layout/Screen'
import { ClaimButton } from '@/components/offers/ClaimButton'
import { useClaimOffer } from '@/hooks/useClaimOffer'
import { useOffersStore } from '@/store/offers.store'
import { colors } from '@/theme/colors'
import { radius } from '@/theme/radius'
import { spacing } from '@/theme/spacing'
import { typography } from '@/theme/typography'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useLocalSearchParams, useRouter } from 'expo-router'
import LottieView from 'lottie-react-native'
import { MotiView } from 'moti'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const treasureBoxAnimation = require('../../../assets/animations/treasure-box.json')
const rewardsAnimation = require('../../../assets/animations/rewards.json')
const diamondAnimation = require('../../../assets/animations/diamond.json')

const difficultyColors = {
  easy: colors.success,
  medium: colors.warning,
  hard: colors.error,
}

function DetailEdgeLight({
  color,
  position,
}: {
  color: string
  position: 'top' | 'right' | 'bottom' | 'left'
}) {
  const isHorizontal = position === 'top' || position === 'bottom'
  const phaseMap = { top: 0, right: 1250, bottom: 2500, left: 3750 }
  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: [0, 0.5, 0] }}
      transition={{
        type: 'timing',
        duration: 5000,
        loop: true,
        delay: phaseMap[position],
        repeatReverse: false,
      }}
      style={[
        detailEdge.base,
        isHorizontal ? detailEdge.horizontal : detailEdge.vertical,
        position === 'top' && { top: 0 },
        position === 'bottom' && { bottom: 0 },
        position === 'left' && { left: 0 },
        position === 'right' && { right: 0 },
      ]}
    >
      <LinearGradient
        colors={['transparent', color, 'transparent']}
        start={isHorizontal ? { x: 0, y: 0 } : { x: 0, y: 0 }}
        end={isHorizontal ? { x: 1, y: 0 } : { x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </MotiView>
  )
}

const detailEdge = StyleSheet.create({
  base: { position: 'absolute', zIndex: 2 },
  horizontal: { left: 16, right: 16, height: 2 },
  vertical: { top: 16, bottom: 16, width: 2 },
})

export default function OfferDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const offer = useOffersStore((s) => s.offers.find((o) => o.id === id))
  const { claim } = useClaimOffer()

  if (!offer) {
    return (
      <Screen>
        <Text style={styles.notFound}>Offer not found</Text>
      </Screen>
    )
  }

  const isClaimed = offer.claimStatus === 'claimed'
  const accentColor = isClaimed ? colors.success : offer.accentColor

  return (
    <Screen>
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.backButton}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
      </TouchableOpacity>

      <MotiView
        animate={{ translateY: [0, -6, 0] }}
        transition={{ type: 'timing', duration: 2000, loop: true }}
      >
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 300 }}
        >
          <View style={[styles.cardOuter, { borderColor: accentColor + '20' }]}>
            <DetailEdgeLight color={accentColor} position="top" />
            <DetailEdgeLight color={accentColor} position="right" />
            <DetailEdgeLight color={accentColor} position="bottom" />
            <DetailEdgeLight color={accentColor} position="left" />

            <View style={styles.card}>
              <View style={styles.cardInner}>
                <View style={styles.headerRow}>
                  <Ionicons
                    name="game-controller"
                    size={22}
                    color={accentColor}
                  />
                  <Text style={styles.gameName}>{offer.gameName}</Text>
                </View>

                <View style={styles.badges}>
                  <View style={styles.genreBadge}>
                    <Text style={styles.genreText}>{offer.genre}</Text>
                  </View>
                  <View
                    style={[
                      styles.diffBadge,
                      {
                        backgroundColor:
                          difficultyColors[offer.difficulty] + '18',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.diffText,
                        { color: difficultyColors[offer.difficulty] },
                      ]}
                    >
                      {offer.difficulty}
                    </Text>
                  </View>
                  {isClaimed && (
                    <View style={styles.claimedDetailBadge}>
                      <Ionicons
                        name="checkmark-circle"
                        size={13}
                        color={colors.success}
                      />
                      <Text style={styles.claimedDetailText}>CLAIMED</Text>
                    </View>
                  )}
                </View>

                <MotiView
                  animate={{ translateY: [0, -10, 0] }}
                  transition={{ type: 'timing', duration: 2000, loop: true }}
                  style={styles.rewardVisualWrapper}
                >
                  <View
                    style={[
                      styles.rewardVisual,
                      {
                        shadowColor: isClaimed
                          ? 'rgba(0,245,160,0.08)'
                          : accentColor + '10',
                      },
                    ]}
                  >
                    <LinearGradient
                      colors={[
                        isClaimed ? 'rgba(0,245,160,0.08)' : accentColor + '10',
                        colors.surface,
                      ]}
                      style={StyleSheet.absoluteFill}
                    />
                    <LottieView
                      source={
                        isClaimed ? rewardsAnimation : treasureBoxAnimation
                      }
                      autoPlay
                      loop
                      style={styles.rewardLottie}
                      speed={isClaimed ? 0.75 : 0.9}
                    />
                  </View>
                </MotiView>

                <View style={styles.section}>
                  <Text style={styles.label}>Task</Text>
                  <Text
                    style={[styles.taskText, isClaimed && styles.taskMuted]}
                  >
                    {offer.task}
                  </Text>
                </View>

                <View style={styles.rewardSection}>
                  <Text style={styles.label}>Reward</Text>
                  <View style={styles.rewardRow}>
                    <LottieView
                      source={diamondAnimation}
                      autoPlay
                      loop
                      style={styles.diamondLottie}
                      speed={0.8}
                    />
                    <Text
                      style={[
                        styles.rewardAmount,
                        isClaimed && styles.rewardMuted,
                      ]}
                    >
                      {offer.rewardAvax}
                    </Text>
                    <Text
                      style={[
                        styles.rewardUnit,
                        isClaimed && styles.rewardMuted,
                      ]}
                    >
                      AVAX
                    </Text>
                  </View>
                </View>

                <View style={styles.expirySection}>
                  <Ionicons
                    name="time-outline"
                    size={16}
                    color={colors.warning}
                  />
                  <Text style={styles.expiryText}>
                    {offer.expiresInHours} hours remaining
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </MotiView>
      </MotiView>
      <View style={styles.claimContainer}>
        <ClaimButton
          status={offer.claimStatus}
          onClaim={() => claim(offer.id)}
        />
      </View>
    </Screen>
  )
}

const styles = StyleSheet.create({
  backButton: {
    marginBottom: spacing.md,
  },
  cardOuter: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg - 1,
  },
  cardInner: {
    padding: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  gameName: {
    ...typography.h1,
    color: colors.textPrimary,
    flex: 1,
  },
  badges: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
    flexWrap: 'wrap',
  },
  genreBadge: {
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
  },
  genreText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  diffBadge: {
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
  },
  diffText: {
    ...typography.small,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  claimedDetailBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 245, 160, 0.1)',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    gap: 3,
  },
  claimedDetailText: {
    ...typography.small,
    color: colors.success,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  rewardVisualWrapper: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  rewardVisual: {
    width: 200,
    height: 200,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(168,85,247,0.15)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  rewardLottie: {
    width: 180,
    height: 180,
  },
  section: {
    marginBottom: spacing.lg,
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  taskText: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 24,
  },
  taskMuted: {
    opacity: 0.5,
    textDecorationLine: 'line-through',
  },
  rewardSection: {
    marginBottom: spacing.lg,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 4,
  },
  diamondLottie: {
    width: 60,
    height: 60,
  },
  rewardAmount: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.success,
  },
  rewardUnit: {
    ...typography.h3,
    color: colors.success,
    opacity: 0.8,
    marginTop: 6,
  },
  rewardMuted: {
    opacity: 0.5,
  },
  expirySection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  expiryText: {
    ...typography.body,
    color: colors.warning,
  },
  claimContainer: {
    marginTop: 'auto',
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  notFound: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
})
