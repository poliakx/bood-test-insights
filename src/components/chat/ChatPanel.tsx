"use client"

import useChat from '@/src/hooks/useChat'
import ChatMessageList from './ChatMessageList'
import ChatInput from './ChatInput'

export default function ChatPanel() {
  const { messages, isLoading, error, send, clear } = useChat()

  const suggestions = [
    'Give me a summary',
    'Are there any abnormal markers?',
    'What was my latest Glucose?',
  ]

  return (
    <section className="space-y-3">
      <ChatMessageList messages={messages} isLoading={isLoading} />

      {messages.length === 0 ? (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              disabled={isLoading}
              onClick={() => void send(suggestion)}
              className="rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-xs text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <ChatInput onSend={send} disabled={isLoading} />
        <button
          type="button"
          onClick={clear}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 sm:w-auto"
        >
          Clear chat
        </button>
      </div>
    </section>
  )
}
