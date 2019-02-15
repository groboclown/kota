
import { HasErrorValue, hasErrorValue } from '../../error'
import {
  Context, joinPaths, PATH_SEPARATOR,
  PointerContext,
  isGroupSetInternal,
  isGroupSetAttribute,
  isGroupDefinitionInternal,
  ATTRIBUTE_DATA_TYPE
} from '../../context'
import { CURRENT_FUNCTION_ARGUMENTS_PATH } from '../../core-paths'
import * as loc from '../localization'
import {
  SplitContext, getGroupSetValue
} from '../../../model/intern'

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
      // console.log(`DEBUG: -+- discovering [${key}] -> ${JSON.stringify(refList)}`)
      // Now find the corresponding reference location.
      // This requires inspecting the links of joins
      let reference: string = refList[0]
      // Each additional item in the pointer list is relative to
      // the previous item's value.
      for (let i = 1; i < refList.length; i++) {
        const refVal = baseContext.getInternal(reference)
        if (refVal === undefined) {
          // Can't go any further.  Leave the reference to this.
          // console.log(`DEBUG: -+- :: no context value at ${reference}`)
          break
        }
        if (isGroupSetInternal(refVal)) {
          // Follow the group value's reference.  There may be 0 or more
          // entries in the group value, but we only care about the first.
          const groupVal = getGroupSetValue(refVal, baseContext)
          if (hasErrorValue(groupVal)) {
            // Nothing else to do here.  Don't report the error?
            // Leave the reference here, so that other parsing can
            // report the problem properly.
            // console.log(`DEBUG: -+- :: get group value ${JSON.stringify(refVal)} returned error ${JSON.stringify(groupVal.error)}`)
            break
          }
          if (groupVal.values.length <= 0) {
            // No values, so leave the reference here, so that other
            // parsing can report the issue properly.
            // console.log(`DEBUG: -+- :: no group values`)
            break
          }
          reference = joinPaths(groupVal.values[0].referencePath, refList[i])
          // console.log(`DEBUG: -+- :: mapped "${groupVal.values[0].referencePath}" + "${refList[i]}" -> "${reference}"`)
        } else {
          // Unknown reference type.
          // console.log(`DEBUG: -+- :: cannot lookup pointer from ${refVal.type}`)
          break
        }
      }

      // The key is relative to the CURRENT_FUNCTION_ARGUMENTS_PATH,
      // due to the SplitContext below.
      // console.log(`DEBUG: -+- :: final mapping [${key}] -> [${reference}]`)
      pointers.addPointer(PATH_SEPARATOR + key, reference)
    }
  })

  // Use a SplitContext, in order to mask the baseContext's previous
  // function variables.
  return new SplitContext({
    [CURRENT_FUNCTION_ARGUMENTS_PATH + PATH_SEPARATOR]: pointers
  }, baseContext)
}
