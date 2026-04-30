import EmailAuthView from '@/components/auth/EmailAuthView'
import { Screen } from '@/components/layout/Screen'
import { isDemoMode } from '@/config/env'
import { useSequenceAuth } from '@/hooks/useSequenceAuth'
import { isSequenceConfigured } from '@/services/sequence/sequenceClient'
import { getAvaxBalance } from '@/services/sequence/sequenceWallet'
import { useAuthStore } from '@/store/auth.store'
import { useWalletStore } from '@/store/wallet.store'
import { colors } from '@/theme/colors'
import { radius } from '@/theme/radius'
import { spacing } from '@/theme/spacing'
import { typography } from '@/theme/typography'
import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { MotiView } from 'moti'
import React, { useEffect, useState } from 'react'
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

const { width: SCREEN_W } = Dimensions.get('window')

const PREVIEW_CARDS = [
  {
    amount: '0.25',
    color: colors.purple,
    neon: colors.neonPurple,
    rotation: '-18deg',
    delay: 0,
    pos: { left: SCREEN_W * 0.04, top: 6 },
  },
  {
    amount: '1.00',
    color: colors.blue,
    neon: colors.neonCyan,
    rotation: '13deg',
    delay: 180,
    pos: { left: SCREEN_W - 140, top: -20 },
  },
  {
    amount: '0.50',
    color: colors.pink,
    neon: colors.neonPink,
    rotation: '-6deg',
    delay: 360,
    pos: { left: SCREEN_W * 0.68, top: 78 },
  },
]

