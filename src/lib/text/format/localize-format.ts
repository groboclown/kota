
import * as loc from '../localization'
import { HasErrorValue, coreError, hasErrorValue } from '../../error'
import { LocalizedText, FormatVariable } from './format'
import * as registry from './registry'
import { Context, isNameListInternal, VALUE_NAME_LIST_ITEM, getNameListValue } from '../../context'
import { CURRENT_FUNCTION_ARGUMENT_0_PATH } from '../../core-paths'

export const LOCALIZE_FORMAT = 't'

/**
 * Generic text lookup.  It knows how to work with name-lists, group sub-references,  counts
 */
export class FormatLocalize implements FormatVariable {
  readonly formatName = LOCALIZE_FORMAT

  format(args: Context, template: string, l10n: loc.Localization): LocalizedText | HasErrorValue {
    const valueInternal = args.getInternal(CURRENT_FUNCTION_ARGUMENT_0_PATH)
    if (!valueInternal) {
      return { error: coreError('no argument for template', { name: LOCALIZE_FORMAT }) }
    }
    if (!isNameListInternal(valueInternal)) {
      return { error: coreError('unexpected value type', { value: valueInternal.type, type: VALUE_NAME_LIST_ITEM }) }
    }
    const nameEntry = getNameListValue(valueInternal, args)
    if (hasErrorValue(nameEntry)) {
      return nameEntry
    }
    const localized = l10n.getText(nameEntry.domain, nameEntry.msgid, nameEntry.listIndex, template)
    if (localized === null) {
      // No translation is not an error; it is a limit to the current translated text.
      // However, clearly mark that it isn't translated.
      return { text: `??<${nameEntry.domain}:${nameEntry.msgid}>??` }
    }

    return { text: localized }
  }
}

registry.registerDataFormat(new FormatLocalize())

// Declared as a common export, just so that it's something that can mark that the registry was loaded.
export const LOCALIZE_FORMAT_LOADED = true
