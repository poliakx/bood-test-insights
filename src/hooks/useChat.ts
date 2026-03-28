import { useState } from 'react'
import type { ChatMessage } from '../features/blood-test/types'
import { getChatResponseForPrompt } from '@/src/services/integration/getChatResponseForPrompt'

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
      const responseText = await getChatResponseForPrompt(trimmed)
      const assistantMessage = createMessage('assistant', responseText)

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message.toLowerCase() : ''
      const aiUnavailable = errorMessage.includes('ai unavailable')

      setError(
        aiUnavailable
          ? 'AI is currently unavailable. Please try again later.'
          : 'Could not generate a response. Please try again.',
      )
      const assistantMessage = createMessage(
        'assistant',
        aiUnavailable
          ? 'AI is currently unavailable. Please try again later.'
          : 'Something went wrong while generating a response. Please try again.',
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
