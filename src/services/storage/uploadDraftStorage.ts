import type { UploadPreviewResult, UploadSourceType } from '@/src/features/blood-test/types'

const KEY = 'blood_test_upload_draft'

export type UploadDraft = {
  result: UploadPreviewResult
  sourceType: UploadSourceType
  sourceFileName: string
}

export function saveUploadDraft(draft: UploadDraft) {
  if (typeof window === 'undefined') return
  sessionStorage.setItem(KEY, JSON.stringify(draft))
}

export function getUploadDraft(): UploadDraft | null {
  if (typeof window === 'undefined') return null

  try {
    const raw = sessionStorage.getItem(KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as Partial<UploadDraft>
    if (!parsed || !parsed.result || !parsed.sourceType || !parsed.sourceFileName) {
      return null
    }

    if (!Array.isArray(parsed.result.biomarkers)) return null

    return {
      result: parsed.result,
      sourceType: parsed.sourceType,
      sourceFileName: parsed.sourceFileName,
    }
  } catch {
    return null
  }
}

export function clearUploadDraft() {
  if (typeof window === 'undefined') return
  sessionStorage.removeItem(KEY)
}
