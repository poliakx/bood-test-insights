"use client"

import Link from 'next/link'
import ReviewExtractedData from './ReviewExtractedData'
import TrendsChart from '@/components/trends/TrendsChart'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import { getBiomarkerMeta } from './getBiomarkerMeta'
import useUploadReviewData from '@/hooks/useUploadReviewData'

export default function UploadReviewPanel() {
  const {
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
  } = useUploadReviewData()

  if (!result) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <EmptyState
          title="No extracted data"
          message="Upload and extract a file first, then review the extracted biomarkers here."
        />
        <Link
          href="/upload"
          className="mt-4 inline-flex rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          Back to upload
        </Link>
      </div>
    )
  }

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-1 text-sm text-gray-600">
          <p>
            Source file: <span className="font-medium text-gray-800">{sourceFileName}</span>
          </p>
          <p>
            Source type: <span className="font-medium text-gray-800">{sourceType.toUpperCase()}</span>
          </p>
        </div>
      </div>

      <div
        style={isSaved ? { opacity: 0, pointerEvents: 'none', maxHeight: 0, overflow: 'hidden', transition: 'opacity 0.35s ease, max-height 0.45s ease' } : { opacity: 1, maxHeight: '9999px', transition: 'opacity 0.35s ease, max-height 0.45s ease' }}
      >
        {errorMessage ? <ErrorState message={errorMessage} className="mb-4" /> : null}

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
      </div>

      {isSaved ? (
        <div className="animate-fadeIn rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Saved trends</h3>
              <p className="mt-1 text-sm text-gray-600">
                Your result was saved. Review the updated biomarker trends below.
              </p>
            </div>
            <Link
              href="/upload"
              className="shrink-0 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Upload another file
            </Link>
          </div>
          <div className="mt-4">
            <TrendsChart />
          </div>
        </div>
      ) : null}
    </section>
  )
}

