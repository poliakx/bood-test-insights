import { BloodTestResult } from "../features/blood-test/types";

export const mockBloodTest: BloodTestResult ={
  id: "1",
  userId: "user-1",
  date: "2026-03-20",
  createdAt: "2026-03-20",
  sourceType: "manual",
  status: "processed",
  biomarkers: [
    {
      id: "b1",
      name: "Hemoglobin",
      value: 11,
      unit: "g/dL",
      date: "2026-03-20",
      referenceRange: {
        min: 13,
        max: 17,
      },
      flag: "low",
    },
    {
      id: "b2",
      name: "Glucose",
      value: 95,
      unit: "mg/dL",
      date: "2026-03-20",
      referenceRange: {
        min: 70,
        max: 100,
      },
      flag: "normal",
    },
  ],
}
