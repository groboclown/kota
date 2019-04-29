
import { AttributeType } from './core'

/**
 * Map values are highly complex objects that must support several use cases.
 */

export interface FuzzMapValueBase extends AttributeType {
  /** This is an expression evaluated through the input's operations */
  input: string
}

/**
 * Maps any number to a fuzz value.
 */
export interface FuzzMapValueBound extends FuzzMapValueBase {
  target: number
  range: number
}

/**
 * The upper-bound value in a Fuzz.  If the value is
 * at or above this upper bound, then the evaluated number is 1.
 */
export interface FuzzMapValueUpperBound extends FuzzMapValueBase {
  upper: number
  range: number
}

export interface FuzzMapValueLowerBound extends FuzzMapValueBase {
  lower: number
  range: number
}

export type FuzzMapValue = FuzzMapValueUpperBound | FuzzMapValueLowerBound | FuzzMapValueBound

export function isFuzzMapValueBound(m: AttributeType): m is FuzzMapValueBound {
  return (<FuzzMapValueBase> m).input !== undefined
    && (<FuzzMapValueBound> m).target !== undefined
    && (<FuzzMapValueBound> m).range !== undefined
}

export function isFuzzMapValueUpperBound(m: AttributeType): m is FuzzMapValueUpperBound {
  return (<FuzzMapValueBase> m).input !== undefined
    && (<FuzzMapValueUpperBound> m).upper !== undefined
    && (<FuzzMapValueUpperBound> m).range !== undefined
}

export function FuzzMapValueLowerBound(m: AttributeType): m is FuzzMapValueLowerBound {
  return (<FuzzMapValueBase> m).input !== undefined
    && (<FuzzMapValueLowerBound> m).lower !== undefined
    && (<FuzzMapValueLowerBound> m).range !== undefined
}
