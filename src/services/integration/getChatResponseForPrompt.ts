import { buildChatContext } from '@/src/services/chat/buildChatContext'
import { generateChatResponse } from '@/src/services/chat/generateChatResponse'
import { getResults } from '@/src/services/storage/resultsStorage'

export async function getChatResponseForPrompt(prompt: string): Promise<string> {
  const results = getResults()
  const context = buildChatContext(results)
  return generateChatResponse(prompt, context)
}
