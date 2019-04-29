/**
 * A function is a value added to an owning attribute.  Thus, it is
 * never a value.  Currently, these are only supported on
 * calculated attributes and maps.
 */

import { AttributeConstraintFunc } from './parse-contraints'
import { INTEGER_RANGE_MAX, INTEGER_RANGE_MIN } from '../../lib/attributes/primitives'

export interface FunctionAttributeBaseType {
  readonly type: string
}

export const FUNCTION_ATTRIBUTE_TYPE_NEAR = 'near'
export const FUNCTION_ATTRIBUTE_TYPE_INTEGER = 'number'
export const FUNCTION_ATTRIBUTE_TYPE_COUNT = 'count'

export const FunctionAttributeConstraint: AttributeConstraintFunc = acSrc => acSrc
  .contains(srcCf => srcCf
    .asTypeBy('type', {
      [FUNCTION_ATTRIBUTE_TYPE_NEAR]: csSrc => csSrc
        // the attribute in the context that the function uses.
        .mustHave('for', 'attribute name', ac => ac
          .isAString())

        // distance from 0 to 1
        .canHave('ramp', 'linear ramp distance', ac => ac
          .isANumber())

        .matchesOneOf({
          target: csSrc => csSrc
            // translates to { min <- target, max <- target }
            .mustHave('target', 'number', ac => ac
              .isNumberBetween(INTEGER_RANGE_MIN, INTEGER_RANGE_MAX)),
          lowerBound: csSrc => csSrc
            // translates to { min <- INT_MIN, max <- lessThan }
            .mustHave('lessThan', 'number', ac => ac
              .isNumberBetween(INTEGER_RANGE_MIN, INTEGER_RANGE_MAX)),
          upperBound: csSrc => csSrc
            // translates to { min <- moreThan, max <- INT_MAX }
            .mustHave('moreThan', 'number', ac => ac
              .isNumberBetween(INTEGER_RANGE_MIN, INTEGER_RANGE_MAX)),
          range: csSrc => csSrc
            // This is the standard form.
            .mustHave('min', 'number', ac => ac
              .isNumberBetween(INTEGER_RANGE_MIN, INTEGER_RANGE_MAX))
            .mustHave('max', 'number', ac => ac
              .isNumberBetween(INTEGER_RANGE_MIN, INTEGER_RANGE_MAX))
            .has('min < max', src => {
              return (<any>src).min < (<any>src).max
            }),
        })
      ,

      [FUNCTION_ATTRIBUTE_TYPE_INTEGER]: csSrc => csSrc
        .mustHave('expression', 'computation string expression', ac => ac
          .isAString())
        .mustHave('requires', 'map of expression variable names to context attribute name', ac => ac
          .isAnObject())
        .canHave('bound', 'map of boundary conditions', acB => acB.contains(acCs => acCs
          .canHave('min', 'number', ac => ac
            .isNumberBetween(INTEGER_RANGE_MIN, INTEGER_RANGE_MAX))
          .canHave('max', 'number', ac => ac
            .isNumberBetween(INTEGER_RANGE_MIN, INTEGER_RANGE_MAX))
          .has('min < max', src => {
            const s: any = <any>src
            // Because min and max are optional, this rule is only valid if both are set.
            return (typeof s.min !== 'number' || typeof s.max !== 'number' || s.min < s.max)
          })
          .canHave('round', 'string', ac => ac
            .isInStringSet(['floor', 'ceiling', 'closest']))
        )
        )
      ,

      [FUNCTION_ATTRIBUTE_TYPE_COUNT]: csSrc => csSrc
        .mustHave('expression', 'computation string expression', ac => ac
          .isAString())
        .mustHave('requires', 'map of expression variable names to context attribute name', ac => ac
          .isAnObject())
        .canHave('bound', 'map of boundary conditions', acB => acB.contains(acCs => acCs
          .canHave('min', 'number', ac => ac
            .isNumberBetween(0, INTEGER_RANGE_MAX))
          .canHave('max', 'number', ac => ac
            .isNumberBetween(0, INTEGER_RANGE_MAX))
          .has('min < max', src => {
            const s: any = <any>src
            // Because min and max are optional, this rule is only valid if both are set.
            return (typeof s.min !== 'number' || typeof s.max !== 'number' || s.min < s.max)
          })
          .canHave('round', 'string', ac => ac
            .isInStringSet(['floor', 'ceiling', 'closest']))
        )
        )
      ,
    })
  )

export interface FunctionAttributeNearBaseType extends FunctionAttributeBaseType {
  readonly for: string
  readonly ramp?: number
}

function isFunctionAttributeNearBaseType(t: any): t is FunctionAttributeNearBaseType {
  return t.type === FUNCTION_ATTRIBUTE_TYPE_NEAR && typeof t.for === 'string'
    && (t.ramp === undefined || typeof t.ramp === 'number')
}

export interface FunctionAttributeNearRange extends FunctionAttributeNearBaseType {
  readonly min: number
  readonly max: number
  // optional range
}

function isFunctionAttributeNearRange(t: any): t is FunctionAttributeNearRange {
  return typeof t.min === 'number' && typeof t.max === 'number'
    && isFunctionAttributeNearBaseType(t)
}

export interface FunctionAttributeNearTarget extends FunctionAttributeNearBaseType {
  readonly target: number
}

export function isFunctionAttributeNearTarget(t: any): t is FunctionAttributeNearTarget {
  return typeof t.target === 'number'
    && isFunctionAttributeNearRange(t)
}

export interface FunctionAttributeNearLowerBound extends FunctionAttributeNearBaseType {
  readonly lessThan: number
  // optional range
}

export function isFunctionAttributeNearLowerBound(t: any): t is FunctionAttributeNearLowerBound {
  return typeof t.lessThan === 'number'
    && isFunctionAttributeNearRange(t)
}

export interface FunctionAttributeNearUpperBound {
  readonly moreThan: number
  // optional range
}

export function isFunctionAttributeNearUpperBound(t: any): t is FunctionAttributeNearUpperBound {
  return typeof t.moreThan === 'number'
    && isFunctionAttributeNearRange(t)
}
