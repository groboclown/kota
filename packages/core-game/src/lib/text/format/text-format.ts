
import * as loc from '../localization'
import { HasErrorValue, coreError, hasErrorValue } from '../../error'
import { FormatVariable, LocalizedText } from './format'
import * as registry from './registry'
import { CONTEXT_FORMAT } from './context-format'
import { Context, getNumericValueForInternal } from '../../context'
import { StackContext, Internal, joinPaths, NumberInternal, PointerContext, PATH_SEPARATOR } from '../../../model/intern';
import { CURRENT_FUNCTION_ARGUMENT_0_PATH, CURRENT_FUNCTION_ARGUMENTS_PATH } from '../../core-paths'

// "t" for text
export const TEXT_FORMAT = 't'

/**
 * Uses the arguments to format the localized text, referenced in the template.
 * Any argument named '@count' will be used as the count argument
 * to the localization formatting.
 *
 * The template must be in the format "domain:msgid[:grammar]", with the optional
 * grammar section.
 */
export class FormatText implements FormatVariable {
  readonly formatName = TEXT_FORMAT

  format(args: Context, template: string, l10n: loc.Localization): LocalizedText | HasErrorValue {
    // Parse out the domain, message id, grammar, and number format.
    const tfp = template.indexOf(':')
    if (tfp <= 0) {
      return { error: coreError('no domain in text format', { format: template }) }
    }
    const domain = template.substring(0, tfp)
    const grp = template.indexOf(':', tfp + 1)
    const msgid = (grp > 0) ? template.substring(tfp + 1, grp) : template.substring(tfp + 1)
    const grammar = (grp > 0) ? template.substring(grp + 1) : undefined
    let count: number | undefined = undefined

    const countVal = args.getInternal(joinPaths(CURRENT_FUNCTION_ARGUMENTS_PATH, '@count'))
    if (countVal) {
      const cv = getNumericValueForInternal(countVal, args)
      if (hasErrorValue(cv)) {
        return cv
      }
      count = cv
    }

    // Need the count here for the correct plural string.
    const val = l10n.getText(domain, msgid, count, grammar)
    if (val === null) {
      // No translation is not an error; it is a limit to the current translated text.
      // However, clearly mark that it isn't translated.
      return {
        text: `??<${template}>??`
      }
    }

    // Use the normal context formatter to format the arguments
    const textFormat = registry.getDataFormatFor(CONTEXT_FORMAT)
    if (textFormat === undefined) {
      // Internal error - throw an exception.
      throw new Error(`Invalid state: no format registered for ${CONTEXT_FORMAT}`)
    }
    return textFormat.format(args, val, l10n)
  }
}

registry.registerDataFormat(new FormatText())

// Declared as a common export, just so that it's something that can mark that the registry was loaded.
export const TEXT_FORMAT_LOADED = true
