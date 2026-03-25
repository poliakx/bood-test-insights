import { useMemo, useState } from 'react'
import type {
  BloodTestResult,
  PreviewBiomarker,
  UploadPreviewResult,
} from '@/src/features/blood-test/types'
import { clearUploadDraft, getUploadDraft } from '@/src/services/storage/uploadDraftStorage'
import { saveReviewedUploadResult } from '@/src/services/integration/saveReviewedUploadResult'
import { getBiomarkerMeta } from '@/src/components/upload/getBiomarkerMeta'
import { validatePreview } from '@/src/components/upload/validatePreview'

export default function useUploadReviewData() {
  const initialDraft = useMemo(() => getUploadDraft(), [])
  const [result, setResult] = useState<UploadPreviewResult | null>(initialDraft?.result ?? null)
  const [saveMessage, setSaveMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSaved, setIsSaved] = useState(false)

  const sourceType = initialDraft?.sourceType ?? 'csv'
  const sourceFileName = initialDraft?.sourceFileName ?? 'manual-entry'

  const handleBiomarkerChange = (
    id: string,
    field: 'name' | 'value' | 'unit' | 'refMin' | 'refMax',
    value: string,
  ) => {
    setResult((prev) => {
      if (!prev) return prev

      const biomarkers = prev.biomarkers.map((biomarker) => {
        if (biomarker.id !== id) return biomarker

        if (field === 'value') {
          const parsedValue = Number(value)
          return {
            ...biomarker,
            value: Number.isFinite(parsedValue) ? parsedValue : biomarker.value,
          }
        }

        if (field === 'refMin' || field === 'refMax') {
          const parsedValue = Number(value)
          const currentRange = biomarker.referenceRange ?? {}
          return {
            ...biomarker,
            referenceRange: {
              ...currentRange,
              [field === 'refMin' ? 'min' : 'max']:
                Number.isFinite(parsedValue) ? parsedValue : undefined,
            },
          }
        }

        return {
          ...biomarker,
          [field]: value,
        }
      })

      return { ...prev, biomarkers }
    })
  }

  const handleDeleteBiomarker = (id: string) => {
    setResult((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        biomarkers: prev.biomarkers.filter((b) => b.id !== id),
      }
    })
  }

  const handleAddBiomarker = () => {
    setResult((prev) => {
      if (!prev) return prev

      const newBiomarker: PreviewBiomarker = {
        id: `manual-${Date.now()}`,
        name: '',
        value: 0,
        unit: '',
        referenceRange: {},
      }

      return {
        ...prev,
        biomarkers: [...prev.biomarkers, newBiomarker],
      }
    })
  }

  const handleSaveResult = () => {
    if (!result) return

    const validationError = validatePreview(result)
    if (validationError) {
      setErrorMessage(validationError)
      setSaveMessage('')
      setIsSaved(false)
      return
    }

    const now = new Date().toISOString()
    const formattedResult: BloodTestResult = {
      id: `manual-${Date.now()}`,
      testDate: result.testDate,
      uploadedAt: now,
      sourceFileName,
      sourceType,
      biomarkers: result.biomarkers.map((b) => ({
        id: b.id,
        name: b.name,
        value: b.value,
        unit: b.unit || getBiomarkerMeta(b.name)?.unit || '',
        referenceRange: b.referenceRange,
      })),
    }

    saveReviewedUploadResult(formattedResult)
    clearUploadDraft()

    setErrorMessage('')
    setSaveMessage('Result saved to history.')
    setIsSaved(true)
  }

  return {
    result,
    saveMessage,
    errorMessage,
    isSaved,
    sourceType,
    sourceFileName,
    setResult,
    handleBiomarkerChange,
    handleDeleteBiomarker,
    handleAddBiomarker,
    handleSaveResult,
  }
}
