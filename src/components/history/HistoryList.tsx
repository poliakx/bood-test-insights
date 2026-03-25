"use client"

import { useState } from 'react'
import useBloodTestHistory from '@/src/hooks/useBloodTestHistory'
import ResultCard from './ResultCard'

export default function HistoryList() {
  const { history, deleteResult } = useBloodTestHistory()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  if (history.length === 0) {
    return (
      <p className="rounded-md border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-500">
        No saved results yet. Upload and save a test to build your history.
      </p>
    )
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
