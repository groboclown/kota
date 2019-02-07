
import { HasErrorValue } from '../../error'
import { Context, BaseContext, joinPaths, PATH_SEPARATOR } from '../../context'
import { CURRENT_FUNCTION_ARGUMENTS_PATH } from '../../core-paths'
import * as loc from '../localization'
import {
  PointerContext,
  SplitContext,
  ATTRIBUTE_DATA_TYPE
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
    args: Context,
    template: string,
    l10n: loc.Localization
  ): LocalizedText | HasErrorValue
}


export type ArgumentMapping = { [key: string]: string }


/**
 * Creates a context which maps all the `args` over to that space.
 *
 * @param baseContext
 * @param fv
 * @param args
 */
export function getContextValuesFor(baseContext: Context, fv: FormatVariable, args: ArgumentMapping): Context {
  let pointers = new PointerContext(baseContext)
  Object.keys(args).forEach(key => {
    if (key.length > 0) {
      let src = key
      if (PATH_SEPARATOR !== key[0]) {
        src = joinPaths(CURRENT_FUNCTION_ARGUMENTS_PATH, src)
      }
      pointers.addPointer(src, args[key])
    }
  })
  return baseContext.push(new SplitContext({
    CURRENT_FUNCTION_ARGUMENTS_PATH: pointers
  }))
}
