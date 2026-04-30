import { colors } from '@/theme/colors'
import { LinearGradient } from 'expo-linear-gradient'
import { AnimatePresence, MotiText, MotiView } from 'moti'
import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react'
import { StyleSheet, View } from 'react-native'

type LoaderContextType = {
  showLoader: (message?: string) => void
  hideLoader: () => void
}

const LoaderContext = createContext<LoaderContextType>({
  showLoader: () => {},
  hideLoader: () => {},
})

export const useLoader = () => useContext(LoaderContext)

function NeonArc({
  size,
  color,
  duration,
  arcWidth,
  arcOpacity,
}: {
  size: number
  color: string
  duration: number
  arcWidth: number
  arcOpacity: number
}) {
  return (
    <MotiView
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: arcWidth,
        borderColor: 'transparent',
        borderTopColor: color,
        opacity: arcOpacity,
        shadowColor: color,
        shadowOpacity: 0.6,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 0 },
      }}
      from={{ rotate: '0deg' }}
      animate={{ rotate: '360deg' }}
      transition={{
        rotate: {
          loop: true,
          type: 'timing',
          duration,
        },
      }}
    />
  )
}

function HexPulse() {
  return (
    <MotiView
      style={{
        width: 10,
        height: 10,
        borderRadius: 3,
        backgroundColor: colors.blue,
        shadowColor: colors.blue,
        shadowOpacity: 0.8,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 0 },
        elevation: 3,
      }}
      from={{ scale: 0.8, opacity: 0.4 }}
      animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.4, 1, 0.4] }}
      transition={{
        type: 'timing',
        duration: 1400,
        loop: true,
      }}
    />
  )
}

function HexPulseRotated() {
  return (
    <View style={{ transform: [{ rotate: '45deg' }] }}>
      <HexPulse />
    </View>
  )
}

function ShimmerLabel({ text }: { text: string }) {
  return (
    <MotiText
      style={styles.message}
      from={{ opacity: 0.4 }}
      animate={{ opacity: [0.4, 0.9, 0.4] }}
      transition={{
        opacity: {
          type: 'timing',
          duration: 900,
          loop: true,
        },
      }}
    >
      {text}
    </MotiText>
  )
}

function ProgressDash({ delay, color }: { delay: number; color: string }) {
  return (
    <MotiView
      style={{
        height: 3,
        borderRadius: 2,
        backgroundColor: color,
      }}
      from={{ width: 6, opacity: 0.2 }}
      animate={{ width: [6, 18, 6], opacity: [0.2, 1, 0.2] }}
      transition={{
        loop: true,
        delay,
        opacity: {
          type: 'timing',
          duration: 300,
        },
        width: {
          type: 'timing',
          duration: 300,
        },
      }}
    />
  )
}

function GlobalLoader({
  visible,
  message,
}: {
  visible: boolean
  message: string
}) {
  return (
    <AnimatePresence>
      {visible && (
        <MotiView
          key="global-loader-backdrop"
          pointerEvents="auto"
          style={styles.backdrop}
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ opacity: { type: 'timing', duration: 180 } }}
          exitTransition={{ opacity: { type: 'timing', duration: 120 } }}
        >
          <View style={styles.blurFallback} />
          <MotiView
            style={styles.card}
            from={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{
              opacity: { type: 'timing', duration: 180 },
              scale: {
                type: 'spring',
                damping: 8,
                stiffness: 90,
              },
            }}
            exitTransition={{
              opacity: { type: 'timing', duration: 120 },
              scale: { type: 'timing', duration: 120 },
            }}
          >
            <LinearGradient
              colors={[colors.surface, colors.bg]}
              style={styles.cardInner}
            >
              <LinearGradient
                colors={['transparent', 'rgba(168,85,247,0.35)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.topEdge}
              />

              <View style={styles.spinnerWrap}>
                <NeonArc
                  size={64}
                  color={colors.purple}
                  duration={1200}
                  arcWidth={2.5}
                  arcOpacity={1}
                />
                <NeonArc
                  size={46}
                  color={colors.blue}
                  duration={900}
                  arcWidth={2}
                  arcOpacity={0.7}
                />
                <NeonArc
                  size={30}
                  color={colors.pink}
                  duration={650}
                  arcWidth={1.5}
                  arcOpacity={0.5}
                />
                <HexPulseRotated />
              </View>

              <ShimmerLabel text={message} />

              <View style={styles.dashRow}>
                {[0, 200, 400].map((delay, i) => (
                  <ProgressDash
                    key={i}
                    delay={delay}
                    color={
                      i === 0
                        ? colors.purple
                        : i === 1
                          ? colors.blue
                          : colors.pink
                    }
                  />
                ))}
              </View>
            </LinearGradient>
          </MotiView>
        </MotiView>
      )}
    </AnimatePresence>
  )
}

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState('Please wait...')

  const messageRef = useRef(message)

  const showLoader = useCallback((msg = 'Please wait...') => {
    setMessage(msg)
    messageRef.current = msg
    setVisible(true)
  }, [])

  const hideLoader = useCallback(() => {
    setVisible(false)
  }, [])

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}
      <GlobalLoader
        visible={visible}
        message={visible ? message : messageRef.current}
      />
    </LoaderContext.Provider>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  blurFallback: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(4,8,16,0.5)',
  },
  card: {
    width: 190,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: colors.purple,
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(168,85,247,0.2)',
  },
  cardInner: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 18,
  },
  topEdge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  spinnerWrap: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  message: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 14,
    textTransform: 'uppercase',
  },
  dashRow: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
})
