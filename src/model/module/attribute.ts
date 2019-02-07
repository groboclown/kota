/*
 * Handler for the "attribute" key.
 */

import { ParsedError, ParsedInfo, ParseSrcKey, createParsedInfo } from './parse-info'
import { ConstraintSet, FIXME_debug } from './parse-contraints'
import { FunctionAttributeConstraint } from './function'
import { INTEGER_RANGE_MAX, INTEGER_RANGE_MIN } from '../../lib/attributes/primitives'

export const ATTRIBUTE_TYPE_NAME = 'attribute'

/**
 * An attribute is a simple matching description.  It is a qualitative
 * attribute (say, "intelligence") that maps to a collection of values
 * (say, "witty") which map either several other attribute values
 * (say, "funny" + "quick" - "mindful"), or map to the underlying
 * multivalence number.  The underlying multivalence number is also
 * an attribute, but it should never be directly used.
 *
 * All attributes have an underlying numeric value, and the names must be
 * globally unique.
 */
export interface AttributeType {
  readonly name: string
  readonly type: string
}

export function isValidNumber(v: any): boolean {
  return (typeof v === 'number') && v >= INTEGER_RANGE_MIN && v <= INTEGER_RANGE_MAX
}
export const INTEGER_RANGE_TYPE = 'number between ' + INTEGER_RANGE_MIN + ' and ' + INTEGER_RANGE_MAX

export type ATTRIBUTE_MAP_TYPE = 'map'
export const ATTRIBUTE_MAP_TYPE = 'map'
export type ATTRIBUTE_NUMBER_TYPE = 'number'
export const ATTRIBUTE_NUMBER_TYPE = 'number'
export type ATTRIBUTE_COUNT_TYPE = 'count'
export const ATTRIBUTE_COUNT_TYPE = 'count'
export type ATTRIBUTE_RANGE_TYPE = 'range'
export const ATTRIBUTE_RANGE_TYPE = 'range'
export type ATTRIBUTE_FUZZ_TYPE = 'fuzz'
export const ATTRIBUTE_FUZZ_TYPE = 'fuzz'
export type ATTRIBUTE_GROUP_TYPE = 'group'
export const ATTRIBUTE_GROUP_TYPE = 'group'
export type ATTRIBUTE_RANDOM_TYPE = 'random'
export const ATTRIBUTE_RANDOM_TYPE = 'random'
export type ATTRIBUTE_FUNCTION_TYPE = 'calculated'
export const ATTRIBUTE_FUNCTION_TYPE = 'calculated'
export type ATTRIBUTE_NAME_LIST_TYPE = 'name-list'
export const ATTRIBUTE_NAME_LIST_TYPE = 'name-list'
export type ATTRIBUTE_DATE_TYPE = 'date'
export const ATTRIBUTE_DATE_TYPE = 'date'

// The "export const AttributeTypeConstraint"
// gives a "ConstraintSet is not a constructor" error, which is really, really odd.
// It's probably an import ordering problem.
// export const AttributeTypeConstraint: ConstraintSet = new ConstraintSet('attribute')
const AttributeTypeConstraint: [ConstraintSet | null] = [null]

