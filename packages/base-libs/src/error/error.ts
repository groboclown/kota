
import * as tp from '../tree-path'
export const CORE_ERROR_DOMAIN = tp.paths.core.CORE_ERROR_DOMAIN

export interface ErrorValue {
  domain: string
  msgid: string
  stack?: string

  /** Specific parameters for the error, used when translating the text. */
  params: { [key: string]: string | number | boolean }
}

/**
 * Used to join structures together.
 */
export interface HasErrorValue {
  error: ErrorValue
}

export function isErrorValue(v: any): v is ErrorValue {
  return v !== null && typeof v === 'object' &&
    typeof (v.domain) === 'string' &&
    typeof (v.msgid) === 'string' &&
    typeof (v.params) === 'object'
}

export function hasErrorValue(v: any): v is HasErrorValue {
  return v !== null && typeof v === 'object' && isErrorValue(v.error)
}

export function coreError(msgid: string | Error, params?: { [key: string]: string | number }): ErrorValue {
  let stack: string | undefined
  if (msgid instanceof Error) {
    stack = msgid.stack
    msgid = msgid.message
  }
  return { domain: CORE_ERROR_DOMAIN, msgid, stack, params: params || {} }
}

export interface HasErrorValueList {
  errors: ErrorValue[]
}

export function hasErrorValueList(v: any): v is HasErrorValueList {
  return v !== null && typeof v === 'object' && v.errors !== null &&
    v.errors instanceof Array && v.errors.every((k: any) => isErrorValue(k))
}
