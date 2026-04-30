import { useUIStore } from '@/store/ui.store'
import { colors } from '@/theme/colors'
import { radius } from '@/theme/radius'
import { spacing } from '@/theme/spacing'
import { typography } from '@/theme/typography'
import { formatAddress } from '@/utils/formatAddress'
import { Ionicons } from '@expo/vector-icons'
import * as Clipboard from 'expo-clipboard'
import { useCallback, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'

interface AddressChipProps {
  address: string
}

export function AddressChip({ address }: AddressChipProps) {
  const showToast = useUIStore((s) => s.showToast)
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    await Clipboard.setStringAsync(address)
    setCopied(true)
    showToast('Address copied!', 'success')
    setTimeout(() => setCopied(false), 2000)
  }, [address, showToast])

  return (
    <TouchableOpacity
      style={styles.chip}
      onPress={handleCopy}
      activeOpacity={0.7}
    >
      <Text style={styles.label}>{formatAddress(address, 4)}</Text>
      <Ionicons
        name={copied ? 'checkmark' : 'copy-outline'}
        size={13}
        color={copied ? colors.success : colors.textSecondary}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    alignSelf: 'flex-start',
  },
  label: {
    ...typography.caption,
    color: colors.textSecondary,
    fontFamily: 'monospace',
  },
})