export function getAttributeTypeConstraint(): ConstraintSet {
  if (AttributeTypeConstraint[0] === null) {
    AttributeTypeConstraint[0] = new ConstraintSet('attribute')
      .mustHave('name', 'string', ac => ac.isAString())
      .asTypeBy('type', {
        // map types are just the type definition.
        [ATTRIBUTE_MAP_TYPE]: () => { },

        // fuzz types are just the type definition.
        [ATTRIBUTE_FUZZ_TYPE]: () => { },

        // group types are a collection of group values.
        [ATTRIBUTE_GROUP_TYPE]: () => { },

        [ATTRIBUTE_RANDOM_TYPE]: () => { },

        [ATTRIBUTE_DATE_TYPE]: () => { },

        // integer types are bounded.
        [ATTRIBUTE_NUMBER_TYPE]: csSrc => csSrc
          .mustHave('min', 'number', ac => ac
            .isNumberBetween(INTEGER_RANGE_MIN, INTEGER_RANGE_MAX))
          .mustHave('max', 'number', ac => ac
            .isNumberBetween(INTEGER_RANGE_MIN, INTEGER_RANGE_MAX))
          .has('min < max', src => {
            return (<any>src).min < (<any>src).max
          }),

        // shortcut: "number" value given as count, and translated into an integer
        [ATTRIBUTE_COUNT_TYPE]: () => { },
        // Implies:
        // src.type = ATTRIBUTE_NUMBER_TYPE
        // src.min = 0
        // src.max = INTEGER_RANGE_MAX

        // shortcut: "number" value given as range, and translated into an integer
        [ATTRIBUTE_RANGE_TYPE]: csSrc => csSrc
          .canHave('min', 'number', ac => ac.isNumberBetween(INTEGER_RANGE_MIN, INTEGER_RANGE_MAX))
          .canHave('max', 'number', ac => ac.isNumberBetween(INTEGER_RANGE_MIN, INTEGER_RANGE_MAX))
          .has('min < max', src => {
            FIXME_debug(`DEBUG comparing <<${(<any>src).min}>> and <<${(<any>src).max}>>`)
            return ((<any>src).min === undefined) || ((<any>src).max === undefined) || (<any>src).min < (<any>src).max
          }),
        // implies:
        // src.type = ATTRIBUTE_NUMBER_TYPE
        // src.min = typeof src.min === 'number' ? src.min : INTEGER_RANGE_MIN
        // src.max = typeof src.max === 'number' ? src.max : INTEGER_RANGE_MAX

        [ATTRIBUTE_FUNCTION_TYPE]: csSrc => csSrc
          .mustHave('function', 'function definition', FunctionAttributeConstraint)
      })
  }
  return AttributeTypeConstraint[0]
}

/*
export const AttributeTypeConstraint: ConstraintSet = new ConstraintSet('attribute')
  .mustHave('name', 'string', ac => ac.isAString())
  .asTypeBy('type', {
    // map types are just the type definition.
    [ATTRIBUTE_MAP_TYPE]: () => { },

    // fuzz types are just the type definition.
    [ATTRIBUTE_FUZZ_TYPE]: () => { },

    // group types are a collection of group values.
    [ATTRIBUTE_GROUP_TYPE]: () => { },

    [ATTRIBUTE_RANDOM_TYPE]: () => { },

    [ATTRIBUTE_DATE_TYPE]: () => { },

    // integer types are bounded.
    [ATTRIBUTE_NUMBER_TYPE]: csSrc => csSrc
      .mustHave('min', 'number', ac => ac
        .isNumberBetween(INTEGER_RANGE_MIN, INTEGER_RANGE_MAX))
      .mustHave('max', 'number', ac => ac
        .isNumberBetween(INTEGER_RANGE_MIN, INTEGER_RANGE_MAX))
      .has('min < max', src => {
        return (<any>src).min < (<any>src).max
      }),

    // shortcut: "number" value given as count, and translated into an integer
    [ATTRIBUTE_COUNT_TYPE]: () => { },
    // Implies:
    // src.type = ATTRIBUTE_NUMBER_TYPE
    // src.min = 0
    // src.max = INTEGER_RANGE_MAX

    // shortcut: "number" value given as range, and translated into an integer
    [ATTRIBUTE_RANGE_TYPE]: csSrc => csSrc
      .canHave('min', 'number', ac => ac.isNumberBetween(INTEGER_RANGE_MIN, INTEGER_RANGE_MAX))
      .canHave('max', 'number', ac => ac.isNumberBetween(INTEGER_RANGE_MIN, INTEGER_RANGE_MAX))
      .has('min < max', src => {
        FIXME_debug(`DEBUG comparing <<${(<any>src).min}>> and <<${(<any>src).max}>>`)
        return ((<any>src).min === undefined) || ((<any>src).max === undefined) || (<any>src).min < (<any>src).max
      }),
    // implies:
    // src.type = ATTRIBUTE_NUMBER_TYPE
    // src.min = typeof src.min === 'number' ? src.min : INTEGER_RANGE_MIN
    // src.max = typeof src.max === 'number' ? src.max : INTEGER_RANGE_MAX

    [ATTRIBUTE_FUNCTION_TYPE]: csSrc => csSrc
      .mustHave('function', 'function definition', FunctionAttributeConstraint)
  })
*/

