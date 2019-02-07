
export { LocalizedText, FormatVariable } from './format'
export { getDataFormatFor } from './registry'

import { LocalizedText } from './format'
import { CONTEXT_FORMAT } from './context-format'
import { getDataFormatFor } from './registry'
import { HasErrorValue } from '../../error'
import { Context } from '../../context'
import { Localization } from '.././localization'

// Ensure all the types are loaded.  The files will load themselves into the registry
export { DATE_FORMAT_LOADED } from './date-format'
export { CONTEXT_FORMAT_LOADED } from './context-format'
export { LOCALIZED_FORMAT_LOADED } from './localized-format'
export { NUMBER_FORMAT_LOADED } from './number-format'
export { PLURAL_FORMAT_LOADED } from './plural-format'

export type TextContextFormatter =
    (context: Context, formatText: string, l10n: Localization) => (LocalizedText | HasErrorValue)

/**
 * Retrieve the standard formatter for text strings.
 */
export function getTextContextFormatter(): TextContextFormatter {
    const ret = getDataFormatFor(CONTEXT_FORMAT)
    if (ret === undefined) {
        throw new Error(`Invalid setup: no registration for  ${CONTEXT_FORMAT}`)
    }
    return (context: Context, formatText: string, l10n: Localization): (LocalizedText | HasErrorValue) => {
        return ret.format(context, formatText, l10n)
    }
}
