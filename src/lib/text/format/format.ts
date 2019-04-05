
import { HasErrorValue, hasErrorValue } from '../../error'
import {
  Context, joinPaths, PATH_SEPARATOR,
  PointerContext,
  isGroupSetInternal,
  isContextReference,
  ATTRIBUTE_DATA_TYPE
} from '../../context'
import { CURRENT_FUNCTION_ARGUMENTS_PATH } from '../../core-paths'
import * as loc from '../localization'
import {
  SplitContext, getGroupSetValue, Internal
} from '../../../model/intern'
import { splitLast, stripTrailingSlash } from '../../../model/intern/base'

export interface LocalizedText {
  text: string
}

export const VALUE_DATA_CONTEXT_TYPE = 'context'
export type VALUE_DATA_CONTEXT_TYPE = 'context'
export type VALUE_DATA_TYPE = ATTRIBUTE_DATA_TYPE | VALUE_DATA_CONTEXT_TYPE

// How could anyone accept such deep imperfections in numbers?

/**
 * Pair of argument name (or regular expression matching argument name)
 * with its expected data value type.
 */
export interface FormatVariableArgumentType {
  name: string | RegExp
  type: VALUE_DATA_TYPE

  // if not given, then it is not optional
  optional?: boolean
}

/**
 * Generalized methods for generating text from a format template using
 * a context variable and localization.  This concerns itself with
 * direct text rendering, but not with preparing the text for output.
 *
 * Every instance MUST be stateless.
 */
export interface FormatVariable {
  /** When a format template wants an explicit format of a variable, it declares which formatName to use. */
  readonly formatName: string

  format(
    ctx: Context,
    template: string,
    l10n: loc.Localization
  ): LocalizedText | HasErrorValue
}

/** A list of pointers to the argument value. */
export type ArgumentReference = string[]

/** A mapping of argument name to the argument lookup; name can be a user-specified name or the index in the argument list. */
export type ArgumentMapping = { [key: string]: ArgumentReference }


/**
 * Creates a context which maps all the `args` over to the argument path.  The keys will
 * be relative to the CURRENT_FUNCTION_ARGUMENTS_PATH.  The argments may be a list of pointers.
 * This is resolved before returning.
 *
 * @param baseContext
 * @param fv
 * @param args
 */
export function getContextValuesFor(baseContext: Context, fv: FormatVariable, args: ArgumentMapping): Context {
  let pointers = new PointerContext(baseContext)
  Object.keys(args).forEach(key => {
    const refList = args[key]
    if (key.length > 0 && refList && refList.length > 0) {
      console.log(`DEBUG: -+- discovering [${key}] -> ${JSON.stringify(refList)}`)
      // Now find the corresponding reference location.
      // This requires inspecting the links of joins
      let v = lookup(baseContext, refList[0], [])
      let value: Internal | undefined = v[0]
      let reference: string = v[1]
      // Each additional item in the pointer list is relative to
      // the previous item's value.
      for (let i = 1; i < refList.length; i++) {
        if (value === undefined) {
          // Can't go any further.  Leave the reference to this.
          console.log(`DEBUG: -+- :: no context value at ${reference}`)
          break
        }
        if (isGroupSetInternal(value)) {
          // Follow the group value's reference.  There may be 0 or more
          // entries in the group value, but we only care about the first.
          const groupVal = getGroupSetValue(value, baseContext)
          if (hasErrorValue(groupVal)) {
            // Nothing else to do here.  Don't report the error?
            // Leave the reference here, so that other parsing can
            // report the problem properly.
            console.log(`DEBUG: -+- :: get group value ${JSON.stringify(value)} returned error ${JSON.stringify(groupVal.error)}`)
            break
          }
          if (groupVal.values.length <= 0) {
            // No values, so leave the reference here, so that other
            // parsing can report the issue properly.
            console.log(`DEBUG: -+- :: no group values`)
            break
          }
          v = lookup(baseContext, joinPaths(groupVal.values[0].referencePath, refList[i]), [])
          value = v[0]
          reference = v[1]
          console.log(`DEBUG: -+- :: mapped "${groupVal.values[0].referencePath}" + "${refList[i]}" -> "${reference}"`)
        } else if (isContextReference(value)) {
          console.log(`DEBUG: -+- :: mapped "${reference}"`)
          v = lookup(baseContext, joinPaths(value.referencePath, refList[i]), [])
          value = v[0]
          reference = v[1]
          console.log(`DEBUG: -+- ::   -> "${reference}"`)
        } else {
          // Unknown reference type.
          console.log(`DEBUG: -+- :: cannot lookup pointer from ${value.type}`)
          break
        }
      }

      // The key is relative to the CURRENT_FUNCTION_ARGUMENTS_PATH,
      // due to the SplitContext below.
      console.log(`DEBUG: -+- :: final mapping [${key}] -> [${reference}]`)
      pointers.addPointer(PATH_SEPARATOR + key, reference)
    }
  })

  // Use a SplitContext, in order to mask the baseContext's previous
  // function variables.
  return new SplitContext({
    [CURRENT_FUNCTION_ARGUMENTS_PATH + PATH_SEPARATOR]: pointers
  }, baseContext)
}


// Exported for Unit Tests only.
export function lookup(ctx: Context, origPath: string, history: string[]): [Internal | undefined, string] {
  // TODO 
  const path = stripTrailingSlash(origPath)
  console.log(`DEBUG: -+- ::= Looking up ${path} (was ${origPath})`)
  if (history.indexOf(path) >= 0 || history.length > 1000) {
    // Prevent infinite recursion
    console.log(`DEBUG: -+- ::=   recursion from ${JSON.stringify(history)}`)
    return [undefined, path]
  }
  let value = ctx.getInternal(path)
  let base = path
  let rest = ''
  let debugCount = 0
  while (value === undefined && base.length > 1) {
    const parts = splitLast(base)
    base = stripTrailingSlash(parts[0])
    rest = parts[1] + PATH_SEPARATOR + rest
    console.log(`DEBUG: -+- ::=   looking to ${base}`)
    value = ctx.getInternal(base)
    if (++debugCount > 10) {
      throw new Error(`bad path: "${base}" + "${rest}"`)
    }
  }
  if (value !== undefined) {
    if (isContextReference(value)) {
      console.log(`DEBUG: -+- ::=   mapped to reference ${value.referencePath} + "${rest}"`)
      history.push(path)
      const v = lookup(ctx, joinPaths(value.referencePath, rest), history)
      value = v[0]
      base = v[1]
      rest = ''
    } else if (rest.length > 0) {
      console.log(`DEBUG: -+- ::=   Lookup found value with extra path ${rest}`)
      // Invalid path - a parent node has a value, not the child.
      value = undefined
    }
  }

  return [value, base]
}
