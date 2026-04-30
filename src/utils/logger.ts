const isDev = __DEV__

export const logger = {
  info: (...args: unknown[]) => {
    if (isDev) console.log('[SocialHub]', ...args)
  },
  warn: (...args: unknown[]) => {
    if (isDev) console.warn('[SocialHub]', ...args)
  },
  error: (...args: unknown[]) => {
    console.error('[SocialHub]', ...args)
  },
}
