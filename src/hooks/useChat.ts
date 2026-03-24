import { useState } from 'react'
import type { ChatMessage } from '../features/blood-test/types'
import { getResults } from '../services/storage/resultsStorage'
import { buildChatContext } from '../services/chat/buildChatContext'
import { generateChatResponse } from '../services/chat/generateChatResponse'

function createMessage(role: ChatMessage['role'], message: string): ChatMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    message,
    date: new Date().toISOString(),
  }
}

export default function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const send = async (message: string) => {
    const trimmed = message.trim()
    if (!trimmed) return

    const userMessage = createMessage('user', trimmed)
    setMessages((prev) => [...prev, userMessage])
    setError(null)
    setIsLoading(true)

    try {
      const results = getResults()
      const context = buildChatContext(results)
      const responseText = await generateChatResponse(trimmed, context)
      const assistantMessage = createMessage('assistant', responseText)

      setMessages((prev) => [...prev, assistantMessage])
    } catch {
      setError('Failed to generate response')
      const assistantMessage = createMessage(
        'assistant',
        'Something went wrong while generating a response. Please try again.',
      )
      setMessages((prev) => [...prev, assistantMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const clear = () => {
    setMessages([])
    setError(null)
  }

  return { messages, isLoading, error, send, clear }
}
