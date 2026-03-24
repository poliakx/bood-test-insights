import SaveResultButton from "./SaveResultButton"
import BiomarkerEditorRow from "./BiomarkerEditorRow"
import type { UploadPreviewResult } from "@/src/features/blood-test/types"

type BiomarkerMeta = {
  label: string
  unit: string
}

type ReviewExtractedDataProps = {
  result: UploadPreviewResult
  saveMessage: string
  onTestDateChange: (value: string) => void
  onBiomarkerChange: (
    id: string,
    field: "name" | "value" | "unit" | "refMin" | "refMax",
    value: string,
  ) => void
  onDeleteBiomarker: (id: string) => void
  onAddBiomarker: () => void
  onSave: () => void
  getBiomarkerMeta: (name: string) => BiomarkerMeta | undefined
}

export default function ReviewExtractedData({
  result,
  saveMessage,
  onTestDateChange,
  onBiomarkerChange,
  onDeleteBiomarker,
  onAddBiomarker,
  onSave,
  getBiomarkerMeta,
}: ReviewExtractedDataProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">
        Review Extracted Data
      </h3>

      <label className="mt-4 flex max-w-xs flex-col gap-1">
        <span className="text-xs text-gray-500">Test date</span>
        <input
          type="date"
          value={result.testDate}
          onChange={(e) => onTestDateChange(e.target.value)}
          className="rounded-md border border-gray-300 px-2 py-1 text-sm"
        />
      </label>

      <div className="mt-4 space-y-2">
        {result.biomarkers.map((biomarker) => (
          <BiomarkerEditorRow
            key={biomarker.id}
            biomarker={biomarker}
            meta={getBiomarkerMeta(biomarker.name)}
            onChange={onBiomarkerChange}
            onDelete={onDeleteBiomarker}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onAddBiomarker}
        className="mt-3 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
      >
        Add biomarker
      </button>

      <div className="mt-4 flex items-center gap-3">
        <SaveResultButton onClick={onSave} />
        {saveMessage ? (
          <span className="text-sm text-green-700">{saveMessage}</span>
        ) : null}
      </div>
    </div>
  )
}
