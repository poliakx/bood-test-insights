import { BloodTestResult } from '../../features/blood-test/types'

export type ChatBiomarkerSnapshot = {
  name: string
  value: number
  unit: string
  testDate: string
  flag?: 'low' | 'normal' | 'high'
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
  }
}
