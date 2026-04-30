import { usePlayerStore } from '@/store/player.store'
import { colors } from '@/theme/colors'
import { radius } from '@/theme/radius'
import { spacing } from '@/theme/spacing'
import { typography } from '@/theme/typography'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { MotiView } from 'moti'
import { useMemo } from 'react'
import { StyleSheet, Text, View } from 'react-native'

export function LevelProgressBar() {
  const level = usePlayerStore((s) => s.level)
  const xp = usePlayerStore((s) => s.xp)
  const xpToNext = usePlayerStore((s) => s.xpToNextLevel)

  const progressPercent = useMemo(
    () => (xpToNext > 0 ? Math.round((xp / xpToNext) * 100) : 0),
    [xp, xpToNext]
  )

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.levelBadge}>
          <Ionicons name="star" size={11} color={colors.warning} />
          <Text style={styles.levelText}>LVL {level}</Text>
        </View>
        <Text style={styles.xpText}>
          {xp}/{xpToNext}
        </Text>
      </View>
      <View style={styles.track}>
        <MotiView
          animate={{ width: `${progressPercent}%` }}
          transition={{ type: 'timing', duration: 400 }}
          style={styles.fillContainer}
        >
          <LinearGradient
            colors={[colors.purple, colors.pink]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.fill}
          />
        </MotiView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.sm + 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderRadius: radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
  },
  levelText: {
    ...typography.small,
    color: colors.warning,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  xpText: {
    ...typography.small,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  track: {
    height: 10,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  fillContainer: {
    height: '100%',
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  fill: {
    flex: 1,
    borderRadius: radius.full,
  },
})
