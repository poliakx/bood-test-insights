type BiomarkerSelectorProps = {
  options: string[]
  value: string
  onChange: (value: string) => void
}

export default function BiomarkerSelector({
  options,
  value,
  onChange,
}: BiomarkerSelectorProps) {
  return (
    <div className="space-y-1">
      <label htmlFor="biomarker-select" className="text-sm font-medium text-gray-700">
        Biomarker
      </label>
      <select
        id="biomarker-select"
        name="biomarker"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm sm:w-auto"
        aria-label="Select biomarker"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}
