import React from 'react'
import ChatMessageList from './ChatMessageList'
import ChatInput from './ChatInput'

export default function ChatPanel() {
  return (
    <section>
      <ChatMessageList />
      <ChatInput />
    </section>
  )
}
