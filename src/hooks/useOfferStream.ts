import { streamOffers } from '@/services/offers/offerStream.service'
import { useOffersStore } from '@/store/offers.store'
import { logger } from '@/utils/logger'
import { useCallback, useRef } from 'react'

export function useOfferStream() {
  const offers = useOffersStore((s) => s.offers)
  const isStreaming = useOffersStore((s) => s.isStreaming)
  const streamError = useOffersStore((s) => s.streamError)

  const setStreamId = useOffersStore((s) => s.setStreamId)
  const appendOffer = useOffersStore((s) => s.appendOffer)
  const setStreaming = useOffersStore((s) => s.setStreaming)
  const setStreamError = useOffersStore((s) => s.setStreamError)
  const resetOffers = useOffersStore((s) => s.resetOffers)

  const activeStreamRef = useRef<string | null>(null)

  const startStream = useCallback(async () => {
    const streamId = `stream-${Date.now()}`
    activeStreamRef.current = streamId

    resetOffers()
    setStreamId(streamId)
    setStreaming(true)
    setStreamError(null)

    try {
      await streamOffers(
        {
          onStart: () => {
            logger.info('Offer stream started:', streamId)
          },
          onOffer: (offer) => {
            if (activeStreamRef.current !== streamId) return
            appendOffer(offer, streamId)
          },
          onComplete: () => {
            if (activeStreamRef.current !== streamId) return
            setStreaming(false)
            logger.info('Offer stream complete:', streamId)
          },
          onError: (error) => {
            if (activeStreamRef.current !== streamId) return
            setStreamError(error.message)
            setStreaming(false)
            logger.error('Offer stream error:', error)
          },
        },
        streamId
      )
    } catch (error) {
      if (activeStreamRef.current === streamId) {
        setStreamError(error instanceof Error ? error.message : 'Stream failed')
        setStreaming(false)
      }
    }
  }, [resetOffers, setStreamId, appendOffer, setStreaming, setStreamError])

  const refresh = useCallback(() => {
    startStream()
  }, [startStream])

  return {
    offers,
    isStreaming,
    streamError,
    startStream,
    refresh,
  }
}
