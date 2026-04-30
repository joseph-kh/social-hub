import { logger } from '@/utils/logger'
import { z } from 'zod'

const envSchema = z.object({
  sequenceProjectAccessKey: z.string().default(''),
  sequenceWaasConfigKey: z.string().default(''),
  avalancheRpcUrl: z.string().default(''),
  googleIosClientId: z.string().default(''),
  googleWebClientId: z.string().default(''),
  openaiApiKey: z.string().default(''),
})

const raw = {
  sequenceProjectAccessKey:
    process.env.EXPO_PUBLIC_SEQUENCE_PROJECT_ACCESS_KEY ?? '',
  sequenceWaasConfigKey: process.env.EXPO_PUBLIC_SEQUENCE_WAAS_CONFIG_KEY ?? '',
  avalancheRpcUrl: process.env.EXPO_PUBLIC_AVALANCHE_RPC_URL ?? '',
  googleIosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? '',
  googleWebClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '',
  openaiApiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? '',
}

const parsed = envSchema.safeParse(raw)

if (!parsed.success) {
  logger.warn('Env validation issues:', z.flattenError(parsed.error))
}

export const config = parsed.success
  ? parsed.data
  : (raw as z.infer<typeof envSchema>)

export const isSequenceConfigured =
  config.sequenceProjectAccessKey.length > 0 &&
  config.sequenceWaasConfigKey.length > 0

export const isGoogleConfigured =
  config.googleIosClientId.length > 0 && config.googleWebClientId.length > 0

export const isLLMConfigured = config.openaiApiKey.length > 0

export const isAvalancheRpcConfigured = config.avalancheRpcUrl.length > 0

export const isDemoMode = !isSequenceConfigured
