import { colors } from '@/theme/colors'
import { radius } from '@/theme/radius'
import { spacing } from '@/theme/spacing'
import { MotiView } from 'moti'
import { StyleSheet, View } from 'react-native'

export function OfferSkeletonCard() {
  return (
    <View style={styles.card}>
      <ShimmerBar width="60%" height={20} />
      <ShimmerBar width="35%" height={14} style={{ marginTop: 6 }} />
      <ShimmerBar width="90%" height={16} style={{ marginTop: spacing.md }} />
      <View style={styles.footer}>
        <ShimmerBar width={80} height={28} />
        <ShimmerBar width={100} height={40} borderRadius={radius.md} />
      </View>
    </View>
  )
}

function ShimmerBar({
  width,
  height,
  borderRadius = radius.sm,
  style,
}: {
  width: number | string
  height: number
  borderRadius?: number
  style?: object
}) {
  return (
    <MotiView
      from={{ opacity: 0.3 }}
      animate={{ opacity: 0.7 }}
      transition={{
        type: 'timing',
        duration: 800,
        loop: true,
      }}
      style={[
        {
          width: width as number,
          height,
          borderRadius,
          backgroundColor: colors.surfaceAlt,
        },
        style,
      ]}
    />
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.surfaceAlt,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
})
