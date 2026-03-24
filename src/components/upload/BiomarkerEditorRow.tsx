import type { PreviewBiomarker } from "@/src/features/blood-test/types"

type BiomarkerMeta = {
  label: string
  unit: string
}

type BiomarkerEditorRowProps = {
  biomarker: PreviewBiomarker
  meta?: BiomarkerMeta
  onChange: (
    id: string,
    field: "name" | "value" | "unit" | "refMin" | "refMax",
    value: string,
  ) => void
  onDelete: (id: string) => void
}

export default function BiomarkerEditorRow({
  biomarker,
  meta,
  onChange,
  onDelete,
}: BiomarkerEditorRowProps) {
  return (
    <div
      className="grid grid-cols-1 gap-2 rounded-lg bg-gray-50 p-3 text-sm sm:grid-cols-6"
    >
      <label className="flex flex-col gap-1">
        <span className="text-xs text-gray-500">Name</span>
        <input
          type="text"
          value={biomarker.name}
          onChange={(e) => onChange(biomarker.id, "name", e.target.value)}
          className="rounded-md border border-gray-300 px-2 py-1 text-sm"
        />
        {meta?.label ? (
          <span className="text-xs text-gray-500">Meta: {meta.label}</span>
        ) : null}
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xs text-gray-500">Value</span>
        <input
          type="number"
          value={biomarker.value}
          onChange={(e) => onChange(biomarker.id, "value", e.target.value)}
          className="rounded-md border border-gray-300 px-2 py-1 text-sm"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xs text-gray-500">Unit</span>
        <input
          type="text"
          value={biomarker.unit}
          onChange={(e) => onChange(biomarker.id, "unit", e.target.value)}
          placeholder={meta?.unit ?? "e.g. mg/dL"}
          className="rounded-md border border-gray-300 px-2 py-1 text-sm"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xs text-gray-500">Ref min</span>
        <input
          type="number"
          value={biomarker.referenceRange?.min ?? ""}
          onChange={(e) => onChange(biomarker.id, "refMin", e.target.value)}
          className="rounded-md border border-gray-300 px-2 py-1 text-sm"
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="text-xs text-gray-500">Ref max</span>
        <input
          type="number"
          value={biomarker.referenceRange?.max ?? ""}
          onChange={(e) => onChange(biomarker.id, "refMax", e.target.value)}
          className="rounded-md border border-gray-300 px-2 py-1 text-sm"
        />
      </label>

      <div className="flex items-end">
        <button
          type="button"
          onClick={() => onDelete(biomarker.id)}
          className="w-full rounded-md border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  )
}
