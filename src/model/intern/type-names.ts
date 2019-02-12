
// A "group" which contains membership functions.
export type ATTRIBUTE_GROUP_DEFINITION = 'group-def'
export const ATTRIBUTE_GROUP_DEFINITION = 'group-def'

export type ATTRIBUTE_REFERENCE_DEFINITION = 'reference'
export const ATTRIBUTE_REFERENCE_DEFINITION = 'reference'

export type ATTRIBUTE_INTERNAL_POINTER = 'pointer'
export const ATTRIBUTE_INTERNAL_POINTER = 'pointer'

// Internal types are more strict than the module definition.
export {
  ATTRIBUTE_NAME_LIST_TYPE,
  ATTRIBUTE_NUMBER_TYPE,
  ATTRIBUTE_FUZZ_TYPE,
  ATTRIBUTE_GROUP_SET_TYPE,
  ATTRIBUTE_FUNCTION_TYPE,
  ATTRIBUTE_DATE_TYPE
} from '../module/attribute'

import * as attr from '../module/attribute'

export type ATTRIBUTE_DATA_TYPE =
  // Note the missing values - that's intentional.
  attr.ATTRIBUTE_NAME_LIST_TYPE |
  attr.ATTRIBUTE_NUMBER_TYPE |
  attr.ATTRIBUTE_FUZZ_TYPE | attr.ATTRIBUTE_GROUP_SET_TYPE |
  attr.ATTRIBUTE_FUNCTION_TYPE | attr.ATTRIBUTE_DATE_TYPE |
  attr.ATTRIBUTE_DATE_DELTA_TYPE |
  ATTRIBUTE_REFERENCE_DEFINITION | ATTRIBUTE_GROUP_DEFINITION
export const ATTRIBUTE_DATA_TYPE_SET = [
  attr.ATTRIBUTE_NAME_LIST_TYPE,
  attr.ATTRIBUTE_NUMBER_TYPE,
  attr.ATTRIBUTE_FUZZ_TYPE, attr.ATTRIBUTE_GROUP_SET_TYPE,
  attr.ATTRIBUTE_FUNCTION_TYPE, attr.ATTRIBUTE_DATE_TYPE,
  attr.ATTRIBUTE_DATE_DELTA_TYPE,
  ATTRIBUTE_REFERENCE_DEFINITION, ATTRIBUTE_GROUP_DEFINITION
]

export const GROUP_DEFINITION = 'group-def'
export type GROUP_DEFINITION = 'group-def'

// --------------------------------------------------------
// Actual values stored in the tree.
export const VALUE_NAME_LIST_ITEM = 'n'
export type VALUE_NAME_LIST_ITEM = 'n'
export const VALUE_NUMBER = 'i'
export type VALUE_NUMBER = 'i'
export const VALUE_FUZZ = 'f'
export type VALUE_FUZZ = 'f'
export const VALUE_GROUP_SET_FOR = 'g'
export type VALUE_GROUP_SET_FOR = 'g'
export const VALUE_CALCULATED = 'c'
export type VALUE_CALCULATED = 'c'
export const VALUE_DATE_DELTA = 'd'
export type VALUE_DATE_DELTA = 'd'
export const VALUE_DATE = 't'
export type VALUE_DATE = 't'

// This is a very special type with unique properties.
export type RANDOM_SOURCE_TYPE = 'random-source'
export const RANDOM_SOURCE_TYPE = 'random-source'

export type DATA_TYPE = ATTRIBUTE_DATA_TYPE |
  RANDOM_SOURCE_TYPE | GROUP_DEFINITION |
  VALUE_NAME_LIST_ITEM |
  VALUE_NUMBER |
  VALUE_FUZZ |
  VALUE_GROUP_SET_FOR |
  VALUE_CALCULATED |
  VALUE_DATE_DELTA |
  VALUE_DATE
