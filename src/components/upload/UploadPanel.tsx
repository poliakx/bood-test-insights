"use client"
import FileDropzone from './FileDropzone'
import { useState } from 'react'
import { PreviewBiomarker } from '@/src/features/blood-test/types'
import { UploadPreviewResult } from '@/src/features/blood-test/types'
import { MOCK_BLOOD_TEST_RESULTS } from '@/src/services/extraction/mockExtractResults'

export default function UploadPanel() {
  const [result, setResult] = useState<UploadPreviewResult | null>(null)
  const mockBiomarkers = MOCK_BLOOD_TEST_RESULTS[0].biomarkers

  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Choose File</h2>
        <p className="mt-1 text-sm text-gray-600">Select a PDF or image to simulate extraction.</p>

        <div className="mt-4">
          <FileDropzone onFileUpload={(file) => {
            console.log(file)

            setResult({
              biomarkers: mockBiomarkers,
            })
          }} />
        </div>
      </div>

      {result && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Review Extracted Data</h3>
          <div className="mt-4 space-y-2">
            {result.biomarkers.map((b) => (
              <div key={b.id} className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm">
                <span className="text-gray-700">{b.name}</span>
                <span className="font-medium text-gray-900">{b.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
