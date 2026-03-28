import type { BloodTestResult } from '@/features/blood-test/types'
import { BLOOD_TEST_SAVED_EVENT } from '@/hooks/useBloodTestHistory'
import { getResults, saveResults } from '@/services/storage/resultsStorage'

export function saveReviewedUploadResult(result: BloodTestResult) {
  const existingResults = getResults()
  saveResults([result, ...existingResults])
  window.dispatchEvent(new CustomEvent(BLOOD_TEST_SAVED_EVENT))
}

