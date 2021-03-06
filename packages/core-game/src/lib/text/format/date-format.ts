
import * as loc from '../localization'
import { HasErrorValue, coreError } from '../../error'
import { LocalizedText, FormatVariable } from './format'
import { replacePercentText } from './replace-text'
import { Context, isDateInternal, VALUE_DATE, getDateValue } from '../../context'
import { CURRENT_FUNCTION_ARGUMENT_0_PATH } from '../../core-paths'
import * as registry from './registry'

export const DATE_FORMAT = 'date'

/**
 * Date format is the text custom format specific for use with the date
 * variable.  "%%" is the % escape character.
 */
export class FormatDate implements FormatVariable {
  readonly formatName = DATE_FORMAT

  format(args: Context, template: string, l10n: loc.Localization): LocalizedText | HasErrorValue {
    const dateIntern = args.getInternal(CURRENT_FUNCTION_ARGUMENT_0_PATH);
    if (dateIntern === undefined) {
      return { error: coreError('no argument for template', { name: DATE_FORMAT }) }
    }
    if (!isDateInternal(dateIntern)) {
      return { error: coreError('unexpected value type', { value: dateIntern.type, type: VALUE_DATE }) }
    }
    const date = getDateValue(dateIntern)

    const fromMap: { [key: string]: number } = {
      day: date.getDate(),
      month: date.getMonth(),
      year: date.getFullYear(),
      yr: date.getFullYear() % 100,
      week: date.getDay()
    }
    const keyValue: { [key: string]: string } = {}
    for (let dm of l10n.dateMarkers) {
      const key = fromMap[dm.from]
      if (key === undefined) {
        return { error: coreError('not valid date mapping', { from: dm.from }) }
      }
      keyValue[dm.marker] =
        (loc.isLocalizationDateMarkerMappingType(dm) && typeof dm.mapping[key] === 'string')
          ? dm.mapping[key] : String(key)
    }
    // Final bit for escaped '%'
    return { text: replacePercentText(template, keyValue) }
  }
}

registry.registerDataFormat(new FormatDate())

// Declared as a common export, just so that it's something that can mark that the registry was loaded.
export const DATE_FORMAT_LOADED = true
