import React from 'react'

export default function BiomarkerSelector() {
  return (
    <div>
      <label htmlFor="biomarker-select" className="sr-only">
        Select biomarker
      </label>
      <select
        id="biomarker-select"
        name="biomarker"
        className="rounded-md border border-gray-200 px-3 py-2 text-sm"
        aria-label="Select biomarker"
      >
        <option value="hemoglobin">Hemoglobin</option>
      </select>
    </div>
  )
}
