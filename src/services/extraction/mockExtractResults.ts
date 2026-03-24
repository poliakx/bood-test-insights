import { MOCK_BLOOD_TEST_RESULTS } from "@/src/mocks/mockExtractResults"
import type { BloodTestResult } from "@/src/features/blood-test/types"

export async function mockExtractResults(): Promise<BloodTestResult[]> {
  return MOCK_BLOOD_TEST_RESULTS
}
