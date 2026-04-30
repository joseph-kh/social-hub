import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View } from 'react-native'
import 'react-native-reanimated'

import { ToastNotification } from '@/components/feedback/ToastNotification'
import { CelebrationProvider } from '@/contexts/CelebrationContext'
import { LoaderProvider } from '@/contexts/LoaderContext'
import { colors } from '@/theme/colors'

export default function RootLayout() {
  return (
    <LoaderProvider>
      <CelebrationProvider>
        <View style={styles.root}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.bg },
              animation: 'fade',
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(app)" />
          </Stack>
          <ToastNotification />
          <StatusBar style="light" />
        </View>
      </CelebrationProvider>
    </LoaderProvider>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
})