export default function SignInScreen() {
  const router = useRouter()
  const { isLoading, signInEmail, signInGoogle } = useSequenceAuth()
  const authStatus = useAuthStore((s) => s.status)
  const setUser = useAuthStore((s) => s.setUser)
  const setAuthStatus = useAuthStore((s) => s.setStatus)
  const setAddress = useWalletStore((s) => s.setAddress)
  const setBalance = useWalletStore((s) => s.setBalance)
  const setBalanceLoading = useWalletStore((s) => s.setBalanceLoading)

  const [showEmailAuth, setShowEmailAuth] = useState(false)

  useEffect(() => {
    if (authStatus === 'authenticated') {
      router.replace('/(app)')
    }
  }, [authStatus, router])

  const handleEmailAuthSuccess = async (walletAddress: string) => {
    setShowEmailAuth(false)
    setUser({ id: walletAddress, provider: 'email' })
    setAddress(walletAddress)
    setAuthStatus('authenticated')

    setBalanceLoading(true)
    try {
      const balance = await getAvaxBalance(walletAddress)
      setBalance(balance)
    } finally {
      setBalanceLoading(false)
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.previewContainer} pointerEvents="none">
          {PREVIEW_CARDS.map((card, i) => (
            <MotiView
              key={i}
              from={{ opacity: 0, scale: 0.7 }}
              animate={{
                opacity: 0.5,
                scale: 1,
                translateY: [0, -8, 0],
                translateX: [0, i % 2 === 0 ? -2.5 : 2.5, 0],
              }}
              transition={{
                opacity: {
                  type: 'timing',
                  duration: 500,
                  delay: 200 + card.delay,
                },
                scale: { type: 'spring', damping: 10, delay: 200 + card.delay },
                translateY: {
                  type: 'timing',
                  duration: 3000 + i * 500,
                  loop: true,
                  delay: 800 + card.delay,
                },
                translateX: {
                  type: 'timing',
                  duration: 4200 + i * 400,
                  loop: true,
                  delay: 1200 + card.delay,
                },
              }}
              style={[
                styles.previewCard,
                {
                  backgroundColor: card.color,
                  transform: [{ rotate: card.rotation }],
                  ...card.pos,
                  shadowColor: card.neon,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.75,
                  shadowRadius: 14,
                  elevation: 8,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.18)',
                },
              ]}
            >
              <Text style={styles.previewAmount}>{card.amount}</Text>
              <Text style={styles.previewUnit}>AVAX</Text>
            </MotiView>
          ))}
        </View>

        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: [0.09, 0.14, 0.09] }}
          transition={{ type: 'timing', duration: 4500, loop: true }}
          style={styles.glowPurpleOuter}
          pointerEvents="none"
        />
        <View style={styles.glowPurpleCore} pointerEvents="none" />

        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: [0.07, 0.11, 0.07] }}
          transition={{
            type: 'timing',
            duration: 5500,
            loop: true,
            delay: 1000,
          }}
          style={styles.glowCyanRight}
          pointerEvents="none"
        />

        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: [0.06, 0.09, 0.06] }}
          transition={{
            type: 'timing',
            duration: 6000,
            loop: true,
            delay: 2000,
          }}
          style={styles.glowPinkBottom}
          pointerEvents="none"
        />

        <View style={[styles.content, styles.contentAboveFloating]}>
          <MotiView
            from={{ opacity: 0, translateY: -16 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400 }}
          >
            <View style={styles.logoDots}>
              <View
                style={[styles.logoDot, { backgroundColor: colors.purple }]}
              />
              <View
                style={[styles.logoDot, { backgroundColor: colors.blue }]}
              />
              <View
                style={[styles.logoDot, { backgroundColor: colors.pink }]}
              />
            </View>
            <Text style={styles.brand}>Social Hub</Text>
          </MotiView>

          <MotiView
            from={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'timing', duration: 300, delay: 100 }}
          >
            <View style={styles.companyBadge}>
              <Text style={styles.companyBadgeText}>✦ TapNation</Text>
            </View>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 350, delay: 200 }}
          >
            <Text style={styles.tagline}>
              Play more. Earn more.{'\n'}
              <Text style={styles.taglineAccent}>
                Your rewards hub is ready.
              </Text>
            </Text>
          </MotiView>

          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'timing', duration: 350, delay: 290 }}
          >
            <Text style={styles.subtitle}>
              AI-powered offers. Real AVAX rewards. Zero friction.
            </Text>
          </MotiView>
        </View>

        <MotiView
          from={{ opacity: 0, translateY: 36 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: 'spring',
            damping: 18,
            stiffness: 200,
            delay: 300,
          }}
          style={styles.actions}
        >
          <TouchableOpacity
            style={styles.emailButtonOuter}
            onPress={() => {
              if (isSequenceConfigured) {
                setShowEmailAuth(true)
              } else {
                signInEmail('demo@tapnation.io')
              }
            }}
            activeOpacity={0.82}
          >
            <LinearGradient
              colors={['#C084FC', colors.purple, '#7C3AED']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.emailButtonGradient}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color={colors.textPrimary}
              />
              <Text style={styles.buttonLabel}>Sign in with Email</Text>
            </LinearGradient>
          </TouchableOpacity>

          {!isDemoMode && (
            <TouchableOpacity
              style={[styles.button, styles.googleButton]}
              onPress={signInGoogle}
              activeOpacity={0.8}
            >
              <Ionicons
                name="logo-google"
                size={18}
                color={colors.textPrimary}
              />
              <Text style={styles.buttonLabel}>Continue with Google</Text>
            </TouchableOpacity>
          )}

          {isDemoMode && (
            <TouchableOpacity
              style={[styles.button, styles.guestButton]}
              onPress={() => signInEmail('guest@demo.tapnation.io')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="person-outline"
                size={18}
                color={colors.textSecondary}
              />
              <Text style={styles.guestLabel}>Continue as Guest (Demo)</Text>
            </TouchableOpacity>
          )}
        </MotiView>

        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: 'timing', duration: 300, delay: 500 }}
        >
          <Text style={styles.footer}>
            Powered by Sequence · No seed phrases required
          </Text>
        </MotiView>
      </KeyboardAvoidingView>

      {showEmailAuth && (
        <EmailAuthView
          onCancel={() => setShowEmailAuth(false)}
          onSuccess={handleEmailAuthSuccess}
        />
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },

  previewContainer: {
    position: 'absolute',
    top: '6%',
    left: 0,
    right: 0,
    height: 140,
  },
  previewCard: {
    position: 'absolute',
    width: 80,
    height: 50,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
  },
  previewUnit: {
    fontSize: 9,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 1,
  },

  glowPurpleOuter: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: colors.purple,
    top: -80,
    left: -120,
  },
  glowPurpleCore: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.purple,
    opacity: 0.2,
    top: 10,
    left: -30,
  },
  glowCyanRight: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.blue,
    top: '32%',
    right: -90,
  },
  glowPinkBottom: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.pink,
    bottom: '6%',
    alignSelf: 'center',
  },

  content: {
    alignItems: 'center',
    marginBottom: spacing.xxl + spacing.md,
  },
  contentAboveFloating: {
    zIndex: 2,
  },
  logoDots: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  brand: {
    fontSize: 46,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.5,
    textShadowColor: colors.neonPurple,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  companyBadge: {
    marginTop: 6,
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    alignSelf: 'center',
  },
  companyBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 1.8,
  },
  tagline: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.lg,
    fontSize: 20,
    lineHeight: 28,
  },
  taglineAccent: {
    color: colors.success,
    fontWeight: '700',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },

  actions: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  emailButtonOuter: {
    borderRadius: radius.xl,
    shadowColor: colors.purple,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.65,
    shadowRadius: 20,
    elevation: 12,
  },
  emailButtonGradient: {
    borderRadius: radius.xl,
    paddingVertical: spacing.md + 4,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(168,85,247,0.4)',
    overflow: 'hidden',
  },
  button: {
    borderRadius: radius.lg,
    paddingVertical: spacing.md + 2,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  googleButton: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  guestButton: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  buttonLabel: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  guestLabel: {
    ...typography.bodyBold,
    color: colors.textSecondary,
  },

  footer: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    textAlign: 'center',
    opacity: 0.75,
    lineHeight: 18,
  },
})
