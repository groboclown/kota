
import * as loc from '../localization'
import { HasErrorValue, coreError, hasErrorValue } from '../../error'
import { LocalizedText, FormatVariable } from './format'
import * as registry from './registry'
import { Context, isNameListInternal, VALUE_NAME_LIST_ITEM, getNameListValue } from '../../context'
import { CURRENT_FUNCTION_ARGUMENT_0_PATH } from '../../core-paths'

export const NAME_LIST_FORMAT = 'name'

/**
 * Fetches the name out of the name list.  The template is the grammar.
 * TODO how to join this with the plural formatter?  In the end, they do the same thing.
 */
export class FormatNameList implements FormatVariable {
  readonly formatName = NAME_LIST_FORMAT

  format(args: Context, template: string, l10n: loc.Localization): LocalizedText | HasErrorValue {
    console.log(`DEBUG ** calling into format-name-list`)
    const valueInternal = args.getInternal(CURRENT_FUNCTION_ARGUMENT_0_PATH)
    if (!valueInternal) {
      // console.log(`DEBUG: ** arg 0 not exist`)
      return { error: coreError('no argument for template', { name: NAME_LIST_FORMAT }) }
    }
    if (!isNameListInternal(valueInternal)) {
      // console.log(`DEBUG: ** arg 0 not a name-list`)
      return { error: coreError('unexpected value type', { value: valueInternal.type, type: VALUE_NAME_LIST_ITEM }) }
    }
    const nameEntry = getNameListValue(valueInternal, args)
    if (hasErrorValue(nameEntry)) {
      // console.log(`DEBUG: ** get name list value parse failed: ${nameEntry.error.msgid}`)
      return nameEntry
    }
    // console.log(`DEBUG: ** fetching ${nameEntry.domain}@${nameEntry.msgid}@${nameEntry.listIndex} with [${template}]`)
    const localized = l10n.getText(nameEntry.domain, nameEntry.msgid, nameEntry.listIndex, template)
    // console.log(`DEBUG ${NAME_LIST_FORMAT}:${nameEntry.domain}@${nameEntry.msgid}@${nameEntry.listIndex} => "${localized}"`)
    if (localized === null) {
      // No translation is not an error; it is a limit to the current translated text.
      // However, clearly mark that it isn't translated.
      return { text: `??<${nameEntry.domain}:${nameEntry.msgid}>??` }
    }

    return { text: localized }
  }
}

registry.registerDataFormat(new FormatNameList())

// Declared as a common export, just so that it's something that can mark that the registry was loaded.
export const NAME_LIST_FORMAT_LOADED = true
