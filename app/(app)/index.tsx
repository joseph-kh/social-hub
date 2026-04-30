import { Screen } from '@/components/layout/Screen'
import { OfferList } from '@/components/offers/OfferList'
import { WalletHeader } from '@/components/wallet/WalletHeader'
import { useClaimOffer } from '@/hooks/useClaimOffer'
import { useOfferStream } from '@/hooks/useOfferStream'
import { useSequenceAuth } from '@/hooks/useSequenceAuth'
import { useAuthStore } from '@/store/auth.store'
import { colors } from '@/theme/colors'
import { spacing } from '@/theme/spacing'
import { typography } from '@/theme/typography'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import LottieView from 'lottie-react-native'
import { MotiView } from 'moti'
import { useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const fireAnimation = require('../../assets/animations/fire.json')

export default function HomeScreen() {
  const router = useRouter()
  const { isStreaming, startStream, refresh } = useOfferStream()
  const { claim } = useClaimOffer()
  const { signOut } = useSequenceAuth()
  const authStatus = useAuthStore((s) => s.status)

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.replace('/(auth)/sign-in')
    }
  }, [authStatus, router])

  useEffect(() => {
    startStream()
  }, [])

  const handleOfferPress = (id: string) => {
    router.push(`/(app)/offer/${id}`)
  }

  return (
    <Screen>
      <WalletHeader />

      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 250, delay: 100 }}
      >
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <LottieView
              source={fireAnimation}
              autoPlay
              loop
              style={styles.fireLottie}
              speed={0.9}
            />
            <Text style={styles.sectionTitle}>Your Offers</Text>
          </View>
          <TouchableOpacity
            onPress={refresh}
            disabled={isStreaming}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <MotiView
              animate={{ rotate: isStreaming ? '360deg' : '0deg' }}
              transition={{
                type: 'timing',
                duration: isStreaming ? 1000 : 300,
                loop: isStreaming,
              }}
            >
              <Ionicons
                name="refresh"
                size={22}
                color={isStreaming ? colors.textSecondary : colors.purple}
              />
            </MotiView>
          </TouchableOpacity>
        </View>
      </MotiView>

      <OfferList
        onClaim={claim}
        onOfferPress={handleOfferPress}
        onRefresh={refresh}
      />

      <TouchableOpacity
        style={styles.signOutButton}
        onPress={signOut}
        activeOpacity={0.7}
      >
        <Ionicons
          name="log-out-outline"
          size={16}
          color={colors.textSecondary}
        />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </Screen>
  )
}

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  fireLottie: {
    width: 28,
    height: 28,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: spacing.md,
  },
  signOutText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
})
