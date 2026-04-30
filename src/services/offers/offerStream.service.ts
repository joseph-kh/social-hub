import type { StreamOfferHandlers } from '@/types/offer'
import { delay } from '@/utils/delay'
import { logger } from '@/utils/logger'
import { streamMockOffers } from './offerMock.service'
import { parseOffers } from './offerParser'
import { SYSTEM_PROMPT, USER_PROMPT } from './offerPrompt'

const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY ?? ''

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

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: USER_PROMPT },
      ],
      temperature: 0.9,
    }),
  })

  if (!response.ok) {
    throw new Error(`LLM API error: ${response.status}`)
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content ?? '[]'
  const offers = parseOffers(content)

  for (const offer of offers) {
    await delay(600 + Math.random() * 400)
    handlers.onOffer(offer)
  }

  handlers.onComplete?.()
}
