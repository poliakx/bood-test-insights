"use client"

import { FormEvent, useState } from 'react'

type ChatInputProps = {
  onSend: (message: string) => Promise<void>
  disabled?: boolean
}

export default function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [value, setValue] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const trimmed = value.trim()
    if (!trimmed || disabled) return

    setValue('')
    await onSend(trimmed)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 items-center gap-2">
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Ask about saved results..."
        disabled={disabled}
        className="h-10 flex-1 rounded-md border border-gray-300 px-3 text-sm outline-none ring-blue-200 focus:ring-2 disabled:bg-gray-100"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="h-10 rounded-md bg-gray-900 px-4 text-sm font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {disabled ? 'Sending...' : 'Send'}
      </button>
    </form>
  )
}
