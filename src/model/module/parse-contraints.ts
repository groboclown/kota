
import { ParsedError } from './parse-info'
import { coreError } from '../../lib/error'

// FIXME DEBUG
export const FIXME_DEBUG = { debug: false }
export function FIXME_debug(msg: string) {
  if (FIXME_DEBUG.debug) {
    console.log(msg)
  }
}

// If an object is marked to have a subtype (using 'matchesOneOf' or 'asTypeBy'),
// then this key in the object is assigned a dictionary with the key of the
// type equal to true.
export const SUBTYPE_SET_KEY = '$subtype'

export type ConstraintTypeCheckFunction<T> = (v: any) => v is T
export type ConstraintFunction<T> = (v: T) => boolean

interface ConstraintFunctionDetails<T> {
  f: ConstraintFunction<T> | ConstraintTypeCheckFunction<T>
  details: string
}

export function checkCompliance(errors: ParsedError[], src: any, constraints: ConstraintSet): boolean {
  return constraints.runVerify(src, errors)
}

interface Verifiable {
  readonly name: string
  runVerify(objectValue: any, accumulatedErrors?: ParsedError[] | null): boolean
}

const MSGID_REQUIRED_ATTRIBUTE = 'required attribute'

/**
 * Value of an object constraint.
 */
export class AttributeConstraint implements Verifiable {
  constructor(public readonly name: string, private readonly required: boolean, private readonly typeName: string) { }

  private readonly constraintFuncs: ConstraintFunctionDetails<any>[] = []
  private readonly constraintTypeFuncs: ConstraintFunctionDetails<any>[] = []
  private readonly additional: Verifiable[] = [
    // Add in the ordered constraint functions first
    new VerifiableConstraintFunctionDetails(this.name, this.typeName, this.constraintTypeFuncs),
    new VerifiableConstraintFunctionDetails(this.name, this.typeName, this.constraintFuncs)
  ]

  has<T>(details: string, f: ConstraintFunction<T>): AttributeConstraint {
    this.constraintFuncs.push({ f: f, details: details })
    return this
  }
  isAn<T>(typeName: string, f: ConstraintTypeCheckFunction<T>): AttributeConstraint {
    return this.isA(typeName, f)
  }
  isA<T>(typeName: string, f: ConstraintTypeCheckFunction<T>): AttributeConstraint {
    this.constraintTypeFuncs.push({ f: f, details: typeName })
    return this
  }
  /** checks the attribute value's own attributes, for embedded objects. */
  contains(f: ConstraintSetFunc): AttributeConstraint {
    this.isAnObject()
    // This is a bit of an extra memory allocation than may be necessary -
    // if multiple contains are called, multiple constraint sets are used,
    // when only one is necessary.  However, this prevents a recursion with
    // constraintset, and is overall cleaner in implementation.
    const childAttributes = new ConstraintSet(this.name)
    f(childAttributes)
    this.additional.push(childAttributes)
    return this
  }

