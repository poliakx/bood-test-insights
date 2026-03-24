import { Biomarker, BloodTestResult } from './types'

export function mapRawToBiomarker(raw: any): Biomarker {
  return {
    id: String(raw.id ?? ''),
    name: String(raw.name ?? 'Unknown'),
    value: Number(raw.value ?? 0),
    unit: String(raw.unit ?? ''),
    referenceRange: raw.referenceRange
      ? {
          min: raw.referenceRange.min,
          max: raw.referenceRange.max,
        }
      : undefined,
    flag: raw.flag,
  }
}

export function mapRawToResult(raw: any): BloodTestResult {
  const now = new Date().toISOString()

  return {
    id: String(raw.id ?? ''),
    testDate: String(raw.testDate ?? now),
    uploadedAt: String(raw.uploadedAt ?? now),
    sourceFileName: String(raw.sourceFileName ?? 'unknown'),
    sourceType: raw.sourceType ?? 'csv',
    biomarkers: (raw.biomarkers ?? []).map(mapRawToBiomarker),
  }
}
