import Anthropic from "@anthropic-ai/sdk"
import { NextRequest } from "next/server"

const EXTRACTION_PROMPT = `You are a medical data extraction assistant. Extract all blood test biomarkers from the provided document.

Return ONLY a valid JSON object with this exact structure:
{
  "testDate": "YYYY-MM-DD or null if not found",
  "biomarkers": [
    {
      "name": "biomarker name",
      "value": 123.45,
      "unit": "unit string",
      "referenceRange": { "min": 0, "max": 100 }
    }
  ]
}

Rules:
- testDate: extract date of the test, format YYYY-MM-DD, or null if not found
- value: must be a number (not a string)
- referenceRange: include if shown in document, otherwise omit the field
- Extract ALL biomarkers visible in the document
- Do not add explanation or markdown — only JSON`

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY is not configured" },
      { status: 503 },
    )
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 })
    }

    const client = new Anthropic({ apiKey })
    const fileName = file.name.toLowerCase()
    const arrayBuffer = await file.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString("base64")

    let userContent: Anthropic.MessageParam["content"]

    if (fileName.endsWith(".csv")) {
      const text = await file.text()
      userContent = [
        { type: "text", text: EXTRACTION_PROMPT },
        { type: "text", text: `CSV content:\n\n${text}` },
      ]
    } else if (fileName.endsWith(".pdf")) {
      userContent = [
        { type: "text", text: EXTRACTION_PROMPT },
        {
          type: "document",
          source: {
            type: "base64",
            media_type: "application/pdf",
            data: base64,
          },
        },
      ]
    } else {
      const mediaType = (
        file.type || "image/jpeg"
      ) as "image/jpeg" | "image/png" | "image/gif" | "image/webp"
      userContent = [
        { type: "text", text: EXTRACTION_PROMPT },
        {
          type: "image",
          source: {
            type: "base64",
            media_type: mediaType,
            data: base64,
          },
        },
      ]
    }

    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 4096,
      messages: [{ role: "user", content: userContent }],
    })

    const textBlock = response.content.find((b) => b.type === "text")
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text response from Claude")
    }

    // Extract JSON — Claude may wrap in markdown code block
    const jsonMatch =
      textBlock.text.match(/```json\s*([\s\S]*?)\s*```/) ||
      textBlock.text.match(/(\{[\s\S]*\})/)

    if (!jsonMatch) {
      throw new Error("Could not parse JSON from AI response")
    }

    const extracted = JSON.parse(jsonMatch[1] ?? jsonMatch[0]) as {
      testDate?: string | null
      biomarkers?: unknown[]
    }

    if (
      !Array.isArray(extracted.biomarkers) ||
      extracted.biomarkers.length === 0
    ) {
      return Response.json(
        {
          error:
            "No blood test biomarkers found in this document. Please upload a document that contains blood test results.",
        },
        { status: 422 },
      )
    }

    return Response.json(extracted)
  } catch (error) {
    console.error("[/api/extract] Error:", error)
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Extraction failed",
      },
      { status: 500 },
    )
  }
}
