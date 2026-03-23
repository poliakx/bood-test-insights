import { useState, useEffect } from 'react'
import { BloodTestResult } from '../features/blood-test/types'
import { mockExtractResults } from '../services/extraction/mockExtractResults'
import { loadResults, saveResults } from '../services/storage/resultsStorage'

export default function useBloodTestHistory() {
  const [history, setHistory] = useState<BloodTestResult[]>([])

  useEffect(() => {
    const storedResults = loadResults()

    if (storedResults.length > 0) {
      setHistory(storedResults)
      return
    }

    void mockExtractResults().then((results) => {
      setHistory(results)
      saveResults(results)
    })
  }, [])

  return { history, setHistory }
}
