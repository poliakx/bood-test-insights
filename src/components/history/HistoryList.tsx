"use client"

import { useState } from 'react'
import useBloodTestHistory from '@/src/hooks/useBloodTestHistory'
import ResultCard from './ResultCard'

export default function HistoryList() {
  const { history, deleteResult } = useBloodTestHistory()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (history.length === 0) {
    return <p className="text-sm text-gray-500">No blood test history yet.</p>
  }

  return (
    <ul className="space-y-3">
      {history.map((result) => (
        <li key={result.id}>
          <ResultCard
            result={result}
            isExpanded={expandedId === result.id}
            onToggleDetails={() => {
              setExpandedId((prev) => (prev === result.id ? null : result.id))
            }}
            onDelete={() => {
              deleteResult(result.id)
              setExpandedId((prev) => (prev === result.id ? null : prev))
            }}
          />
        </li>
      ))}
    </ul>
  )
}
