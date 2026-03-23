import type { ChangeEvent } from 'react'
import { FileDropzoneProps } from "@/src/features/blood-test/types"


export default function FileDropzone({ onFileUpload }: FileDropzoneProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileUpload(file)
    }
  }

  return (
    <input
      type="file"
      accept=".csv,.pdf,image/*"
      aria-label="Upload blood test file"
      title="Upload blood test file"
      onChange={handleChange}
      className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-gray-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-gray-700"
    />
  )
}