export const parseSrcAttribute: ParseSrcKey<AttributeType> = (src: any): ParsedInfo<AttributeType> => {
  const errors: ParsedError[] = []
  getAttributeTypeConstraint().runVerify(src, errors)
  return createParsedInfo(src, errors, 'attribute')
}

type AttributeTypeCheck<T extends AttributeType> = (t: any) => t is T

/**
 * The "map" attribute defines a general attribute name that will have
 * text references.  It does not define the values.  Map attributes are
 * multivalence, meaning that all the values in the map have a specific
 * inclusion.  The underlying evaluated number is a "fuzz".
 */
export interface AttributeMapType extends AttributeType {
}

export const isAttributeMapType: AttributeTypeCheck<AttributeMapType> = (t: AttributeType): t is AttributeMapType => {
  return t.type === ATTRIBUTE_MAP_TYPE
}


/**
 * A floating point value from 0 to 1, inclusive.
 */
export interface AttributeFuzzType extends AttributeType {
}

export const isAttributeFuzzType: AttributeTypeCheck<AttributeFuzzType> = (t: AttributeType): t is AttributeFuzzType => {
  return t.type === ATTRIBUTE_FUZZ_TYPE
}


/**
 * A set of unique strings that form a multi-valence set ("fuzzy set").
 */
export interface AttributeGroupType extends AttributeType {
}

export const isAttributeGroupType: AttributeTypeCheck<AttributeGroupType> = (t: AttributeType): t is AttributeGroupType => {
  return t.type === ATTRIBUTE_GROUP_TYPE
}


/**
 * Stored as a seed value that is updated with each query.  Returns a
 * random `number` value.
 */
export interface AttributeRandomType extends AttributeType {
}

export const isAttributeRandomType: AttributeTypeCheck<AttributeGroupType> = (t: AttributeType): t is AttributeRandomType => {
  return t.type === ATTRIBUTE_RANDOM_TYPE
}


/**
 * An integer value is an integer value that has a range of values.
 */
export interface AttributeIntegerType extends AttributeType {
  readonly min: number
  readonly max: number
}

export const isAttributeIntegerType: AttributeTypeCheck<AttributeIntegerType> = (t: AttributeType): t is AttributeIntegerType => {
  return t.type === ATTRIBUTE_NUMBER_TYPE
    && (typeof (<AttributeIntegerType>t).min === 'number')
    && (typeof (<AttributeIntegerType>t).max === 'number')
}

export interface AttributeFunctionBaseType extends AttributeType {
  readonly valueType: string
  readonly expression: string
}

/**
 * A numeric calculation type.
 */
export interface AttributeFunctionType extends AttributeType {
  readonly valueType: string
  readonly min?: number
  readonly max?: number
  readonly expression: string
  readonly requires: { [key: string]: string }
}

export const isAttributeFunctionType: AttributeTypeCheck<AttributeFunctionType> = (t: any): t is AttributeFunctionType => {
  return t.type === ATTRIBUTE_NUMBER_TYPE
    && (typeof t.valueType === 'string')
    && (typeof t.expression === 'string')
    && (typeof t.requires === 'object')
    && (t.valueType !== ATTRIBUTE_NUMBER_TYPE || typeof t.min === 'number')
    && (t.valueType !== ATTRIBUTE_NUMBER_TYPE || typeof t.max === 'number')
}