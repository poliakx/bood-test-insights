import type { UploadPreviewResult } from "@/src/features/blood-test/types"

export function validatePreview(preview: UploadPreviewResult): string | null {
  if (!preview.testDate.trim()) return "Test date is required"

  for (const biomarker of preview.biomarkers) {
    if (!biomarker.name.trim()) return "Biomarker name is required"
    if (!Number.isFinite(biomarker.value)) {
      return "Biomarker value must be a number"
    }
    if (!biomarker.unit.trim()) return "Biomarker unit is required"
  }

  return null
}
