import { useState, useEffect, useCallback } from 'react'
import { BloodTestResult } from '../features/blood-test/types'
import { getResults, saveResults } from '../services/storage/resultsStorage'

export const BLOOD_TEST_SAVED_EVENT = 'bloodTestSaved'

export default function useBloodTestHistory() {
  const [history, setHistory] = useState<BloodTestResult[]>([])

  const loadHistory = useCallback(() => {
    const storedResults = getResults()

    setHistory(storedResults)
  }, [])

  useEffect(() => {
    loadHistory()

    window.addEventListener(BLOOD_TEST_SAVED_EVENT, loadHistory)
    return () => window.removeEventListener(BLOOD_TEST_SAVED_EVENT, loadHistory)
  }, [loadHistory])

  const deleteResult = useCallback((id: string) => {
    setHistory((prev) => {
      const next = prev.filter((item) => item.id !== id)
      saveResults(next)
      return next
    })
  }, [])

  return { history, setHistory, deleteResult }
}
