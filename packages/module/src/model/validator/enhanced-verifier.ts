
import { ErrorValue } from '@kota/base-libs'
import { ModelObjectVerifier } from './base'

export type ExtraValidation<T> = (obj: T) => ErrorValue[]

export class EnhancedVerifier<T> implements ModelObjectVerifier<T> {
  readonly name: string
  constructor(
    private readonly base: ModelObjectVerifier<T>,
    private readonly extra: Array<ExtraValidation<T>>
  ) {
    this.name = base.name
  }

  validate(srcfile: string, obj: any, errors?: ErrorValue[]): obj is T {
    if (!this.base.validate(srcfile, obj, errors)) {
      return false
    }

    return this.extra.reduce<boolean>((prev, v) => {
      const res = v(obj)
      if (res.length > 0) {
        if (errors) {
          res.forEach((e) => errors.push(e))
        }
        return false
      }
      return prev
    }, true)
  }
}
