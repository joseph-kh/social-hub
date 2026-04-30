import { colors } from '@/theme/colors'
import { radius } from '@/theme/radius'
import { spacing } from '@/theme/spacing'
import { typography } from '@/theme/typography'
import type { Offer } from '@/types/offer'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { MotiView } from 'moti'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { ClaimButton } from './ClaimButton'

interface OfferCardProps {
  offer: Offer
  index: number
  onClaim: (offerId: string) => void
  onPress: (offerId: string) => void
}

const difficultyColors = {
  easy: colors.success,
  medium: colors.warning,
  hard: colors.error,
}

function EdgeLight({
  color,
  position,
  loopDuration,
  phaseDelay,
}: {
  color: string
  position: 'top' | 'right' | 'bottom' | 'left'
  loopDuration: number
  phaseDelay: number
}) {
  const isHorizontal = position === 'top' || position === 'bottom'
  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: [0, 0.55, 0] }}
      transition={{
        type: 'timing',
        duration: loopDuration,
        loop: true,
        delay: phaseDelay,
        repeatReverse: false,
      }}
      style={[
        edgeStyles.base,
        isHorizontal ? edgeStyles.horizontal : edgeStyles.vertical,
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

const CYCLE = 4000

export function OfferCard({ offer, index, onClaim, onPress }: OfferCardProps) {
  const isClaimed = offer.claimStatus === 'claimed'
  const edgeColor = isClaimed ? colors.success : offer.accentColor
  const offset = index * 400

  return (
    <MotiView
      from={{ opacity: 0, translateY: 24 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 300, delay: index * 100 }}
    >
      <View style={styles.cardOuter}>
        <EdgeLight
          color={edgeColor}
          position="top"
          loopDuration={CYCLE}
          phaseDelay={offset}
        />
        <EdgeLight
          color={edgeColor}
          position="right"
          loopDuration={CYCLE}
          phaseDelay={offset + CYCLE * 0.25}
        />
        <EdgeLight
          color={edgeColor}
          position="bottom"
          loopDuration={CYCLE}
          phaseDelay={offset + CYCLE * 0.5}
        />
        <EdgeLight
          color={edgeColor}
          position="left"
          loopDuration={CYCLE}
          phaseDelay={offset + CYCLE * 0.75}
        />

        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => onPress(offer.id)}
          style={styles.card}
        >
          <View style={styles.cardInner}>
            <View style={styles.header}>
              <View style={styles.titleRow}>
                <View style={styles.gameNameRow}>
                  <Ionicons
                    name="game-controller"
                    size={15}
                    color={isClaimed ? colors.success : offer.accentColor}
                    style={styles.gameIcon}
                  />
                  <Text
                    style={[styles.gameName, isClaimed && styles.textMuted]}
                    numberOfLines={1}
                  >
                    {offer.gameName}
                  </Text>
                </View>
                {isClaimed ? (
                  <View style={styles.claimedBadge}>
                    <Ionicons
                      name="checkmark-circle"
                      size={13}
                      color={colors.success}
                    />
                    <Text style={styles.claimedBadgeText}>CLAIMED</Text>
                  </View>
                ) : (
                  <View
                    style={[
                      styles.difficultyBadge,
                      {
                        backgroundColor:
                          difficultyColors[offer.difficulty] + '18',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.difficultyText,
                        { color: difficultyColors[offer.difficulty] },
                      ]}
                    >
                      {offer.difficulty}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.genre}>{offer.genre}</Text>
            </View>

            <Text
              style={[styles.task, isClaimed && styles.taskClaimed]}
              numberOfLines={2}
            >
              {offer.task}
            </Text>

            <View style={styles.footer}>
              <View style={styles.rewardSection}>
                <View style={styles.rewardRow}>
                  <Text
                    style={[
                      styles.rewardAmount,
                      isClaimed && styles.rewardMuted,
                    ]}
                  >
                    {offer.rewardAvax}
                  </Text>
                  <Text
                    style={[styles.rewardUnit, isClaimed && styles.rewardMuted]}
                  >
                    {' '}
                    AVAX
                  </Text>
                </View>
                <View style={styles.expiryRow}>
                  <Ionicons
                    name="time-outline"
                    size={11}
                    color={colors.textSecondary}
                  />
                  <Text style={styles.expiry}>
                    {offer.expiresInHours}h left
                  </Text>
                </View>
              </View>
              <ClaimButton
                status={offer.claimStatus}
                onClaim={() => onClaim(offer.id)}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </MotiView>
  )
}

const edgeStyles = StyleSheet.create({
  base: {
    position: 'absolute',
    zIndex: 2,
  },
  horizontal: {
    left: 12,
    right: 12,
    height: 2,
  },
  vertical: {
    top: 12,
    bottom: 12,
    width: 2,
  },
})

const styles = StyleSheet.create({
  cardOuter: {
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.08)',
    overflow: 'hidden',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg - 1,
  },
  cardInner: {
    padding: spacing.md,
  },
  header: {
    marginBottom: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  gameNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  gameIcon: {
    marginRight: 6,
  },
  gameName: {
    ...typography.h3,
    color: colors.textPrimary,
    flex: 1,
  },
  textMuted: {
    color: colors.textSecondary,
  },
  genre: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: 21,
  },
  difficultyBadge: {
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  difficultyText: {
    ...typography.small,
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  claimedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 245, 160, 0.1)',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    gap: 3,
  },
  claimedBadgeText: {
    ...typography.small,
    color: colors.success,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  task: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 21,
  },
  taskClaimed: {
    opacity: 0.45,
    textDecorationLine: 'line-through',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rewardSection: {
    gap: 3,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  rewardAmount: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.success,
    lineHeight: 28,
  },
  rewardUnit: {
    ...typography.bodyBold,
    color: colors.success,
    opacity: 0.75,
  },
  rewardMuted: {
    opacity: 0.4,
  },
  expiryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  expiry: {
    ...typography.small,
    color: colors.textSecondary,
  },
})
