import { colors } from '@/theme/colors'
import { LinearGradient } from 'expo-linear-gradient'
import { StyleSheet, View } from 'react-native'

export function GradientBackground() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient
        colors={[colors.bg, '#040810']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.purpleGlow} />
      <View style={styles.cyanGlow} />
    </View>
  )
}

const styles = StyleSheet.create({
  purpleGlow: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.purple,
    opacity: 0.07,
  },
  cyanGlow: {
    position: 'absolute',
    bottom: -100,
    left: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.blue,
    opacity: 0.05,
  },
})
