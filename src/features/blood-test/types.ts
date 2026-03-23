export type UploadSourceType = "pdf" | "image" | "csv" | "manual"
export type BloodTestStatus = "pending" | "processed" | "reviewed"
export type BiomarkerFlag = "low" | "normal" | "high"
export type ChatRole = "user" | "assistant"

export type Biomarker = {
  id: string
  name: string
  value: number
  unit?: string
  referenceRange?:{
    min: number
    max:number
  }
  date: string
  flag?: BiomarkerFlag
}

export type BloodTestResult = {
  id: string
  userId: string
  date: string              
  createdAt: string           
  sourceType: UploadSourceType
  sourceFileUrl?: string      
  biomarkers: Biomarker[]
  status: BloodTestStatus
}

export type ChatMessage  = {
  id: string
  role: ChatRole
  message: string
  date: string
  relatedResultId?: string
}
