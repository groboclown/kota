
import {
  Internal
} from './base'
import { RandomSeed } from '../../lib/math/seedrandom'
import * as tn from './type-names'
import * as m from '../module/attribute'
import { number } from 'prop-types';

// -------------------------------------------------------------------------
// All attribute types describe the attribute, and do not store mutable information.
// Thus, they return themselves.

export class AttributeInternal<T extends AttributeInternal<T>> implements Internal<T> {
  constructor(
    public readonly type: tn.ATTRIBUTE_DATA_TYPE
  ) { }
}

export class NumberAttribute extends AttributeInternal<NumberAttribute> {
  constructor(public readonly min: number, public readonly max: number) {
    super(m.ATTRIBUTE_NUMBER_TYPE)
  }
}

export class DateAttribute extends AttributeInternal<DateAttribute> {
  constructor() {
    super(m.ATTRIBUTE_DATE_TYPE)
  }
}

// Function operations are defiend in 'function.ts'
export const FUNCTION_EXPRESSION_TYPE_OPERATION = 'o'
export type FUNCTION_EXPRESSION_TYPE_OPERATION = 'o'
export const FUNCTION_EXPRESSION_TYPE_VAR = 'v'
export type FUNCTION_EXPRESSION_TYPE_VAR = 'v'
export const FUNCTION_EXPRESSION_TYPE_CONST = 'c'
export type FUNCTION_EXPRESSION_TYPE_CONST = 'c'

export type FUNCTION_EXPRESSION_TYPE =
  FUNCTION_EXPRESSION_TYPE_OPERATION |
  FUNCTION_EXPRESSION_TYPE_CONST |
  FUNCTION_EXPRESSION_TYPE_VAR

export type FunctionExpressionValue = [FUNCTION_EXPRESSION_TYPE, string | number]
export type FunctionExpression = FunctionExpressionValue[]

export class FunctionAttribute extends AttributeInternal<FunctionAttribute> {
  constructor(
    public readonly dependentValuePathMap: { [name: string]: string },
    public readonly calculatedType: tn.DATA_TYPE,
    public readonly sourceType: tn.DATA_TYPE,
    public readonly minValue: number,
    public readonly maxValue: number,

    // The expression is postfix style (e.g. hewlet packard calculators):
    // val = const | variable | operation
    // operation = val ... operationId
    // Prefix notation requires keeping track of the required argument count while
    // reading in the arguments, which is more complex.
    public readonly expression: FunctionExpression
  ) {
    super(m.ATTRIBUTE_FUNCTION_TYPE)
  }
}

// -------------------------------------------------------------------------
// The random source is a seed that generates random numbers.

export class RandomSourceInternal implements Internal<number> {
  readonly type: tn.DATA_TYPE = tn.RANDOM_SOURCE_TYPE

  constructor(
    public seed: RandomSeed
  ) { }
}

// -------------------------------------------------------------------------
// All non-static values must be a Calculated type, so that the values can
// be correctly memoized.  On update, the `lastCalculatedTick` must be updated too.

export class CalculatedInternal<T> implements Internal<T> {

  /** indicates that this is a calculated value */
  readonly calculated: boolean = true

  /** the last internal "tick" when the calculated value was updated. */
  lastCalculatedTick: number = -1

  constructor(
    public readonly type: tn.DATA_TYPE
  ) { }
}


export function isCalculatedInternal(v: any): v is CalculatedInternal<any> {
  return v.calculated
}


export class CalculatedFunctionInternal extends CalculatedInternal<number> {
  previousValue: number | null = null
  constructor(
    public calculationPath: string
  ) {
    super(tn.VALUE_CALCULATED)
  }
}


// -------------------------------------------------------------------------
// Date internal, to be serializable, stores the explicit month, day, year.
// However, the getter and setter reference a Date object.

export class DateInternal extends CalculatedInternal<Date> {
  day: number
  month: number
  year: number

  constructor(date: Date)
  constructor(day: number, month: number, year: number)
  constructor(day: number | Date, month?: number, year?: number) {
    super(tn.VALUE_DATE)
    if (typeof day === 'number') {
      this.day = day
      this.month = month || 0
      this.year = year || 0
    } else {
      // Note: "date" is day of the month, "day" is day of the week.
      this.day = day.getDate()
      this.month = day.getMonth()
      this.year = day.getUTCFullYear()
    }
  }
}


export class NumberInternal extends CalculatedInternal<number> {
  constructor(
    type: tn.ATTRIBUTE_FUZZ_TYPE | tn.VALUE_DATE_DELTA | tn.VALUE_NUMBER | tn.VALUE_NAME_LIST_ITEM,
    public value: number
  ) {
    super(type)
  }
}


export class GroupSetInternal extends CalculatedInternal<number> {
  constructor(
    public groups: string[]
  ) {
    super(tn.VALUE_GROUP_SET_FOR)
  }
}
