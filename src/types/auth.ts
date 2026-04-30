export type AuthStatus =
  | 'idle'
  | 'loading'
  | 'authenticated'
  | 'unauthenticated'

export type AuthProvider = 'email' | 'google' | 'apple'

export interface AuthUser {
  id: string
  email?: string
  provider: AuthProvider
  isDemoSession?: boolean
}
