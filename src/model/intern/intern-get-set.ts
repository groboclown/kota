
import { Internal, InternContext } from './base'
import * as tn from './type-names'
import * as tobj from './type-objects'
import { HasErrorValue, coreError, hasErrorValue } from '../../lib/error';
import { seededRandom } from '../../lib/math/seedrandom'
import { calcFunctionValue } from '../../lib/attributes/function'


/**
 * The implementation of fetching the correct value from an
 * Intern object within a given context.
 */
export function getInternValue<T>(value: Internal<T>, ctx: InternContext): T | HasErrorValue {
  switch (value.type) {
    // Attribute values just return themselves.
    // These are "prototypes" used to generate actual values.
    case tn.ATTRIBUTE_DATE_TYPE:
    case tn.ATTRIBUTE_FUNCTION_TYPE:
    case tn.ATTRIBUTE_FUZZ_TYPE:
    case tn.ATTRIBUTE_GROUP_DEFINITION:
    case tn.ATTRIBUTE_GROUP_TYPE:
    case tn.ATTRIBUTE_NAME_LIST_TYPE:
    case tn.ATTRIBUTE_NUMBER_TYPE:
    case tn.ATTRIBUTE_REFERENCE_DEFINITION:
      return <T>(<any>value)

    // case tn.ATTRIBUTE_INTERNAL_POINTER:

    case tn.RANDOM_SOURCE_TYPE: {
      const vRand = <tobj.RandomSourceInternal>value

      // The random seed in the value will be updated with this random call
      return <T>(<any>seededRandom(vRand.seed))
    }

    case tn.VALUE_DATE: {
      const vDate = <tobj.DateInternal>value
      //return <T>(<any>new Date(vDate.year, vDate.month, vDate.day))
      return <T>(<any>new Date(vDate.year, vDate.month, vDate.day))
    }

    case tn.VALUE_CALCULATED: {
      const r = calcFunctionValue(<tobj.CalculatedFunctionInternal>value, getInternValue, ctx)
      if (hasErrorValue(r)) {
        return r
      }
      return <T>(<any>r)
    }

    case tn.VALUE_GROUP_SET_FOR: {
      const vGroup = <tobj.GroupSetInternal>value
      return <T>(<any>vGroup.groups)
    }

    case tn.VALUE_DATE_DELTA:
    case tn.VALUE_FUZZ:
    case tn.VALUE_NAME_LIST_ITEM:
    case tn.VALUE_NUMBER: {
      const vValue = <tobj.NumberInternal>value
      return <T>(<any>vValue.value)
    }
  }
  throw new Error(`unknown value type "${value.type}"`)
}


export function setInternValue<T>(assignTo: T, value: Internal<T>, tick: number): undefined | HasErrorValue {
  switch (value.type) {
    // Attribute values are not assignable.
    case tn.ATTRIBUTE_DATE_TYPE:
    case tn.ATTRIBUTE_FUNCTION_TYPE:
    case tn.ATTRIBUTE_FUZZ_TYPE:
    case tn.ATTRIBUTE_GROUP_DEFINITION:
    case tn.ATTRIBUTE_GROUP_TYPE:
    case tn.ATTRIBUTE_NAME_LIST_TYPE:
    case tn.ATTRIBUTE_NUMBER_TYPE:
    case tn.ATTRIBUTE_REFERENCE_DEFINITION:
    // Random sources are not assignable
    case tn.RANDOM_SOURCE_TYPE:
    // Calculated values cannot be assigned.
    case tn.VALUE_CALCULATED:
      return { error: coreError('changed immutable value', { type: value.type }) }


    case tn.VALUE_DATE: {
      const aDate = <Date>(<any>assignTo)
      const vDate = <tobj.DateInternal>value
      vDate.lastCalculatedTick = tick
      vDate.month = aDate.getMonth()
      vDate.day = aDate.getDay()
      vDate.year = aDate.getUTCFullYear()
      return
    }

    case tn.VALUE_GROUP_SET_FOR: {
      const vGroup = <tobj.GroupSetInternal>value
      const aGroups = <string[]>(<any>assignTo)
      vGroup.lastCalculatedTick = tick
      vGroup.groups = aGroups
      return
    }

    // All NumberInternal types.
    // Range checking should be done outside of here.
    case tn.VALUE_DATE_DELTA:
    case tn.VALUE_FUZZ:
    case tn.VALUE_NAME_LIST_ITEM:
    case tn.VALUE_NUMBER: {
      const aValue = <number>(<any>assignTo)
      const vValue = <tobj.NumberInternal>value
      vValue.lastCalculatedTick = tick
      vValue.value = aValue
      return
    }
  }
  throw new Error(`unknown value type "${value.type}"`)
}
