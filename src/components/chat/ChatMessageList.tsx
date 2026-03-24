"use client"

import type { ChatMessage } from '@/src/features/blood-test/types'

type ChatMessageListProps = {
  messages: ChatMessage[]
  isLoading: boolean
}

export default function ChatMessageList({ messages, isLoading }: ChatMessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-500">
        Ask a question about your saved blood test results.
      </div>
    )
  }

  return (
    <div className="space-y-2 rounded-md border border-gray-200 bg-gray-50 p-3">
      {messages.map((item) => (
        <article
          key={item.id}
          className={
            item.role === 'user'
              ? 'ml-auto max-w-[85%] rounded-md bg-blue-600 px-3 py-2 text-sm text-white'
              : 'mr-auto max-w-[85%] rounded-md bg-white px-3 py-2 text-sm text-gray-800'
          }
        >
          <p className="whitespace-pre-wrap">{item.message}</p>
        </article>
      ))}
      {isLoading ? <p className="text-xs text-gray-500">Generating response...</p> : null}
    </div>
  )
}
