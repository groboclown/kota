
import { Internal } from './base'
import * as o from './type-objects'
import * as m from '../module/attribute'
import {
  INTEGER_RANGE_MIN, INTEGER_RANGE_MAX
} from '../../lib/attributes/primitives'
import { HasErrorValue, coreError } from '../../lib/error';

/**
 * Converts Module (user-land view) objects into internal objects.
 */
export type convertModuleToInternValue<T> = (moduleValue: T) => Internal

export const MODULE_TO_INTERN: { [key: string]: convertModuleToInternValue<any> } = {
  [m.ATTRIBUTE_COUNT_TYPE]: convertCountAttribute,
  [m.ATTRIBUTE_RANGE_TYPE]: convertRangeAttribute,
  [m.ATTRIBUTE_NUMBER_TYPE]: convertNumberAttribute,
  [m.ATTRIBUTE_DATE_TYPE]: convertDateAttribute,
  //[m.ATTRIBUTE_FUNCTION_TYPE]: null,
  //[m.ATTRIBUTE_FUZZ_TYPE]: null,
  //[m.ATTRIBUTE_GROUP_TYPE]: null,
  //[m.ATTRIBUTE_MAP_TYPE]: null,
  //[m.ATTRIBUTE_NAME_LIST_TYPE]: null,
  //[m.ATTRIBUTE_RANDOM_SOURCE_TYPE]: null,
  //[m.ATTRIBUTE_RANDOM_TYPE]: null,

  // There are other types, but they should not be defined in the module.
}

export function convertModuleToIntern(moduleValue: any): Internal | HasErrorValue {
  if (moduleValue.type === undefined || MODULE_TO_INTERN[moduleValue.type] === undefined) {
    return { error: coreError('not module value') }
  }
  return MODULE_TO_INTERN[moduleValue.type](moduleValue)
}

function convertCountAttribute(moduleValue: m.AttributeType): o.NumberAttribute {
  return new o.NumberAttribute(0, INTEGER_RANGE_MAX)
}

function convertRangeAttribute(moduleValue: m.AttributeType): o.NumberAttribute {
  const x = <any>moduleValue
  const min = typeof x.min === 'number' ? Math.max(INTEGER_RANGE_MIN, x.min) : INTEGER_RANGE_MIN
  const max = typeof x.max === 'number' ? Math.min(INTEGER_RANGE_MAX, x.max) : INTEGER_RANGE_MAX
  return new o.NumberAttribute(min, max)
}

function convertNumberAttribute(moduleValue: m.AttributeIntegerType): o.NumberAttribute {
  return new o.NumberAttribute(
    Math.max(INTEGER_RANGE_MIN, moduleValue.min),
    Math.min(INTEGER_RANGE_MAX, moduleValue.max)
  )
}

function convertDateAttribute(moduleValue: m.AttributeType): o.DateAttribute {
  return new o.DateAttribute()
}
