import { buildChatContext } from '@/services/chat/buildChatContext'
import { generateChatResponse } from '@/services/chat/generateChatResponse'
import { getResults } from '@/services/storage/resultsStorage'

export async function getChatResponseForPrompt(prompt: string): Promise<string> {
  if (process.env.NEXT_PUBLIC_AI_UNAVAILABLE === '1') {
    throw new Error('AI unavailable')
  }

  const results = getResults()
  const context = buildChatContext(results)
  return generateChatResponse(prompt, context)
}

