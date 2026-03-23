import React from 'react'

export default function EmptyState({ message = 'No data.' }: { message?: string }) {
  return <div className="empty-state">{message}</div>
}
