
import * as loc from '../localization'
import { HasErrorValue, coreError, hasErrorValue } from '../../error'
import { LocalizedText, FormatVariable, getContextValuesFor } from './format'
import * as registry from './registry'
import { CONTEXT_FORMAT } from './context-format'
import {
  Context,
  getNameListValue,
  isNameListInternal,
  VALUE_NAME_LIST_ITEM,

  // getGroupSetValue,
  // isGroupSetInternal,

  isLocalizedMessageInternal,
  CONSTANT_LOCALIZED,
} from '../../context'
import { CURRENT_FUNCTION_ARGUMENT_0_PATH, CURRENT_FUNCTION_ARGUMENTS_PATH } from '../../core-paths'
import { isNameListAttribute, joinPaths, isConstantNumberInternal, isNumberInternal, isCalculatedInternal, getNumericValueForInternal } from 'model/intern';

// "t" for "text"
export const LOCALIZE_FORMAT = 't'


/**
 * Generic text lookup.  It knows how to work with name-lists and localizations.
 *
 * Unlike other formatters, this one is concerned with the formatting of the message described
 * in the first argument.  All the arguments are used as-is for input to formatting the
 * string at that location.  Any argument named '@count' will be used as the count argument
 * to the localization formatting.  The template value is the grammar input.
 */
export class FormatLocalize implements FormatVariable {
  readonly formatName = LOCALIZE_FORMAT

  format(args: Context, template: string, l10n: loc.Localization): LocalizedText | HasErrorValue {
    const i18nLookup = args.getInternal(CURRENT_FUNCTION_ARGUMENT_0_PATH)
    if (!i18nLookup) {
      return { error: coreError('no argument for template', { name: LOCALIZE_FORMAT }) }
    }
    let domain: string | null = null
    let msgid: string | null = null
    let grammar: string = template
    let count: number | undefined = undefined
    if (isLocalizedMessageInternal(i18nLookup)) {
      domain = i18nLookup.domain
      msgid = i18nLookup.msgid
    } else if (isNameListInternal(i18nLookup)) {
      const nameEntry = getNameListValue(i18nLookup, args)
      if (hasErrorValue(nameEntry)) {
        return nameEntry
      }
      domain = nameEntry.domain
      msgid = nameEntry.msgid
      count = nameEntry.listIndex
    } else if (isNameListAttribute(i18nLookup)) {
      domain = i18nLookup.domain
      msgid = i18nLookup.msgid
    } else {
      return { error: coreError('unexpected value type', { type: CONSTANT_LOCALIZED + ',' + VALUE_NAME_LIST_ITEM }) }
    }

    // Note: this overrides name-list value's count.
    const countVal = args.getInternal(joinPaths(CURRENT_FUNCTION_ARGUMENTS_PATH, '@count'))
    if (countVal) {
      const cv = getNumericValueForInternal(countVal, args)
      if (hasErrorValue(cv)) {
        return cv
      }
      count = cv
    }

    // Group sets are handled in the pointer references, not here.

    const localized = l10n.getText(domain, msgid, count, grammar)
    if (localized === null) {
      // No translation is not an error; it is a limit to the current translated text.
      // However, clearly mark that it isn't translated.
      return { text: `??<${domain}:${msgid}>??` }
    }

    // Now we need to format the localized string.
    const textFormat = registry.getDataFormatFor(CONTEXT_FORMAT)
    if (textFormat === undefined) {
      // Internal error - throw an exception.
      throw new Error(`Invalid state: no format registered for ${CONTEXT_FORMAT}`)
    }
    return textFormat.format(args, localized, l10n)
  }
}

registry.registerDataFormat(new FormatLocalize())

// Declared as a common export, just so that it's something that can mark that the registry was loaded.
export const LOCALIZE_FORMAT_LOADED = true
