
import * as loc from '../localization'
import { HasErrorValue, coreError } from '../../error'
import { LocalizedText, FormatVariable } from './format'
import { ATTRIBUTE_REFERENCE_DEFINITION } from '../../../model/intern'
import * as registry from './registry'
import { Context } from '../../context'
import { CURRENT_FUNCTION_ARGUMENT_0_PATH } from '../../core-paths'

export const LOCALIZED_FORMAT = 'z'

/**
 * Fetches the value as the key into the localization tree.  The
 * template can act as the default domain, in case the value only
 * specifies the message ID.
 */
export class FormatLocalized implements FormatVariable {
  readonly formatName = LOCALIZED_FORMAT

  format(args: Context, template: string, l10n: loc.Localization): LocalizedText | HasErrorValue {
    const value: string | undefined = args.get(CURRENT_FUNCTION_ARGUMENT_0_PATH, ATTRIBUTE_REFERENCE_DEFINITION)
    if (typeof value !== 'string') {
      return { error: coreError('no argument for template', { name: LOCALIZED_FORMAT }) }
    }
    // Parse out the domain, message id, and number format.
    var tfp = value.indexOf(':')
    var domain = template
    var msgid: string
    if (tfp <= 0) {
      if (domain.length <= 0) {
        return { error: coreError('no domain in localized format', { value: value, format: template }) }
      }
      msgid = value
    } else {
      domain = value.substring(0, tfp)
      msgid = value.substring(tfp + 1)
    }
    const val = l10n.getText(domain, msgid)
    if (val === null) {
      // No translation is not an error; it is a limit to the current translated text.
      // However, clearly mark that it isn't translated.
      return { text: `??<${value}:${template}>??` }
    }

    return { text: val }
  }
}

registry.registerDataFormat(new FormatLocalized())

// Declared as a common export, just so that it's something that can mark that the registry was loaded.
export const LOCALIZED_FORMAT_LOADED = true
