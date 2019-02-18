
import { LocalizedText, FormatVariable } from './format'
import { FormatDate } from './date-format'
import { FormatPlural } from './plural-format'
import { FormatNumber } from './number-format'
import { HasErrorValue, coreError, hasErrorValue } from '../../error'
import * as loc from '../localization'

const DATA_FORMATS: { [key: string]: FormatVariable } = {}

export function registerDataFormat(format: FormatVariable, ...additionalNames: string[]): void {
  DATA_FORMATS[format.formatName] = format
  if (additionalNames) {
    additionalNames.forEach(n => { DATA_FORMATS[n] = format })
  }
}

export function getDataFormatFor(formatTypeMarker: string): FormatVariable | undefined {
  return DATA_FORMATS[formatTypeMarker]
}
