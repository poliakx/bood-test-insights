"use client"

import { useState } from "react"
import FileDropzone from "./FileDropzone"
import UploadActions from "./UploadActions"
import ReviewExtractedData from "./ReviewExtractedData"
import type { BloodTestResult, PreviewBiomarker, UploadPreviewResult } from "@/src/features/blood-test/types"
import { detectSourceType, extractResults } from "@/src/services/extraction/extractResults"
import { getResults, saveResults } from "@/src/services/storage/resultsStorage"
import { BLOOD_TEST_SAVED_EVENT } from "@/src/hooks/useBloodTestHistory"
import { getBiomarkerMeta } from "./getBiomarkerMeta"
import { validatePreview } from "./validatePreview"

type SourceType = BloodTestResult["sourceType"]

export default function UploadPanel() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [result, setResult] = useState<UploadPreviewResult | null>(null)
  const [sourceType, setSourceType] = useState<SourceType | "">("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [saveMessage, setSaveMessage] = useState<string>("")

  const handleBiomarkerChange = (
    id: string,
    field: "name" | "value" | "unit" | "refMin" | "refMax",
    value: string
  ) => {
    setResult((prev) => {
      if (!prev) return prev

      const biomarkers = prev.biomarkers.map((biomarker) => {
        if (biomarker.id !== id) return biomarker

        if (field === "value") {
          const parsedValue = Number(value)

          return {
            ...biomarker,
            value: Number.isFinite(parsedValue) ? parsedValue : biomarker.value,
          }
        }

        if (field === "refMin" || field === "refMax") {
          const parsedValue = Number(value)
          const currentRange = biomarker.referenceRange ?? {}

          return {
            ...biomarker,
            referenceRange: {
              ...currentRange,
              [field === "refMin" ? "min" : "max"]:
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
        name: "",
        value: 0,
        unit: "",
        referenceRange: {},
      }

      return {
        ...prev,
        biomarkers: [...prev.biomarkers, newBiomarker],
      }
    })
  }

  const handleExtract = async () => {
    setSaveMessage("")
    setErrorMessage("")

    if (!selectedFile) {
      setErrorMessage("Please select a file first")
      return
    }

    const detectedType = detectSourceType(selectedFile)
    if (!detectedType) {
      setErrorMessage("Unsupported file type. Use CSV, PDF, or image")
      return
    }

    setSourceType(detectedType)
    setIsLoading(true)

    try {
      const extractedResults = await extractResults(selectedFile)
      const firstResult = extractedResults[0]

      if (!firstResult) {
        setErrorMessage("No biomarkers were extracted from the file")
        return
      }

      setResult({
        testDate: firstResult.testDate,
        biomarkers: firstResult.biomarkers.map((b) => ({
          id: b.id,
          name: b.name,
          value: b.value,
          unit: b.unit,
          referenceRange: b.referenceRange,
        })),
      })
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Extraction failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveResult = () => {
    if (!result) return

    const validationError = validatePreview(result)
    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    const now = new Date().toISOString()
    const formattedResult: BloodTestResult = {
      id: `manual-${Date.now()}`,
      testDate: result.testDate,
      uploadedAt: now,
      sourceFileName: selectedFile?.name ?? "manual-entry",
      sourceType: sourceType || "csv",
      biomarkers: result.biomarkers.map((b) => ({
        id: b.id,
        name: b.name,
        value: b.value,
        unit: b.unit || getBiomarkerMeta(b.name)?.unit || "",
        referenceRange: b.referenceRange,
      })),
    }

    const existingResults = getResults()
    saveResults([formattedResult, ...existingResults])
    window.dispatchEvent(new CustomEvent(BLOOD_TEST_SAVED_EVENT))
    setSaveMessage("Saved to history")
    setErrorMessage("")
    setResult(null)
  }

  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Choose File</h2>
        <p className="mt-1 text-sm text-gray-600">
          Select a PDF or image to simulate extraction.
        </p>

        <div className="mt-4">
          <FileDropzone
            onFileUpload={(file) => {
              setSelectedFile(file)
              setErrorMessage("")
              setSaveMessage("")
            }}
          />

          <UploadActions
            isLoading={isLoading}
            sourceType={sourceType}
            errorMessage={errorMessage}
            onExtract={handleExtract}
          />
        </div>
      </div>

      {result && (
        <ReviewExtractedData
          result={result}
          saveMessage={saveMessage}
          onTestDateChange={(value) =>
            setResult((prev) => (prev ? { ...prev, testDate: value } : prev))
          }
          onBiomarkerChange={handleBiomarkerChange}
          onDeleteBiomarker={handleDeleteBiomarker}
          onAddBiomarker={handleAddBiomarker}
          onSave={handleSaveResult}
          getBiomarkerMeta={getBiomarkerMeta}
        />
      )}
    </section>
  )
}