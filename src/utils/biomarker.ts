import { Biomarker } from '../features/blood-test/types'

export function findByName(list: Biomarker[], name: string) {
  return list.find(b => b.name === name)
}
