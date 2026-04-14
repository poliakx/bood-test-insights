import { afterEach, describe, expect, test, vi } from 'vitest'
import { generateChatResponse } from '../services/chat/generateChatResponse'
import { buildChatContext } from '../services/chat/buildChatContext'

function stubFetch(overrides: { ok: boolean; json?: () => Promise<unknown> }) {
  const fetchMock = vi.fn(() =>
    Promise.resolve({
      ok: overrides.ok,
      json: overrides.json ?? (() => Promise.resolve({})),
    }),
  )
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('generateChatResponse', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('returns the response text from the API', async () => {
    stubFetch({
      ok: true,
      json: () => Promise.resolve({ response: 'Your results look normal.' }),
    })

    const context = buildChatContext([])
    const result = await generateChatResponse('summary', context)

    expect(result).toBe('Your results look normal.')
  })

  test('calls POST /api/chat with prompt and context payload', async () => {
    const fetchMock = stubFetch({
      ok: true,
      json: () => Promise.resolve({ response: 'OK' }),
    })

    const context = buildChatContext([])
    await generateChatResponse('my question', context)

    expect(fetchMock).toHaveBeenCalledWith('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: 'my question', context }),
    })
  })

  test('throws with error message from body when API returns error', async () => {
    stubFetch({
      ok: false,
      json: () => Promise.resolve({ error: 'ANTHROPIC_API_KEY is not configured' }),
    })

    const context = buildChatContext([])
    await expect(generateChatResponse('prompt', context)).rejects.toThrow(
      'ANTHROPIC_API_KEY is not configured',
    )
  })

  test('throws generic error when response is not OK and body has no error field', async () => {
    stubFetch({
      ok: false,
      json: () => Promise.resolve({}),
    })

    const context = buildChatContext([])
    await expect(generateChatResponse('prompt', context)).rejects.toThrow('Chat request failed')
  })
})
