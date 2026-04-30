import { useUIStore, type ToastType } from '@/store/ui.store'
import { colors } from '@/theme/colors'
import { radius } from '@/theme/radius'
import { spacing } from '@/theme/spacing'
import { typography } from '@/theme/typography'
import { Ionicons } from '@expo/vector-icons'
import { AnimatePresence, MotiView } from 'moti'
import { StyleSheet, Text } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

const toastConfig: Record<
  ToastType,
  { color: string; icon: string; shadowColor: string }
> = {
  success: {
    color: colors.success,
    icon: 'checkmark-circle',
    shadowColor: colors.neonGreen,
  },
  error: {
    color: colors.error,
    icon: 'close-circle',
    shadowColor: colors.error,
  },
  warning: {
    color: colors.warning,
    icon: 'warning',
    shadowColor: colors.warning,
  },
}

export function ToastNotification() {
  const toast = useUIStore((s) => s.toast)
  const insets = useSafeAreaInsets()

  return (
    <AnimatePresence>
      {toast.visible && (
        <MotiView
          from={{ opacity: 0, translateY: -40, scale: 0.92 }}
          animate={{ opacity: 1, translateY: 0, scale: 1 }}
          exit={{ opacity: 0, translateY: -20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 14, stiffness: 180 }}
          exitTransition={{ type: 'timing', duration: 100 }}
          style={[
            styles.container,
            {
              bottom: insets.bottom + spacing.sm,
              borderLeftColor: toastConfig[toast.type].color,
              shadowColor: toastConfig[toast.type].shadowColor,
            },
          ]}
          pointerEvents="none"
        >
          <MotiView
            from={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 10, delay: 100 }}
          >
            <Ionicons
              name={
                toastConfig[toast.type].icon as keyof typeof Ionicons.glyphMap
              }
              size={22}
              color={toastConfig[toast.type].color}
            />
          </MotiView>
          <Text style={styles.message}>{toast.message}</Text>
        </MotiView>
      )}
    </AnimatePresence>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderLeftWidth: 5,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    zIndex: 9999,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  message: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
  },
})
