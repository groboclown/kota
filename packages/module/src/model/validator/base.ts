
import { ErrorValue } from '@kota/base-libs'

export interface ModelObjectVerifier<T> {
  readonly name: string
  validate(srcfile: string, obj: any, errors?: ErrorValue[]): obj is T
}
