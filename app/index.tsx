import { GradientBackground } from '@/components/layout/GradientBackground'
import { useBootstrap } from '@/hooks/useBootstrap'
import { colors } from '@/theme/colors'
import { typography } from '@/theme/typography'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'

export default function IndexRoute() {
  const router = useRouter()
  const { isReady, isAuthenticated } = useBootstrap()

  useEffect(() => {
    if (!isReady) return

    if (isAuthenticated) {
      router.replace('/(app)')
    } else {
      router.replace('/(auth)/sign-in')
    }
  }, [isReady, isAuthenticated, router])

  return (
    <View style={styles.container}>
      <GradientBackground />
      <Text style={styles.title}>TapNation</Text>
      <Text style={styles.subtitle}>Social Hub</Text>
      <ActivityIndicator
        size="large"
        color={colors.purple}
        style={styles.spinner}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    fontSize: 36,
    fontWeight: '800',
  },
  subtitle: {
    ...typography.h2,
    color: colors.purple,
    marginTop: 4,
  },
  spinner: {
    marginTop: 32,
  },
})
