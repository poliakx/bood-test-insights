import { BloodTestResult } from '../../features/blood-test/types'

export type ChatBiomarkerSnapshot = {
  name: string
  value: number
  unit: string
  testDate: string
  flag?: 'low' | 'normal' | 'high'
}

export type TrendSummary = {
  name: string
  unit: string
  firstValue: number
  latestValue: number
  delta: number
  direction: 'up' | 'down' | 'stable'
}

export type ChatContext = {
  totalResults: number
  latestResult: {
    id: string
    testDate: string
    uploadedAt: string
    sourceFileName: string
    sourceType: BloodTestResult['sourceType']
    biomarkerCount: number
  } | null
  latestBiomarkers: ChatBiomarkerSnapshot[]
  abnormalBiomarkers: ChatBiomarkerSnapshot[]
  availableBiomarkerNames: string[]
  trendSummaries: TrendSummary[]
}

function isBiomarkerAbnormal(biomarker: BloodTestResult['biomarkers'][number]): boolean {
  const range = biomarker.referenceRange
  if (!range) return false
  if (typeof range.min === 'number' && biomarker.value < range.min) return true
  if (typeof range.max === 'number' && biomarker.value > range.max) return true
  return false
}

export function buildChatContext(results: BloodTestResult[]): ChatContext {
  const sorted = [...results].sort(
    (a, b) => Date.parse(b.testDate) - Date.parse(a.testDate),
  )

  const latest = sorted[0]
  const latestBiomarkers = (latest?.biomarkers ?? []).map((item) => ({
    name: item.name,
    value: item.value,
    unit: item.unit,
    testDate: latest.testDate,
    flag: item.flag,
  }))

  const abnormalBiomarkers = (latest?.biomarkers ?? [])
    .filter(isBiomarkerAbnormal)
    .map((item) => ({
      name: item.name,
      value: item.value,
      unit: item.unit,
      testDate: latest.testDate,
      flag: item.flag,
    }))

  const availableBiomarkerNames = Array.from(
    new Set(results.flatMap((result) => result.biomarkers.map((item) => item.name.trim()).filter(Boolean))),
  ).sort((a, b) => a.localeCompare(b))

  const trendSummaries: TrendSummary[] = availableBiomarkerNames.map((name) => {
    const points = sorted
      .map((result) => {
        const biomarker = result.biomarkers.find(
          (item) => item.name.trim().toLowerCase() === name.toLowerCase(),
        )
        return biomarker ? { value: biomarker.value, unit: biomarker.unit } : null
      })
      .filter((point): point is { value: number; unit: string } => point !== null)

    if (points.length < 2) return null

    const first = points[points.length - 1]
    const latestPoint = points[0]
    const delta = latestPoint.value - first.value

    return {
      name,
      unit: latestPoint.unit,
      firstValue: first.value,
      latestValue: latestPoint.value,
      delta,
      direction: delta > 0 ? 'up' : delta < 0 ? 'down' : 'stable',
    }
  }).filter((item): item is TrendSummary => item !== null)

  return {
    totalResults: results.length,
    latestResult: latest
      ? {
          id: latest.id,
          testDate: latest.testDate,
          uploadedAt: latest.uploadedAt,
          sourceFileName: latest.sourceFileName,
          sourceType: latest.sourceType,
          biomarkerCount: latest.biomarkers.length,
        }
      : null,
    latestBiomarkers,
    abnormalBiomarkers,
    availableBiomarkerNames,
    trendSummaries,
  }
}
