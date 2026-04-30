import { colors } from '@/theme/colors'
import { radius } from '@/theme/radius'
import { spacing } from '@/theme/spacing'
import { typography } from '@/theme/typography'
import type { ClaimStatus } from '@/types/offer'
import * as Haptics from 'expo-haptics'
import LottieView from 'lottie-react-native'
import { AnimatePresence, MotiView } from 'moti'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

const coinAnimation = require('../../../assets/animations/coin.json')

interface ClaimButtonProps {
  status: ClaimStatus
  onClaim: () => void
}

const FACE_COLORS: Record<
  string,
  { top: string; bottom: string; base: string; shadow: string }
> = {
  idle: {
    top: colors.purple,
    bottom: '#7C3AED',
    base: '#4C1D95',
    shadow: colors.neonPurple,
  },
  claimed: {
    top: colors.success,
    bottom: '#00C882',
    base: '#006644',
    shadow: colors.neonGreen,
  },
  error: {
    top: colors.error,
    bottom: '#CC3352',
    base: '#7F1D2E',
    shadow: colors.error,
  },
  pending: {
    top: colors.surfaceAlt,
    bottom: colors.surfaceAlt,
    base: '#0F1528',
    shadow: 'transparent',
  },
}

function getLabel(status: ClaimStatus): string {
  switch (status) {
    case 'idle':
      return 'Claim'
    case 'claimed':
      return 'Claimed'
    case 'error':
      return 'Retry'
    default:
      return 'Claim'
  }
}

export function ClaimButton({ status, onClaim }: ClaimButtonProps) {
  const handlePress = () => {
    if (status !== 'idle' && status !== 'error') return
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    onClaim()
  }

  const isDisabled = status === 'pending' || status === 'claimed'
  const isPressed = status === 'pending'
  const scheme = FACE_COLORS[status] ?? FACE_COLORS.idle

  return (
    <View style={styles.wrapper}>
      {/* Idle pulse glow -- stays local to button */}
      {status === 'idle' && (
        <MotiView
          from={{ opacity: 0.45, scale: 1 }}
          animate={{ opacity: 0, scale: 1.18 }}
          transition={{ type: 'timing', duration: 1200, loop: true }}
          style={[
            styles.glowRing,
            { borderColor: colors.purple, shadowColor: colors.neonPurple },
          ]}
        />
      )}

      {/* Burst ring on claim -- stays local */}
      <AnimatePresence>
        {status === 'claimed' && (
          <MotiView
            key="burst"
            from={{ opacity: 0.85, scale: 0.85 }}
            animate={{ opacity: 0, scale: 2.2 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'timing', duration: 550 }}
            style={[
              styles.burstRing,
              { borderColor: colors.success, shadowColor: colors.neonGreen },
            ]}
          />
        )}
      </AnimatePresence>

      {/* 3D button: base (depth edge) + face (top surface) */}
      <MotiView
        animate={{ scale: isPressed ? 0.96 : status === 'claimed' ? 1.04 : 1 }}
        transition={{ type: 'spring', damping: 14, stiffness: 220 }}
      >
        {/* Base layer — the "bottom edge" giving 3D depth */}
        <View style={[styles.base, { backgroundColor: scheme.base }]}>
          {/* Face layer */}
          <TouchableOpacity
            onPress={handlePress}
            disabled={isDisabled}
            activeOpacity={1}
            style={[
              styles.face,
              {
                backgroundColor: scheme.top,
                shadowColor: scheme.shadow,
                // Shift down when pressed to simulate pressing in
                transform: [{ translateY: isPressed ? 3 : 0 }],
              },
            ]}
          >
            {/* Gloss highlight at top of button face */}
            {!isPressed && <View style={styles.gloss} />}

            <View style={styles.faceContent}>
              {status === 'pending' ? (
                <ActivityIndicator size="small" color={colors.textPrimary} />
              ) : status === 'idle' ? (
                <>
                  <Text style={styles.label}>Claim</Text>
                  <View style={styles.coinWrap} pointerEvents="none">
                    <LottieView
                      source={coinAnimation}
                      autoPlay
                      loop
                      style={styles.coin}
                      speed={0.85}
                    />
                  </View>
                </>
              ) : (
                <Text
                  style={[
                    styles.label,
                    status === 'claimed' && styles.claimedLabel,
                  ]}
                >
                  {getLabel(status)}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </MotiView>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    minHeight: 50,
  },
  glowRing: {
    position: 'absolute',
    width: 120,
    height: 50,
    borderRadius: radius.md + 2,
    borderWidth: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 3,
  },
  burstRing: {
    position: 'absolute',
    width: 120,
    height: 50,
    borderRadius: radius.xl,
    borderWidth: 3.5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 14,
    elevation: 5,
  },
  base: {
    borderRadius: radius.md + 1,
    // The base sticks out below giving a 3D edge
    paddingBottom: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  face: {
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 3,
    paddingHorizontal: spacing.lg + 2,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 110,
    minHeight: 42,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  gloss: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '42%',
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  faceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  coinWrap: {
    width: 24,
    height: 24,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coin: {
    width: 36,
    height: 36,
  },
  label: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  claimedLabel: {
    fontWeight: '700',
  },
})
