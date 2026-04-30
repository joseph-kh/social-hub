import { logger } from '@/utils/logger'
import { useAudioPlayer } from 'expo-audio'

export type SoundKey = 'coin' | 'win'

export function useGameSounds(): (sound: SoundKey) => void {
  const coinPlayer = useAudioPlayer(require('../../assets/sounds/coin.mp3'))
  const winPlayer = useAudioPlayer(require('../../assets/sounds/win.mp3'))

  return (sound: SoundKey) => {
    try {
      if (sound === 'coin') {
        coinPlayer.seekTo(0)
        coinPlayer.play()
      } else {
        winPlayer.seekTo(0)
        winPlayer.play()
      }
    } catch (err) {
      logger.warn(`Sound "${sound}" playback failed:`, err)
    }
  }
}
