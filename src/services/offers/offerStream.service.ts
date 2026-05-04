import type { StreamOfferHandlers } from '@/types/offer'
import { delay } from '@/utils/delay'
import { logger } from '@/utils/logger'
import OpenAI from 'openai'
import { streamMockOffers } from './offerMock.service'
import { parseOffers } from './offerParser'
import { SYSTEM_PROMPT, USER_PROMPT } from './offerPrompt'

const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? ''

const client = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true,
})

export const streamOffers = async (
  handlers: StreamOfferHandlers,
  streamId: string
): Promise<void> => {
  if (apiKey) {
    try {
      await streamLLMOffers(handlers, streamId)
      return
    } catch (error) {
      logger.warn('LLM streaming failed, falling back to mock:', error)
    }
  }

  await streamMockOffers(handlers, streamId)
}

async function streamLLMOffers(
  handlers: StreamOfferHandlers,
  streamId: string
): Promise<void> {
  handlers.onStart?.()

  logger.info('Starting LLM offer stream with ID:', streamId)

  const completion = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: USER_PROMPT },
    ],
    temperature: 0.9,
  })

  const content = completion.choices[0].message.content ?? '[]'
  const offers = parseOffers(content)

  for (const offer of offers) {
    await delay(600 + Math.random() * 400)
    handlers.onOffer(offer)
  }

  handlers.onComplete?.()
}
