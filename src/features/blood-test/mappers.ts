import { Biomarker, BloodTestResult } from './types'

export function mapRawToBiomarker(raw: any): Biomarker {
  return {
    id: String(raw.id ?? ''),
    name: String(raw.name ?? 'Unknown'),
    value: Number(raw.value ?? 0),
    unit: raw.unit,
    measuredAt: raw.measuredAt,
  }
}

export function mapRawToResult(raw: any): BloodTestResult {
  return {
    id: String(raw.id ?? ''),
    date: raw.date ?? new Date().toISOString(),
    biomarkers: (raw.biomarkers ?? []).map(mapRawToBiomarker),
  }
}
