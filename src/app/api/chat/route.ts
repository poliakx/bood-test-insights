import Anthropic from "@anthropic-ai/sdk"
import { NextRequest } from "next/server"
import type { ChatContext } from "@/services/chat/buildChatContext"

function buildSystemPrompt(context: ChatContext): string {
  if (!context.latestResult) {
    return "You are a helpful blood test assistant. The user has no saved results yet."
  }

  const biomarkerLines = context.latestBiomarkers
    .map((b) => `- ${b.name}: ${b.value} ${b.unit} (test date: ${b.testDate})`)
    .join("\n")

  const abnormalLines =
    context.abnormalBiomarkers.length > 0
      ? context.abnormalBiomarkers
          .map((b) => `- ${b.name}: ${b.value} ${b.unit}`)
          .join("\n")
      : "None detected"

  const trendLines =
    context.trendSummaries.length > 0
      ? context.trendSummaries
          .map((t) => {
            const sign = t.delta > 0 ? "+" : ""
            const arrow =
              t.direction === "up" ? "↑" : t.direction === "down" ? "↓" : "→"
            return `- ${t.name}: ${t.latestValue} ${t.unit} (${arrow} ${sign}${t.delta.toFixed(2)} from first result)`
          })
          .join("\n")
      : "Not enough data for trends (need 2+ results)"

  return `You are a knowledgeable blood test assistant. Provide helpful, accurate information about the user's blood test results.

IMPORTANT: Always remind the user that you are not a doctor and they should consult a healthcare professional for medical advice.

## User's Blood Test Data

Latest test date: ${context.latestResult.testDate}
Total saved results: ${context.totalResults}
Source file: ${context.latestResult.sourceFileName}

### Latest Biomarker Values
${biomarkerLines}

### Out-of-Range Biomarkers (latest test)
${abnormalLines}

### Trends Across All Results
${trendLines}

Answer the user's questions about their results concisely and clearly. Reference specific values when relevant.`
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY is not configured" },
      { status: 503 },
    )
  }

  try {
    const body = await request.json() as { prompt: string; context: ChatContext }
    const { prompt, context } = body

    if (!prompt?.trim()) {
      return Response.json({ error: "Prompt is required" }, { status: 400 })
    }

    const client = new Anthropic({ apiKey })

    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      system: buildSystemPrompt(context),
      messages: [{ role: "user", content: prompt }],
    })

    const textBlock = response.content.find(
      (b: { type: string }) => b.type === "text",
    ) as { type: "text"; text: string } | undefined
    const text = textBlock?.text ?? "No response generated."

    return Response.json({ response: text })
  } catch (error) {
    console.error("[/api/chat] Error:", error)
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Chat failed",
      },
      { status: 500 },
    )
  }
}
