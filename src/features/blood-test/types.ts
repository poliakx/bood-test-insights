export type UploadSourceType = "csv" | "pdf" | "image"
export type BiomarkerFlag = "low" | "normal" | "high"
export type ChatRole = "user" | "assistant"

export type Biomarker = {
  id: string
  name: string
  value: number
  unit: string
  referenceRange?: {
    min?: number
    max?: number
  }
  flag?: BiomarkerFlag
}

export type BloodTestResult = {
  id: string
  testDate: string
  uploadedAt: string
  sourceFileName: string
  sourceType: UploadSourceType
  biomarkers: Biomarker[]
}

export type ChatMessage  = {
  id: string
  role: ChatRole
  message: string
  date: string
  relatedResultId?: string
}


export type PreviewBiomarker = {
  id: string
  name: string
  value: number
  unit: string
  referenceRange?: {
    min?: number
    max?: number
  }
}

 export type UploadPreviewResult = {
  testDate: string
  biomarkers: PreviewBiomarker[]
}

export type FileDropzoneProps = {
  onFileUpload: (file: File) => void
}
