
import * as loc from '../localization'
import { HasErrorValue, coreError, hasErrorValue } from '../../error'
import { FormatVariable, LocalizedText } from './format'
import * as registry from './registry'
import { CONTEXT_FORMAT } from './context-format'
import { Context, getNumericValueForInternal } from '../../context'
import { StackContext, Internal, joinPaths, NumberInternal, PointerContext } from '../../../model/intern';
import { CURRENT_FUNCTION_ARGUMENT_0_PATH, CURRENT_FUNCTION_ARGUMENTS_PATH } from '../../core-paths'


export const PLURAL_FORMAT = 'p'

/**
 * Fetches plurality translation text for a given count.  This is for
 * simple text, like 'a coin' vs. 'two coins' vs. '34 coins'.  The translated
 * text will be run through the simplified parser, where only the number format
 * is used.  The variable name in the number format is `count`.
 *
 * If no argument is given, then this uses a '0' as the count.
 */
export class FormatPlural implements FormatVariable {
  readonly formatName = PLURAL_FORMAT

  format(args: Context, template: string, l10n: loc.Localization): LocalizedText | HasErrorValue {
    const countIntern = args.getInternal(CURRENT_FUNCTION_ARGUMENT_0_PATH);
    const count = countIntern ? getNumericValueForInternal(countIntern, args) : 0
    if (hasErrorValue(count)) {
      return { error: coreError('unexpected value type', { value: countIntern ? countIntern.type : '<none>', type: 'numeric' }) }
    }
    // Parse out the domain, message id, grammar, and number format.
    const tfp = template.indexOf(':')
    if (tfp <= 0) {
      return { error: coreError('no domain in plural format', { format: template }) }
    }
    const domain = template.substring(0, tfp)
    const grp = template.indexOf(':', tfp + 1)
    const msgid = (grp > 0) ? template.substring(tfp + 1, grp) : template.substring(tfp + 1)
    const grammar = (grp > 0) ? template.substring(grp + 1) : undefined

    // Need the count here for the correct plural string.
    const val = l10n.getText(domain, msgid, count, grammar)
    if (val === null) {
      // No translation is not an error; it is a limit to the current translated text.
      // However, clearly mark that it isn't translated.
      return {
        text: `??<${count}:${template}>??`
      }
    }

    const textFormat = registry.getDataFormatFor(CONTEXT_FORMAT)
    if (textFormat === undefined) {
      // Internal error - throw an exception.
      throw new Error(`Invalid state: no format registered for ${CONTEXT_FORMAT}`)
    }

    console.log(`Running format on ${val} with value ${count}`)

    // Redirect requests to 'count' instead to be the current arg 0.
    const countContext = new StackContext([
      new PointerContext(args)
        .addPointer(joinPaths(CURRENT_FUNCTION_ARGUMENTS_PATH, 'count'), CURRENT_FUNCTION_ARGUMENT_0_PATH),
      args
    ])
    return textFormat.format(countContext, val, l10n)
  }
}

registry.registerDataFormat(new FormatPlural())

// Declared as a common export, just so that it's something that can mark that the registry was loaded.
export const PLURAL_FORMAT_LOADED = true
