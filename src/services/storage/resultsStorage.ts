import { BloodTestResult } from '../../features/blood-test/types'
import { validateBloodTestResults } from '../../features/blood-test/schemas'

const KEY = 'blood_test_results'

export function saveResults(results: BloodTestResult[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(results))
}

export function getResults(): BloodTestResult[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    return validateBloodTestResults(JSON.parse(raw))
  } catch {
    return []
  }
}
