import type { BloodTestResult } from '@/src/features/blood-test/types'
import { formatShort } from '@/src/utils/date'

type ResultCardProps = {
  result: BloodTestResult
  isExpanded: boolean
  onToggleDetails: () => void
  onDelete: () => void
}

export default function ResultCard({
  result,
  isExpanded,
  onToggleDetails,
  onDelete,
}: ResultCardProps) {
  const previewItems = result.biomarkers.slice(0, 3)
  const hasMore = result.biomarkers.length > previewItems.length

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-lg font-semibold text-gray-900">{result.testDate}</span>
        <span className="rounded bg-gray-100 px-2 py-0.5 text-xs uppercase text-gray-600">
          {result.sourceType}
        </span>
      </div>
      <p className="mt-1 text-gray-500">
        Uploaded: {formatShort(result.uploadedAt)}
      </p>
      <p className="mt-1 text-gray-500">
        {result.biomarkers.length} biomarker{result.biomarkers.length !== 1 ? 's' : ''}
        {result.sourceFileName ? ` · ${result.sourceFileName}` : ''}
      </p>
      <p className="mt-1 text-gray-600">
        {previewItems
          .map((item) => `${item.name}: ${item.value} ${item.unit}`.trim())
          .join(' • ')}
        {hasMore ? ` • +${result.biomarkers.length - previewItems.length} more` : ''}
      </p>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={onToggleDetails}
          className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-white"
        >
          {isExpanded ? 'Hide details' : 'View details'}
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
        >
          Remove result
        </button>
      </div>

      {isExpanded ? (
        <div className="mt-3 rounded-md border border-gray-200 bg-white p-3">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">Biomarkers</h4>
          <ul className="mt-2 space-y-1 text-sm text-gray-700">
            {result.biomarkers.map((item) => (
              <li key={item.id}>
                {item.name}: {item.value} {item.unit}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  )
}
