import { colors } from '@/theme/colors'
import { spacing } from '@/theme/spacing'
import { typography } from '@/theme/typography'
import { StyleSheet, Text, View } from 'react-native'

interface EmptyStateProps {
  message: string
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🎮</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  emoji: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  message: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
})
