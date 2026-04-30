import { useGameSounds } from '@/hooks/useGameSounds'
import LottieView from 'lottie-react-native'
import { createContext, useContext, useRef, useState } from 'react'
import { Dimensions, View } from 'react-native'
import ConfettiCannon from 'react-native-confetti-cannon'

const coinCollectAnimation = require('../../assets/animations/coin-collect.json')

type CelebrationContextType = {
  triggerCoinCollect: () => void
  triggerLevelUp: () => void
}

const CelebrationContext = createContext<CelebrationContextType>({
  triggerCoinCollect: () => {},
  triggerLevelUp: () => {},
})

const { width } = Dimensions.get('window')

export function CelebrationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [showCoin, setShowCoin] = useState(false)

  const confettiTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const coinTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const playSound = useGameSounds()

  const triggerCoinCollect = () => {
    playSound('coin')
    if (coinTimer.current) clearTimeout(coinTimer.current)
    setShowCoin(true)
    coinTimer.current = setTimeout(() => setShowCoin(false), 1600)
  }

  const triggerLevelUp = () => {
    playSound('win')
    if (confettiTimer.current) clearTimeout(confettiTimer.current)
    setShowConfetti(true)
    confettiTimer.current = setTimeout(() => setShowConfetti(false), 4000)
  }

  return (
    <CelebrationContext.Provider value={{ triggerCoinCollect, triggerLevelUp }}>
      {children}

      {/* Coin collect overlay */}
      {showCoin && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 998,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LottieView
            source={coinCollectAnimation}
            autoPlay
            loop={false}
            style={{ width: 280, height: 280 }}
            speed={1.1}
          />
        </View>
      )}

      {/* Level-up confetti overlay */}
      {showConfetti && (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 999,
          }}
        >
          <ConfettiCannon
            count={150}
            origin={{ x: width / 2, y: 0 }}
            fadeOut
            explosionSpeed={300}
            fallSpeed={2500}
          />
        </View>
      )}
    </CelebrationContext.Provider>
  )
}

export const useCelebration = () => useContext(CelebrationContext)
