import type { BloodTestResult } from '@/src/features/blood-test/types'

export type TrendDataPoint = {
  date: string
  value: number
}

export function buildTrendData(
  results: BloodTestResult[],
  selectedBiomarkerName: string,
): TrendDataPoint[] {
  const normalizedName = selectedBiomarkerName.trim().toLowerCase()
  if (!normalizedName) return []

  const points: TrendDataPoint[] = []

  for (const result of results) {
    const biomarker = result.biomarkers.find(
      (item) => item.name.trim().toLowerCase() === normalizedName,
    )

    if (!biomarker || !Number.isFinite(biomarker.value)) continue

    const timestamp = Date.parse(result.testDate)
    if (Number.isNaN(timestamp)) continue

    points.push({
      date: result.testDate,
      value: biomarker.value,
    })
  }

  return points.sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
}