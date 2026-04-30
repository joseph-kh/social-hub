import { spacing } from '@/theme/spacing'
import { type ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { GradientBackground } from './GradientBackground'

interface ScreenProps {
  children: ReactNode
  padded?: boolean
}

export function Screen({ children, padded = true }: ScreenProps) {
  return (
    <View style={styles.root}>
      <GradientBackground />
      <SafeAreaView
        style={[styles.safe, padded && styles.padded]}
        edges={['top', 'bottom']}
      >
        {children}
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: spacing.md,
  },
})