  // Helpers
  isAString(): AttributeConstraint {
    return this.isA('string', <ConstraintTypeCheckFunction<string>>(v => typeof v === 'string'))
  }
  isAnId(): AttributeConstraint {
    return this.isAn('id', <ConstraintTypeCheckFunction<string>>(v =>
      typeof v === 'string'
      && /^[!@#\$%^&*_\-\+\<\>\~a-zA-Z0-9]+$/.test(v)))
  }
  isAnArrayOfStrings(): AttributeConstraint
  isAnArrayOfStrings(minLength: number): AttributeConstraint
  isAnArrayOfStrings(minLength: number, maxLength: number): AttributeConstraint
  isAnArrayOfStrings(minLength?: number, maxLength?: number): AttributeConstraint {
    return this.isA('list of strings', <ConstraintTypeCheckFunction<any>>(v =>
      (v instanceof Array) && v.reduce(
        (prevValue, currentValue) => prevValue && (typeof currentValue === 'string'),
        true)
      && (typeof minLength !== 'number' || v.length >= minLength)
      && (typeof maxLength !== 'number' || v.length <= maxLength)
    ))
  }
  isAnArrayOfNumbers(): AttributeConstraint {
    return this.isAn('list of numbers', <ConstraintTypeCheckFunction<any>>(v =>
      (v instanceof Array) && v.reduce(
        (prevValue, currentValue) => prevValue && (typeof currentValue === 'number'),
        true)
    ))
  }
  /** Checks that it is an array, and that each element in the array conforms to
   * the constraint set. */
  isAnArrayWith(subtype: string, f: ConstraintSetFunc): AttributeConstraint {
    this.isAn(`${subtype}[]`, <ConstraintTypeCheckFunction<any>>(v => v instanceof Array))
    const itemAttributes = new ConstraintSet(`${subtype}[]`)
    f(itemAttributes)
    this.additional.push(new ForEachConstraintSet(`${subtype}[]`, itemAttributes))
    return this
  }
  isANumber(): AttributeConstraint {
    return this.isA('number', <ConstraintTypeCheckFunction<number>>(v => typeof v === 'number'))
  }
  isNumberBetween(min: number, max: number): AttributeConstraint {
    // Note: not calling isANumber, because we want to keep this expected type.
    FIXME_debug(`adding isNumberBetween ${min} and ${max}`)
    return this.isA(`number in [${min}, ${max}]`,
      <ConstraintTypeCheckFunction<number>>(v => typeof v === 'number' && v >= min && v <= max))
    //<ConstraintTypeCheckFunction<number>>(v => {
    //  FIXME_debug(`checking if <<${v}>> is between ${min} and ${max}`)
    //  return typeof v === 'number' && v >= min && v <= max
    //}))
  }
  isAnObject(): AttributeConstraint {
    return this.isAn('object', <ConstraintTypeCheckFunction<string>>(v => typeof v === 'object' && !(v instanceof Array)))
  }
  isInStringSet(values: string[]): AttributeConstraint {
    this.constraintFuncs.push({
      f: (v: any): boolean =>
        typeof v === 'string' && values.reduce<boolean>(
          // Need only one to match...
          (prevValue, currentValue) => prevValue || currentValue === v,
          false),
      details: setValueType(values)
    })
    return this
  }
  matchesOneOf(constraints: { [key: string]: ConstraintSetFunc }): AttributeConstraint {
    this.additional.push(new OrConstraintSet('sub-type',
      Object.keys(constraints).map(key => {
        const ret = new ConstraintSet(key)
        constraints[key](ret)
        return ret
      })))
    return this
  }


  /** return true on error, false on okay */
  runVerify(attribValue: any, accumulatedErrors: ParsedError[] | null): boolean {
    const errors: ParsedError[] = accumulatedErrors || []
    if (attribValue === undefined) {
      if (this.required) {
        FIXME_debug(`attribute ${this.name} is undefined and required`)
        errors.push({
          attributeName: this.name, attributeType: this.typeName,
          missing: true, invalid: false, srcValue: attribValue, violation: coreError(MSGID_REQUIRED_ATTRIBUTE)
        })
        return true
      }
      // Not required, so this is not an error.
      FIXME_debug(`attribute ${this.name} is undefined but not required`)
      return false
    }

    FIXME_debug(`attribute "${this.name}" is <<${attribValue}>>, running ${this.additional.length} group checks`)

    for (var verifiable of this.additional) {
      if (verifiable.runVerify(attribValue, errors)) {
        // Return as soon as any one of the verifiable objects returns
        // invalid; do not keep collecting errors.
        return true
      }
    }
    // No errors
    return false
  }
}

export type ConstraintSetFunc = (cs: ConstraintSet) => void

export type AttributeConstraintFunc = (ac: AttributeConstraint) => void

/**
 * Whole object constraint.
 */
export class ConstraintSet implements Verifiable {
  private readonly attributes: { [key: string]: AttributeConstraint } = {}
  private readonly allAttributes: AttributeConstraint

  // put the allAttributes into the additional list, to reduce the number of
  // explicit checks in the runVerify.
  private readonly additional: Verifiable[] = []

  constructor(public readonly name: string) {
    this.allAttributes = new AttributeConstraint(name, true, name)
    this.additional.push(this.allAttributes)
  }

  mustHave(attributeName: string, typeName: string, acf: AttributeConstraintFunc): ConstraintSet {
    return this.attribute(attributeName, typeName, true, acf)
  }
  canHave(attributeName: string, typeName: string, acf: AttributeConstraintFunc): ConstraintSet {
    return this.attribute(attributeName, typeName, false, acf)
  }

  attribute(attributeName: string, typeName: string, required: boolean, acf: AttributeConstraintFunc): ConstraintSet {
    const ac = this.attributes[attributeName] || new AttributeConstraint(attributeName, required, typeName)
    this.attributes[attributeName] = ac
    acf(ac)
    return this
  }

  asTypeBy(attributeName: string, selector: { [value: string]: ConstraintSetFunc }): ConstraintSet {
    const applicableValues: string[] = Object.keys(selector)
    this.additional.push(new OrConstraintSet(attributeName,
      applicableValues.map(key => {
        // use 'key' as the constraint set name, not 'attributeName', so that
        // sub-type selection can be made on the key value, which is distinct,
        // whereas the attributeName is common for all the values.
        const ret = new ConstraintSet(key)
        ret.mustHave(attributeName, 'string', ac => ac.has(key, v => v === key))
        selector[key](ret)
        return ret
      })
    ))
    // Adds an implicit attribute constraint
    this.mustHave(attributeName, attributeName, ac => ac.isInStringSet(applicableValues))
    return this
  }

  has<T>(details: string, f: ConstraintFunction<T>): ConstraintSet {
    this.allAttributes.has(details, f)
    return this
  }

  matchesOneOf(constraints: { [key: string]: ConstraintSetFunc }): ConstraintSet {
    this.additional.push(new OrConstraintSet('one-of',
      Object.keys(constraints).map(key => {
        const ret = new ConstraintSet(key)
        constraints[key](ret)
        return ret
      })))
    return this
  }

  /** return true on error, false on okay */
  runVerify(objectValue: any, accumulatedErrors?: ParsedError[] | null): boolean {
    const errors: ParsedError[] = accumulatedErrors || []
    if (typeof objectValue !== 'object') {
      errors.push({
        attributeName: this.name, attributeType: this.name,
        missing: true, invalid: false, srcValue: objectValue, violation: coreError(MSGID_REQUIRED_ATTRIBUTE)
      })
      return true
    }
    var hasError = false
    for (const key in this.attributes) {
      // Easy way for owned value check.
      if (this.attributes[key].runVerify) {
        FIXME_debug(`Running verify for attribute ${key} against ${this.attributes[key].name}`)
        // Note hasHrror is after ||, so that it doesn't short circuit
        hasError = this.attributes[key].runVerify(objectValue[key], errors) || hasError
      }
    }
    if (hasError) {
      return true
    }
    for (const verifiable of this.additional) {
      // Note hasHrror is after ||, so that it doesn't short circuit
      hasError = verifiable.runVerify(objectValue, errors) || hasError
    }
    return hasError
  }
}


/**
 * Simple verifier that runs all the functions in the list.
 */
class VerifiableConstraintFunctionDetails implements Verifiable {
  constructor(public readonly name: string,
    private readonly typeName: string,
    private readonly allOf: ConstraintFunctionDetails<any>[]) { }

  runVerify(objectValue: any, accumulatedErrors?: ParsedError[] | null): boolean {
    const errors: ParsedError[] = accumulatedErrors || []

    // Run all the constraints together, joining their errors.
    var hasError = false
    this.allOf.forEach(cfd => {
      if (!cfd.f(objectValue)) {
        hasError = true
        errors.push({
          attributeName: this.name, attributeType: this.typeName,
          missing: false, invalid: true, srcValue: objectValue,
          violation: coreError(cfd.details)
        })
      }
    })
    return hasError
  }
}

class OrConstraintSet implements Verifiable {
  constructor(public readonly name: string, private readonly oneOf: Verifiable[]) { }

  runVerify(objectValue: any, accumulatedErrors?: ParsedError[] | null): boolean {
    const errors: ParsedError[] = accumulatedErrors || []

    const ourErrors: ParsedError[] = []
    for (const verifiable of this.oneOf) {
      FIXME_debug(`running OR verify on "${this.name} > ${verifiable.name}" for <<${objectValue}>>`)
      const thisErrors: ParsedError[] = []
      const res = verifiable.runVerify(objectValue, thisErrors)
      if (!res) {
        // No error!  Don't add errors to the accumulated list.
        FIXME_debug(` --> generated no error`)
        if (typeof objectValue === 'object') {
          objectValue[SUBTYPE_SET_KEY] = objectValue[SUBTYPE_SET_KEY] || {}
          objectValue[SUBTYPE_SET_KEY][verifiable.name] = true
          FIXME_debug(` new subtype list: ${Object.keys(objectValue[SUBTYPE_SET_KEY])}`)
        }
        return false
      }
      thisErrors.forEach(e => {
        // FIXME NOT RIGHT
        e.violation.params.path = `for ${verifiable.name}: ${e.violation}`
        ourErrors.push(e)
      })
    }
    FIXME_debug(`all ${this.oneOf.length} OR checks failed`)
    ourErrors.forEach(e => errors.push(e))
    return true
  }
}

class ForEachConstraintSet implements Verifiable {
  constructor(public readonly name: string, private readonly matcher: Verifiable) { }

  runVerify(objectValue: any, accumulatedErrors?: ParsedError[] | null): boolean {
    const errors: ParsedError[] = accumulatedErrors || []
    var hasErrors = false
    objectValue.forEach((item: any, index: number) => {
      const foundErrors: ParsedError[] = []
      this.matcher.runVerify(item, foundErrors)
      foundErrors.forEach(err => {
        err.violation.params.path = `for ${this.matcher.name}: ${index}`
        errors.push(err)
      })
    })
    return hasErrors
  }
}


function setValueType(values: string[]): string {
  var valid = 'one of '
  var first = true
  for (var v of values) {
    if (first) {
      first = false
    } else {
      valid += ', '
    }
    valid += '`' + v + '`'
  }
  return valid
}
