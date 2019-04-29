
export { CORE_ERROR_DOMAIN } from '../core-paths'
import { CORE_ERROR_DOMAIN } from '../core-paths'

export interface ErrorValue {
  domain: string
  msgid: string

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
  return typeof v === 'object' &&
    typeof v.error === 'object' &&
    typeof v.error.domain === 'string' &&
    typeof v.error.msgid === 'string'
}

export function coreError(msgid: string | Error, params?: { [key: string]: string | number }): ErrorValue {
  if (msgid instanceof Error) {
    msgid = msgid.message
  }
  return { domain: CORE_ERROR_DOMAIN, msgid: msgid, params: params || {} }
}
