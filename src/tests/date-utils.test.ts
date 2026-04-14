import { describe, expect, test } from 'vitest'
import { parseISO, formatShort } from '../utils/date'

describe('parseISO', () => {
  test('returns a Date for a valid ISO datetime string', () => {
    const d = parseISO('2026-03-25T08:00:00.000Z')
    expect(d).toBeInstanceOf(Date)
    expect(d?.getFullYear()).toBe(2026)
  })

  test('returns a Date for a date-only string', () => {
    const d = parseISO('2026-03-25')
    expect(d).toBeInstanceOf(Date)
  })

  test('returns null for undefined', () => {
    expect(parseISO(undefined)).toBeNull()
  })

  test('returns null for empty string', () => {
    expect(parseISO('')).toBeNull()
  })
})

describe('formatShort', () => {
  test('returns a non-empty string for a valid date', () => {
    const formatted = formatShort('2026-03-25')
    expect(formatted).toBeTruthy()
    expect(typeof formatted).toBe('string')
  })

  test('includes the year in the formatted output', () => {
    expect(formatShort('2026-03-25')).toContain('2026')
  })

  test('returns empty string for undefined', () => {
    expect(formatShort(undefined)).toBe('')
  })

  test('returns empty string for empty string input', () => {
    expect(formatShort('')).toBe('')
  })
})
