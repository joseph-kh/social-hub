import {
  isSequenceConfigured,
  sequenceWaas,
} from '@/services/sequence/sequenceClient'
import { logger } from '@/utils/logger'
import { useEffect, useState } from 'react'

interface UseEmailAuthProps {
  sessionName: string
  onSuccess: (result: { wallet: string; sessionId: string }) => void
}

export function useEmailAuth({ onSuccess, sessionName }: UseEmailAuthProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [inProgress, setInProgress] = useState(false)
  const [respondWithCode, setRespondWithCode] = useState<
    ((code: string) => Promise<void>) | null
  >(null)

  useEffect(() => {
    if (!isSequenceConfigured || !sequenceWaas) return
    return sequenceWaas.onEmailAuthCodeRequired(
      async (respond: (code: string) => Promise<void>) => {
        setLoading(false)
        setRespondWithCode(() => respond)
      }
    )
  }, [])

  const initiateAuth = async (email: string) => {
    if (!isSequenceConfigured || !sequenceWaas) {
      setError('Sequence not configured')
      return
    }
    setLoading(true)
    setInProgress(true)
    setError(null)
    try {
      const res = await sequenceWaas.signIn({ email }, sessionName)
      onSuccess(res)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Sign-in failed')
      logger.error('Email auth error:', e)
    } finally {
      setLoading(false)
      setInProgress(false)
    }
  }

  const signInAsGuest = async () => {
    if (!isSequenceConfigured || !sequenceWaas) {
      setError('Sequence not configured')
      return
    }
    setLoading(true)
    setInProgress(true)
    setError(null)
    try {
      const res = await sequenceWaas.signIn({ guest: true }, sessionName)
      onSuccess(res)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Guest sign-in failed')
      logger.error('Guest auth error:', e)
    } finally {
      setLoading(false)
      setInProgress(false)
    }
  }

  const sendChallengeAnswer = async (answer: string) => {
    if (!respondWithCode) return
    setLoading(true)
    try {
      await respondWithCode(answer)
      const wallet = await sequenceWaas!.getAddress()
      const sessionId = await sequenceWaas!.getSessionId()
      onSuccess({ wallet, sessionId })
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Invalid verification code')
      logger.error('OTP verification error:', e)
    } finally {
      setLoading(false)
      setInProgress(false)
    }
  }

  const cancel = () => {
    setInProgress(false)
    setLoading(false)
    setRespondWithCode(null)
    setError(null)
  }

  return {
    inProgress,
    initiateAuth,
    loading,
    error,
    sendChallengeAnswer: inProgress ? sendChallengeAnswer : undefined,
    cancel,
    signInAsGuest,
  }
}
