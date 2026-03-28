import { BIOMARKER_META } from "@/features/blood-test/constants"

export function getBiomarkerMeta(name: string) {
  const key = name.trim().toLowerCase().replace(/\s+/g, "")
  return BIOMARKER_META[key as keyof typeof BIOMARKER_META]
}

