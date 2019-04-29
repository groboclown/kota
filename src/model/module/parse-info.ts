
import { ErrorValue } from '../../lib/error'

/**
 * Basic object shape validation.  Does not check internal consistency
 */
export interface ParsedInfo<T> {
  /** only set if the `parsed` value is null. */
  readonly srcValue: any

  readonly type: string
  readonly valid: boolean
  readonly parsed: T | null
  readonly errors: ParsedError[]
}

export interface ParsedError {
  readonly attributeName: string
  readonly attributeType: string
  readonly missing: boolean
  readonly invalid: boolean
  readonly srcValue: any
  readonly violation: ErrorValue
}

export type ParseSrcKey<T> = (src: any) => ParsedInfo<T>


export function createParsedInfo<T>(src: any, errors: ParsedError[], name: string, parsed?: T | null): ParsedInfo<T> {
  return {
    srcValue: errors.length > 0 ? src : null,
    type: name,
    valid: errors.length <= 0,
    parsed: errors.length > 0 ? null : parsed ? parsed : <T>src,
    errors: errors
  }
}
