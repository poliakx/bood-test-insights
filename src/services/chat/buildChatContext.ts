import { BloodTestResult } from '../../features/blood-test/types'

export function buildChatContext(results: BloodTestResult[]) {
  return results.map(r => ({ id: r.id, date: r.date }))
}
