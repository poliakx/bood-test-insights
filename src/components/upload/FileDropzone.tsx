"use client"

import { useRef, useState } from 'react'
import type { ChangeEvent, DragEvent } from 'react'
import { FileDropzoneProps } from "@/features/blood-test/types"

export default function FileDropzone({ onFileUpload }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null)

  const handleFile = (file: File) => {
    setSelectedFileName(file.name)
    onFileUpload(file)
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload blood test file"
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click() }}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-8 py-14 transition-colors ${
        isDragging
          ? 'border-zinc-400 bg-zinc-100'
          : 'border-zinc-200 bg-zinc-50 hover:border-zinc-300 hover:bg-white'
      }`}
    >
      <svg
        className={`h-8 w-8 transition-colors ${ isDragging ? 'text-zinc-600' : 'text-zinc-300' }`}
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
        />
      </svg>

      {selectedFileName ? (
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-800">
          <svg className="h-4 w-4 shrink-0 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <span className="max-w-xs truncate">{selectedFileName}</span>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-sm font-medium text-zinc-700">Drop file here or click to browse</p>
          <p className="mt-1 text-xs text-zinc-400">CSV, PDF, or image</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".csv,.pdf,image/*"
        aria-hidden="true"
        tabIndex={-1}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}
