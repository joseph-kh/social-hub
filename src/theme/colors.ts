export const colors = {
  bg: '#080C1A',
  surface: '#0F1528',
  surfaceAlt: '#161D35',
  textPrimary: '#F0F4FF',
  textSecondary: '#8B95B8',
  success: '#00F5A0',
  error: '#FF4D6A',
  warning: '#FFB830',
  purple: '#A855F7',
  blue: '#00D4FF',
  pink: '#F637EC',
  orange: '#FF8A30',

  neonPurple: 'rgba(168, 85, 247, 0.55)',
  neonCyan: 'rgba(0, 212, 255, 0.55)',
  neonPink: 'rgba(246, 55, 236, 0.55)',
  neonGreen: 'rgba(0, 245, 160, 0.55)',
  surfaceGlow: 'rgba(168, 85, 247, 0.06)',

  edgeCyan: '#6ECBF5',
  edgePurple: '#C252E1',
  edgePink: '#F637EC',
  edgeBlue: '#586AE2',
  midnight: '#2A2356',
} as const

export type ColorName = keyof typeof colors
