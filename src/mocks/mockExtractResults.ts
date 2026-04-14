import { BloodTestResult } from '../features/blood-test/types'

const NOW = new Date('2026-04-14T09:30:00.000Z')

export const MOCK_BLOOD_TEST_RESULTS: BloodTestResult[] = [
  {
    id: 'result-2026-04-14',
    testDate: '2026-04-14',
    uploadedAt: NOW.toISOString(),
    sourceFileName: 'april-2026.pdf',
    sourceType: 'pdf',
    biomarkers: [
      {
        id: 'hb-2026-04-14',
        name: 'Hemoglobin',
        value: 13.6,
        unit: 'g/dL',
        referenceRange: { min: 12, max: 16 },
        flag: 'normal',
      },
      {
        id: 'glucose-2026-04-14',
        name: 'Glucose',
        value: 96,
        unit: 'mg/dL',
        referenceRange: { min: 70, max: 100 },
        flag: 'normal',
      },
      {
        id: 'chol-2026-04-14',
        name: 'Cholesterol',
        value: 178,
        unit: 'mg/dL',
        referenceRange: { min: 125, max: 200 },
        flag: 'normal',
      },
      {
        id: 'vitd-2026-04-14',
        name: 'Vitamin D',
        value: 28,
        unit: 'ng/mL',
        referenceRange: { min: 20, max: 50 },
        flag: 'normal',
      },
      {
        id: 'iron-2026-04-14',
        name: 'Iron',
        value: 65,
        unit: 'ug/dL',
        referenceRange: { min: 60, max: 170 },
        flag: 'normal',
      },
    ],
  },
  {
    id: 'result-2026-03-14',
    testDate: '2026-03-14',
    uploadedAt: '2026-03-14T09:15:00.000Z',
    sourceFileName: 'march-2026.jpg',
    sourceType: 'image',
    biomarkers: [
      {
        id: 'hb-2026-03-14',
        name: 'Hemoglobin',
        value: 12.9,
        unit: 'g/dL',
        referenceRange: { min: 12, max: 16 },
        flag: 'normal',
      },
      {
        id: 'glucose-2026-03-14',
        name: 'Glucose',
        value: 106,
        unit: 'mg/dL',
        referenceRange: { min: 70, max: 100 },
        flag: 'high',
      },
      {
        id: 'iron-2026-03-14',
        name: 'Iron',
        value: 52,
        unit: 'ug/dL',
        referenceRange: { min: 60, max: 170 },
        flag: 'low',
      },
      {
        id: 'vitd-2026-03-14',
        name: 'Vitamin D',
        value: 17,
        unit: 'ng/mL',
        referenceRange: { min: 20, max: 50 },
        flag: 'low',
      },
      {
        id: 'chol-2026-03-14',
        name: 'Cholesterol',
        value: 190,
        unit: 'mg/dL',
        referenceRange: { min: 125, max: 200 },
        flag: 'normal',
      },
    ],
  },
]

export async function mockExtractResults(): Promise<BloodTestResult[]> {
  return MOCK_BLOOD_TEST_RESULTS
}
