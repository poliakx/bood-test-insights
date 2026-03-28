"use client"

import { useRouter } from 'next/navigation'
import { useState } from "react"
import FileDropzone from "./FileDropzone"
import UploadActions from "./UploadActions"
import type { BloodTestResult } from "@/features/blood-test/types"
import { detectSourceType, extractResults } from "@/services/extraction/extractResults"
import { saveUploadDraft } from '@/services/storage/uploadDraftStorage'

type SourceType = BloodTestResult["sourceType"]

export default function UploadPanel() {
  const router = useRouter()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [sourceType, setSourceType] = useState<SourceType | "">("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const handleExtract = async () => {
    setErrorMessage("")

    if (!selectedFile) {
      setErrorMessage("Select a CSV, PDF, or image file before extracting results.")
      return
    }

    if (selectedFile.size === 0) {
      setErrorMessage("Selected file is empty. Upload a non-empty CSV, PDF, or image file.")
      return
    }

    const detectedType = detectSourceType(selectedFile)
    if (!detectedType) {
      setErrorMessage("Unsupported file type. Upload a CSV, PDF, or image file.")
      return
    }

    setSourceType(detectedType)
    setIsLoading(true)

    try {
      const extractedResults = await extractResults(selectedFile)
      const firstResult = extractedResults[0]

      if (!firstResult) {
        setErrorMessage("No biomarkers were extracted from this file. Try another file or add values manually.")
        return
      }

      saveUploadDraft({
        sourceType: detectedType,
        sourceFileName: selectedFile.name,
        result: {
          testDate: firstResult.testDate,
          biomarkers: firstResult.biomarkers.map((b) => ({
            id: b.id,
            name: b.name,
            value: b.value,
            unit: b.unit,
            referenceRange: b.referenceRange,
          })),
        },
      })
      router.push('/upload/extracting')
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Extraction failed. Please try again.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <FileDropzone
        onFileUpload={(file) => {
          setSelectedFile(file)
          setErrorMessage("")
        }}
      />
      <UploadActions
        isLoading={isLoading}
        sourceType={sourceType}
        errorMessage={errorMessage}
        onExtract={handleExtract}
      />
    </div>
  )
}
