import type { BloodTestResult, UploadSourceType } from "@/features/blood-test/types"

export function detectSourceType(file: File): UploadSourceType | null {
  const lowerName = file.name.toLowerCase()

  if (lowerName.endsWith(".csv")) return "csv"
  if (lowerName.endsWith(".pdf")) return "pdf"
  if (file.type.startsWith("image/")) return "image"

  return null
}

export async function extractResults(file: File): Promise<BloodTestResult[]> {
  const sourceType = detectSourceType(file)

  if (!sourceType) {
    throw new Error("Unsupported file type. Please upload CSV, PDF, or image.")
  }

  const now = new Date()
  const today = now.toISOString().slice(0, 10)
  const uploadedAt = now.toISOString()

  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch("/api/extract", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(
      (body as { error?: string }).error ?? "Failed to extract data from file",
    )
  }

  const extracted = await response.json() as {
    testDate?: string | null
    biomarkers?: Array<{
      name: string
      value: number
      unit: string
      referenceRange?: { min?: number; max?: number }
    }>
  }

  return [
    {
      id: crypto.randomUUID(),
      testDate: extracted.testDate ?? today,
      uploadedAt,
      sourceType,
      sourceFileName: file.name,
      biomarkers: (extracted.biomarkers ?? []).map((b) => ({
        id: crypto.randomUUID(),
        name: b.name,
        value: b.value,
        unit: b.unit,
        referenceRange: b.referenceRange,
      })),
    },
  ]
}

