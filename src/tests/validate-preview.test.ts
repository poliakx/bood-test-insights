import { describe, expect, test } from 'vitest'
import { validatePreview } from '../components/upload/validatePreview'
import type { UploadPreviewResult } from '../features/blood-test/types'

function createValidPreview(): UploadPreviewResult {
  return {
    testDate: '2026-03-25',
    biomarkers: [
      { id: 'b1', name: 'Glucose', value: 96, unit: 'mg/dL' },
    ],
  }
}

describe('validatePreview', () => {
  test('returns null for a fully valid preview', () => {
    expect(validatePreview(createValidPreview())).toBeNull()
  })

  test('returns null when biomarkers list is empty', () => {
    expect(validatePreview({ testDate: '2026-03-25', biomarkers: [] })).toBeNull()
  })

  test('returns error when test date is empty', () => {
    expect(validatePreview({ ...createValidPreview(), testDate: '' })).toBe(
      'Test date is required',
    )
  })

  test('returns error when test date is only whitespace', () => {
    expect(validatePreview({ ...createValidPreview(), testDate: '   ' })).toBe(
      'Test date is required',
    )
  })

  test('returns error when biomarker name is empty', () => {
    const preview = createValidPreview()
    preview.biomarkers[0].name = ''
    expect(validatePreview(preview)).toBe('Biomarker name is required')
  })

  test('returns error when biomarker name is only whitespace', () => {
    const preview = createValidPreview()
    preview.biomarkers[0].name = '   '
    expect(validatePreview(preview)).toBe('Biomarker name is required')
  })

  test('returns error when biomarker value is NaN', () => {
    const preview = createValidPreview()
    preview.biomarkers[0].value = NaN
    expect(validatePreview(preview)).toBe('Biomarker value must be a number')
  })

  test('returns error when biomarker value is Infinity', () => {
    const preview = createValidPreview()
    preview.biomarkers[0].value = Infinity
    expect(validatePreview(preview)).toBe('Biomarker value must be a number')
  })

  test('returns error when biomarker unit is empty', () => {
    const preview = createValidPreview()
    preview.biomarkers[0].unit = ''
    expect(validatePreview(preview)).toBe('Biomarker unit is required')
  })

  test('returns error when biomarker unit is only whitespace', () => {
    const preview = createValidPreview()
    preview.biomarkers[0].unit = '   '
    expect(validatePreview(preview)).toBe('Biomarker unit is required')
  })

  test('validates biomarkers in order and stops at first error', () => {
    const preview: UploadPreviewResult = {
      testDate: '2026-03-25',
      biomarkers: [
        { id: 'b1', name: 'Glucose', value: 96, unit: 'mg/dL' },
        { id: 'b2', name: '', value: 0, unit: '' },
      ],
    }
    expect(validatePreview(preview)).toBe('Biomarker name is required')
  })
})
