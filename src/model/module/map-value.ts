

/**
 * Map values are highly complex objects that must support several use cases.
 *
 * TODO These need to be re-examined once generation is written.
 */

export interface FuzzMapValueBase {
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

/*
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
*/

/**
 * Defines the functions used to map a number to a map value.  Every one of
 * these MUST provide a constraint generation function.
 */
export interface AttributeMapValueFunctionBaseType {
  readonly type: string
}

/**
 * Interpolated value, mapping the input number to a [0,1] value; 1 <= target,
 * 0 <= outside target +/- range.
 */
export interface AttributeMapValueRangeFunctionType extends AttributeMapValueFunctionBaseType {
  readonly input: string
  readonly target: number
  readonly range: number
}

/**
 * maps "MapValueName in Attribute" and "MapValueName not in Attribute" anded together.
 * The "and" function here is multiplication.  "not" is "1 - value"
 */
export interface AttributeMapValueFuzzFunctionType extends AttributeMapValueFunctionBaseType {
  readonly for: string[]
  readonly threshold?: number
}



/**
 * The "map value" attribute defines a specific value in a map.  It is
 * either a numeric mapping, in which case it uses *context* sourced
 * attributes to express a function that indicates applicability of the
 * value, or a fuzz mapping.
 */
export interface AttributeMapValueType {
  /** the owning attribute map type name. */
  readonly map: string

  /** name of this map value */
  readonly name: string

  /** list of attribute types required to be in the context for this map value to be usable */
  readonly requires: { [key: string]: string }

  //readonly function:
}

export type AttributeMapValueTypeCheck<T extends AttributeMapValueType> = (t: AttributeMapValueType) => t is T

// export type AttributeMapValueEvaluator<T extends AttributeMapValueType> = (t: T, context: InstanceContext) => number
