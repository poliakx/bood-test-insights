"use client"

import { useRouter } from 'next/navigation'
import { useState } from "react"
import FileDropzone from "./FileDropzone"
import UploadActions from "./UploadActions"
import type { BloodTestResult } from "@/src/features/blood-test/types"
import { detectSourceType, extractResults } from "@/src/services/extraction/extractResults"
import { saveUploadDraft } from '@/src/services/storage/uploadDraftStorage'

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
    <section className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Choose file</h2>
        <p className="mt-2 text-sm text-gray-600">
          Select a CSV, PDF, or image file to extract biomarker values for review.
        </p>

        <div className="mt-4">
          <FileDropzone
            onFileUpload={(file) => {
              setSelectedFile(file)
              setErrorMessage("")
            }}
          />

          <div className="mt-3 min-h-5 text-sm text-gray-600">
            {selectedFile ? `Selected file: ${selectedFile.name}` : 'No file selected yet.'}
          </div>

          <UploadActions
            isLoading={isLoading}
            sourceType={sourceType}
            errorMessage={errorMessage}
            onExtract={handleExtract}
          />
        </div>
      </div>
    </section>
  )
}