import { config, isGoogleConfigured } from '@/config/env'
import type { AuthUser } from '@/types/auth'
import { delay } from '@/utils/delay'
import { logger } from '@/utils/logger'
import {
  AuthRequest,
  exchangeCodeAsync,
  type AccessTokenRequestConfig,
} from 'expo-auth-session'
import { Platform } from 'react-native'
import { isSequenceConfigured, sequenceWaas } from './sequenceClient'

const MOCK_WALLET = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'

export interface AuthResult {
  user: AuthUser
  walletAddress: string
  isDemoMode: boolean
}

export const signInWithEmail = async (email: string): Promise<AuthResult> => {
  if (!isSequenceConfigured || !sequenceWaas) {
    return mockSignIn('email', email)
  }

  try {
    const challenge = await sequenceWaas.signIn({ email }, randomName())
    if ('wallet' in challenge && challenge.wallet) {
      return {
        user: { id: challenge.wallet, email, provider: 'email' },
        walletAddress: challenge.wallet,
        isDemoMode: false,
      }
    }
    throw new Error('Email sign-in did not return wallet')
  } catch (error) {
    logger.warn('Sequence email sign-in failed, using mock:', error)
    return mockSignIn('email', email)
  }
}

export const signInWithGoogle = async (): Promise<AuthResult> => {
  if (!isSequenceConfigured || !sequenceWaas) {
    return mockSignIn('google')
  }

  try {
    if (!isGoogleConfigured) {
      throw new Error('Google sign-in is not configured for this build.')
    }

    const redirectUri = `${Platform.select({
      ios: `com.googleusercontent.apps.${config.googleIosClientId.split('.')[0]}`,
      default: config.googleWebClientId,
    })}:/oauthredirect`

    const request = new AuthRequest({
      clientId: config.googleIosClientId,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
      usePKCE: true,
      extraParams: {
        audience: config.googleWebClientId,
        include_granted_scopes: 'true',
      },
    })

    const result = await request.promptAsync({
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    })

    if (result.type !== 'success') {
      throw new Error('Google auth cancelled or failed')
    }

    const tokenConfig: AccessTokenRequestConfig = {
      code: result.params.code,
      redirectUri,
      clientId: config.googleIosClientId,
      extraParams: {
        code_verifier: request.codeVerifier || '',
        audience: config.googleWebClientId,
      },
    }

    const tokenResponse = await exchangeCodeAsync(tokenConfig, {
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
    })

    if (!tokenResponse.idToken) {
      throw new Error('No idToken from Google')
    }

    const signInResult = await sequenceWaas.signIn(
      { idToken: tokenResponse.idToken },
      randomName()
    )

    if (!signInResult.wallet) {
      throw new Error('No wallet from Sequence')
    }

    return {
      user: { id: signInResult.wallet, provider: 'google' },
      walletAddress: signInResult.wallet,
      isDemoMode: false,
    }
  } catch (error) {
    logger.warn('Google sign-in failed, using mock:', error)
    return mockSignIn('google')
  }
}

export const restoreSession = async (): Promise<AuthResult | null> => {
  if (!isSequenceConfigured || !sequenceWaas) {
    return null
  }

  try {
    const isSignedIn = await sequenceWaas.isSignedIn()
    if (!isSignedIn) return null

    const address = await sequenceWaas.getAddress()
    return {
      user: { id: address, provider: 'email' },
      walletAddress: address,
      isDemoMode: false,
    }
  } catch (error) {
    logger.warn('Session restore failed:', error)
    return null
  }
}

export const signOut = async (): Promise<void> => {
  if (sequenceWaas) {
    try {
      await sequenceWaas.dropSession()
    } catch (error) {
      logger.warn('Sign out error:', error)
    }
  }
}

async function mockSignIn(
  provider: 'email' | 'google' | 'apple',
  email?: string
): Promise<AuthResult> {
  await delay(1200)
  return {
    user: {
      id: MOCK_WALLET,
      email: email ?? `demo@tapnation.${provider}`,
      provider,
      isDemoSession: true,
    },
    walletAddress: MOCK_WALLET,
    isDemoMode: true,
  }
}

function randomName(): string {
  return `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}
