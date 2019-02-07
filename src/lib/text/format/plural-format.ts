
import * as loc from '../localization'
import { HasErrorValue, coreError } from '../../error'
import { FormatVariable, LocalizedText } from './format'
import * as registry from './registry'
import { CONTEXT_FORMAT } from './context-format'
import { Context, VALUE_NUMBER } from '../../context'
import { StorageContext, Internal, joinPaths, NumberInternal } from '../../../model/intern';
import { CURRENT_FUNCTION_ARGUMENT_0_PATH, CURRENT_FUNCTION_ARGUMENTS_PATH } from '../../core-paths'


export const PLURAL_FORMAT = 'p'

/**
 * Fetches plurality translation text for a given count.  This is for
 * simple text, like 'a coin' vs. 'two coins' vs. '34 coins'.  The translated
 * text will be run through the simplified parser, where only the number format
 * is used.  The variable name in the number format is `count`.
 */
export class FormatPlural implements FormatVariable {
  readonly formatName = PLURAL_FORMAT

  format(args: Context, template: string, l10n: loc.Localization): LocalizedText | HasErrorValue {
    const count = args.get(CURRENT_FUNCTION_ARGUMENT_0_PATH, VALUE_NUMBER)
    if (typeof count !== 'number') {
      return { error: coreError('no argument for template', { name: PLURAL_FORMAT }) }
    }
    // Parse out the domain, message id, and number format.
    var tfp = template.indexOf(':')
    if (tfp <= 0) {
      return { error: coreError('no domain in plural format', { format: template }) }
    }
    const domain = template.substring(0, tfp)
    const msgid = template.substring(tfp + 1)
    const val = l10n.getText(domain, msgid, count)
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
    const countData: { [key: string]: Internal<any> } = {}
    countData[joinPaths(CURRENT_FUNCTION_ARGUMENTS_PATH, 'count')] = new NumberInternal(VALUE_NUMBER, count)
    const countContext = args.push(new StorageContext(countData)).createChild(CURRENT_FUNCTION_ARGUMENTS_PATH)
    return textFormat.format(countContext, val, l10n)
  }
}

registry.registerDataFormat(new FormatPlural())

// Declared as a common export, just so that it's something that can mark that the registry was loaded.
export const PLURAL_FORMAT_LOADED = true
