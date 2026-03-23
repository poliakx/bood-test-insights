import { z } from 'zod'

export const uploadSourceTypeSchema = z.enum(["pdf", "image", "csv", "manual"])
export const bloodTestStatusSchema = z.enum(["pending", "processed", "reviewed"])
export const biomarkerFlagSchema = z.enum(["low", "normal", "high"])

export const referenceRangeSchema = z.object({
	min: z.number(),
	max: z.number(),
})

export const biomarkerSchema = z.object({
	id: z.string().min(1),
	name: z.string().min(1),
	value: z.number(),
	unit: z.string().optional(),
	referenceRange: referenceRangeSchema.optional(),
	date: z.string().min(1),
	flag: biomarkerFlagSchema.optional(),
})

export const bloodTestResultSchema = z.object({
	id: z.string().min(1),
	userId: z.string().min(1),
	date: z.string().min(1),
	createdAt: z.string().min(1),
	sourceType: uploadSourceTypeSchema,
	sourceFileUrl: z.string().optional(),
	biomarkers: z.array(biomarkerSchema),
	status: bloodTestStatusSchema,
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
export type BloodTestStatus = z.infer<typeof bloodTestStatusSchema>
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
