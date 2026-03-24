import { z } from 'zod'

export const uploadSourceTypeSchema = z.enum(["csv", "pdf", "image"])
export const biomarkerFlagSchema = z.enum(["low", "normal", "high"])

export const referenceRangeSchema = z.object({
	min: z.number().optional(),
	max: z.number().optional(),
})

export const biomarkerSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
	value: z.number(),
	unit: z.string().min(1),
	referenceRange: referenceRangeSchema.optional(),
	flag: biomarkerFlagSchema.optional(),
})

export const bloodTestResultSchema = z.object({
	id: z.string().min(1),
	testDate: z.string().min(1),
	uploadedAt: z.string().min(1),
	sourceFileName: z.string().min(1),
	sourceType: uploadSourceTypeSchema,
	biomarkers: z.array(biomarkerSchema),
})

export const chatRoleSchema = z.enum(["user", "assistant"])

export const chatMessageSchema = z.object({
	id: z.string().min(1),
	role: chatRoleSchema,
	message: z.string(),
	date: z.string().min(1),
	relatedResultId: z.string().optional(),
})

export type UploadSourceType = z.infer<typeof uploadSourceTypeSchema>
export type BiomarkerFlag = z.infer<typeof biomarkerFlagSchema>
export type Biomarker = z.infer<typeof biomarkerSchema>
export type BloodTestResult = z.infer<typeof bloodTestResultSchema>
export type ChatRole = z.infer<typeof chatRoleSchema>
export type ChatMessage = z.infer<typeof chatMessageSchema>

export function validateBloodTestResult(input: unknown): BloodTestResult {
	return bloodTestResultSchema.parse(input)
}

export function validateBloodTestResults(input: unknown): BloodTestResult[] {
	return z.array(bloodTestResultSchema).parse(input)
}
