import type { ChatContext } from './buildChatContext'

export async function generateChatResponse(
  prompt: string,
  context: ChatContext,
): Promise<string> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, context }),
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(
      (body as { error?: string }).error ?? 'Chat request failed',
    )
  }

  const data = await response.json() as { response: string }
  return data.response
}
