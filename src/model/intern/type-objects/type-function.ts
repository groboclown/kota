
import {
  Internal, Context
} from '../base'
import * as tn from '../type-names'
import { AttributeInternal } from './type-attribute'
import * as tv from './type-value'
import * as tc from './type-constant'
import * as m from '../../module/attribute'
import { HasErrorValue, hasErrorValue, coreError } from '../../../lib/error';

// -------------------------------------------------------
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

export class FunctionAttribute extends AttributeInternal {
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

export function isFunctionAttribute(v: Internal): v is FunctionAttribute {
  return v.type === m.ATTRIBUTE_FUNCTION_TYPE
}


export class CalculatedFunction extends tv.CalculatedInternal<number> {
  previousValue: number | null = null
  constructor(
    /** path to the defining attribute that contains the calculation */
    calculationPath: string
  ) {
    super(tn.VALUE_CALCULATED, calculationPath)
  }
}

export function isCalculatedFunction(v: Internal): v is CalculatedFunction {
  return v.type === tn.VALUE_CALCULATED
}


/**
 * Run the calculation for the given value.  It must first look up the attribute definition for the
 * function, then load all the dependent values.  If possible, the memoized value of the calculation
 * will be used in order to save run time.
 *
 * @param value
 * @param getFn
 * @param ctx
 */
export function getFunctionValue(value: CalculatedFunction, ctx: Context): number | HasErrorValue {
  const fn = ctx.getInternal(value.source)
  if (!fn) {
    return { error: coreError('undefined attribute definition for value', { valueType: value.type, path: value.source }) }
  }
  if (!isFunctionAttribute(fn)) {
    return { error: coreError('invalid attribute definition for value', { valueType: value.type, attributeType: fn.type }) }
  }
  let maxTick = -1
  const srcValues: { [name: string]: number } = {}
  for (const name in fn.dependentValuePathMap) {
    const path = fn.dependentValuePathMap[name]
    const valInternal = ctx.getInternal(path)
    if (valInternal === undefined) {
      return { error: coreError('no value for function at path', { func: value.source, path: path }) }
    }
    if (tv.isCalculatedInternal(valInternal)) {
      maxTick = Math.max(maxTick, valInternal.lastCalculatedTick)
    }
    const v = getNumericValueForInternal(valInternal, ctx)
    if (hasErrorValue(v)) {
      return v
    }
    srcValues[name] = v
  }
  if (maxTick <= value.lastCalculatedTick && value.previousValue !== null) {
    // We can use the memoized value!
    return value.previousValue
  }
  const calculated = runCalculation(fn, srcValues)
  if (hasErrorValue(calculated)) {
    return calculated
  }
  value.previousValue = calculated
  value.lastCalculatedTick = maxTick
  return calculated
}


export const GetFunctionValueFunc: tv.getCalculatedInternal<CalculatedFunction, number> =
  (v: CalculatedFunction, ctx: Context): number | HasErrorValue => getFunctionValue(v, ctx)


/**
 * Implements the underlying calculation for the function, using the map of named values in the
 * calculation.
 *
 * This will use the function's min/max values to put a hard limit on the value range.
 *
 * @param vn
 * @param src
 */
// exported only for testing purposes
export function runCalculation(vn: FunctionAttribute, src: { [name: string]: number }): number | HasErrorValue {
  const stack: number[] = []
  for (const exprVal of vn.expression) {
    if (exprVal[0] === FUNCTION_EXPRESSION_TYPE_CONST) {
      if (typeof exprVal[1] === 'number') {
        stack.push(exprVal[1])
      } else {
        // Internal error creating the function definition
        throw new Error(`Incorrect setup for function ${JSON.stringify(vn)}: const '${exprVal[1]}' not a number`)
      }
    } else if (exprVal[0] === FUNCTION_EXPRESSION_TYPE_VAR) {
      if (typeof exprVal[1] === 'string') {
        if (src[exprVal[1]] !== undefined) {
          stack.push(src[exprVal[1]])
        } else {
          // Internal error creating the function definition
          throw new Error(`Incorrect setup for function ${JSON.stringify(vn)}: no variable '${exprVal[1]}' defined`)
        }
      } else {
        // Internal error creating the function definition
        throw new Error(`Incorrect setup for function ${JSON.stringify(vn)}: variable name not a string '${exprVal[1]}'`)
      }
    } else if (exprVal[0] === FUNCTION_EXPRESSION_TYPE_OPERATION) {
      const fnDef = FUNCTIONS[exprVal[1]]
      if (fnDef !== undefined) {
        const argCount = fnDef[0]
        if (stack.length >= argCount) {
          // Take the last argCount values out of the stack and use them as arguments to the function.
          const args = stack.splice(stack.length - argCount, argCount)
          const res = fnDef[1](args)
          if (hasErrorValue(res)) {
            return res
          }
          // console.log(`${exprVal[1]}${JSON.stringify(args)} = ${res}`)
          stack.push(res)
        } else {
          // Internal error creating the function definition
          throw new Error(`Incorrect setup for function ${JSON.stringify(vn)}: too few values in stack: expected ${exprVal[0]}, found ${stack.length}`)
        }
      } else {
        // Internal error creating the function definition
        throw new Error(`Incorrect setup for function ${JSON.stringify(vn)}: function name unknown '${exprVal[1]}'`)
      }
    }
  }

  if (stack.length !== 1) {
    // Internal error creating the function definition
    throw new Error(`Incorrect setup for function ${JSON.stringify(vn)}: dangling stack values ${JSON.stringify(stack)}`)
  }
  return Math.min(vn.maxValue, Math.max(vn.minValue, stack[0]))
}


export function getNumericValueForInternal(v: Internal, ctx: Context): number | HasErrorValue {
  switch (v.type) {
    case tn.VALUE_CALCULATED: {
      if (!isCalculatedFunction(v)) {
        return { error: coreError('unexpected value type', { value: v.type, type: tn.VALUE_CALCULATED }) }
      }
      return getFunctionValue(v, ctx)
    }
    case tn.VALUE_DATE_DELTA: {
      if (!tv.isDateDeltaInternal(v)) {
        return { error: coreError('unexpected value type', { value: v.type, type: tn.VALUE_DATE_DELTA }) }
      }
      return tv.getDateDeltaValue(v)
    }
    case tn.VALUE_FUZZ: {
      if (!tv.isFuzzInternal(v)) {
        return { error: coreError('unexpected value type', { value: v.type, type: tn.VALUE_FUZZ }) }
      }
      return tv.getFuzzValue(v)
    }
    case tn.VALUE_NAME_LIST_ITEM: {
      // TODO is this valid for calculations?
      if (!tv.isNameListInternal(v)) {
        return { error: coreError('unexpected value type', { value: v.type, type: tn.VALUE_NAME_LIST_ITEM }) }
      }
      const ret = tv.getNameListValue(v, ctx)
      if (hasErrorValue(ret)) {
        return ret
      }
      return ret.listIndex
    }
    case tn.VALUE_NUMBER: {
      if (!tv.isNumberInternal(v)) {
        return { error: coreError('unexpected value type', { value: v.type, type: tn.VALUE_NUMBER }) }
      }
      return tv.getNumberValue(v)
    }
    case tn.CONSTANT_NUMBER: {
      if (!tc.isConstantNumberInternal(v)) {
        return { error: coreError('unexpected value type', { value: v.type, type: tn.CONSTANT_NUMBER }) }
      }
      return v.value
    }
  }
  return { error: coreError('non-numeric value type', { value: v.type }) }
}


type FunctionType = (v: number[]) => number | HasErrorValue

const NEAR_ZERO = 0.0000000000000001

const FUNCTIONS: { [name: string]: [number, FunctionType] } = {
  '*': [2, (v: number[]): number => {
    return v[0] * v[1]
  }],
  '/': [2, (v: number[]): number => {
    if (v[1] === 0) {
      v[1] = NEAR_ZERO
    }
    return v[0] / v[1]
  }],
  '+': [2, (v: number[]): number => {
    return v[0] + v[1]
  }],
  '-': [2, (v: number[]): number => {
    return v[0] - v[1]
  }],
  'neg': [1, (v: number[]): number => {
    return -v[0]
  }],
  'inv': [1, (v: number[]): number => {
    if (v[0] === 0) {
      v[0] = NEAR_ZERO
    }
    return 1 / v[0]
  }],
  'atan': [1, (v: number[]): number => {
    return Math.atan(v[0])
  }],

  // Constants
  'pi': [0, (v: number[]): number => Math.PI],
  'e': [0, (v: number[]): number => Math.E],
  'tau': [0, (v: number[]): number => Math.PI * 2],
}
