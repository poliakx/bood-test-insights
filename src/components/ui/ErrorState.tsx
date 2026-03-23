import React from 'react'

export default function ErrorState({ message = 'An error occurred.' }: { message?: string }) {
  return <div className="error-state">{message}</div>
}
