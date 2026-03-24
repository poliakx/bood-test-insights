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
    <div>
      <label htmlFor="biomarker-select" className="sr-only">
        Select biomarker
      </label>
      <select
        id="biomarker-select"
        name="biomarker"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md border border-gray-200 px-3 py-2 text-sm"
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
