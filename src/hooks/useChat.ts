import { useState } from 'react'

export default function useChat() {
  const [messages, setMessages] = useState<string[]>([])

  function send(message: string) {
    setMessages(prev => [...prev, message])
  }

  return { messages, send }
}
