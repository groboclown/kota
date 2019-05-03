import { ErrorValue, coreError } from '@kota/base-libs'


export function checkValidRange(key: string, min: number, max: number): null | ErrorValue {
  if (min >= max) {
    return coreError('invalid range', { key, min, max })
  }
  return null
}
