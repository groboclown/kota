
import { core } from '../tree-path'
export const CORE_ERROR_DOMAIN = core.CORE_ERROR_DOMAIN

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

export function hasErrorValue(v: any): v is HasErrorValue {
  return v !== null && typeof v === 'object' && v.error !== null &&
    typeof (v.error) === 'object' &&
    typeof (v.error.domain) === 'string' &&
    typeof (v.error.msgid) === 'string' &&
    typeof (v.error.params) === 'object'
}

export function coreError(msgid: string | Error, params?: { [key: string]: string | number }): ErrorValue {
  let stack: string | undefined = undefined
  if (msgid instanceof Error) {
    stack = msgid.stack
    msgid = msgid.message
  }
  return { domain: CORE_ERROR_DOMAIN, msgid, stack, params: params || {} }
}
