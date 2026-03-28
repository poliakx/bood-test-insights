import type { BloodTestResult, UploadSourceType } from "@/features/blood-test/types"
import { mockExtractResults } from "@/mocks/mockExtractResults"

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

  const mocked = await mockExtractResults()

  return mocked.map((result) => ({
    ...result,
    sourceType,
    sourceFileName: file.name,
    uploadedAt: new Date().toISOString(),
  }))
}

