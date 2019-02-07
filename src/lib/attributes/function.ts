
import { Internal, InternContext } from '../../model/intern'
import {
  CalculatedFunctionInternal,
  FunctionAttribute,
  ATTRIBUTE_FUNCTION_TYPE,
  isCalculatedInternal,
  FUNCTION_EXPRESSION_TYPE_CONST,
  FUNCTION_EXPRESSION_TYPE_OPERATION,
  FUNCTION_EXPRESSION_TYPE_VAR
} from '../../model/intern'
import { HasErrorValue, hasErrorValue, coreError } from '../error';
import { getInternValue } from '../../model/intern/intern-get-set';

type getInternValue = <T>(value: Internal<T>, ctx: InternContext) => T | HasErrorValue

/**
 * Run the calculation for the given value.  It must first look up the attribute definition for the
 * function, then load all the dependent values.  If possible, the memoized value of the calculation
 * will be used in order to save run time.
 *
 * @param value
 * @param getFn
 * @param ctx
 */
export function calcFunctionValue(value: CalculatedFunctionInternal, getFn: getInternValue, ctx: InternContext): number | HasErrorValue {
  const fnAttr = ctx.get(value.calculationPath, ATTRIBUTE_FUNCTION_TYPE)
  if (fnAttr === undefined) {
    return { error: coreError('no function at path', { path: value.calculationPath }) }
  }
  const fnX = getInternValue(fnAttr, ctx)
  if (hasErrorValue(fnX)) {
    return fnX
  }
  const fn = <FunctionAttribute>fnX
  let maxTick = -1
  const srcValues: { [name: string]: number } = {}
  for (const name in fn.dependentValuePathMap) {
    const path = fn.dependentValuePathMap[name]
    const valInternal = ctx.get(path, fn.sourceType)
    if (valInternal === undefined) {
      return { error: coreError('no value for function at path', { func: value.calculationPath, path: path }) }
    }
    if (isCalculatedInternal(valInternal)) {
      maxTick = Math.max(maxTick, valInternal.lastCalculatedTick)
    }
    const v = getFn(valInternal, ctx)
    if (hasErrorValue(v)) {
      return v
    }
    if (typeof v !== 'number') {
      return { error: coreError('invalid function dependency value', { func: value.calculationPath, path: path, type: typeof v }) }
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

type FunctionType = (v: number[]) => number | HasErrorValue

const FUNCTIONS: { [name: string]: [number, FunctionType] } = {
  '*': [2, (v: number[]): number => {
    return v[0] * v[1]
  }],
  '/': [2, (v: number[]): number => {
    if (v[1] === 0) {
      v[1] = 0.0000000000000001
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
      v[0] = 0.0000000000000001
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
