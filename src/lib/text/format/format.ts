
import { HasErrorValue, hasErrorValue } from '../../error'
import {
  Context, PATH_SEPARATOR,
  PointerContext,
  ATTRIBUTE_DATA_TYPE
} from '../../context'
import { CURRENT_FUNCTION_ARGUMENTS_PATH } from '../../core-paths'
import * as loc from '../localization'
import {
  SplitContext, Internal, lookupInternal
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

/**
 * A list of pointers to the argument value.
 * 
 * FIXME make this a single path string, not a list of pointers.
 */
export type ArgumentReference = string[]

/** A mapping of argument name to the argument lookup; name can be a user-specified name or the index in the argument list. */
export type ArgumentMapping = { [key: string]: ArgumentReference }


/**
 * Creates a context which maps all the `args` over to the argument path.  The keys will
 * be relative to the CURRENT_FUNCTION_ARGUMENTS_PATH.
 *
 * @param baseContext
 * @param fv
 * @param args
 */
export function getContextValuesFor(baseContext: Context, args: ArgumentMapping): Context {
  // TODO this needs a lot of work to make a system where the creator of a story
  // can figure out what happened.
  // 1. Each mapped argument into the context must contain a path history to indicate where it
  //    came from, so that errors can be traced.
  // 2. Errors found in the lookup will need to be embedded in the pointers.  This may mean a
  //    specific type of Context is returned, one that is aware of errors.

  let pointers = new PointerContext(baseContext)
  Object.keys(args).forEach(key => {
    const refList = args[key]
    if (key.length > 0 && refList && refList.length > 0) {
      console.log(`DEBUG: -+- discovering [${key}] -> ${JSON.stringify(refList)}`)
      if (refList.length !== 1) {
        console.log(`DEBUG: -+- :: explicit pointers in paths are no longer supported`)
        return
      }
      // Now find the corresponding reference location.
      // This requires inspecting the links of joins
      let v = lookupInternal(baseContext, refList[0], 10)
      if (hasErrorValue(v[0])) {
        console.log(`DEBUG: -+- :: get path trace [${JSON.stringify(v[2])}] generated an error: ${JSON.stringify(v[0])}`)
        return
      }
      if (v[0] === undefined) {
        console.log(`DEBUG: -+- :: get path trace [${JSON.stringify(v[2])}] references undefined path.`)
      }
      let value: Internal | undefined = v[0]
      let reference: string = v[1]

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
