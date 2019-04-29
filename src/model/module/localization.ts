
import { ParsedError, ParsedInfo, ParseSrcKey, createParsedInfo } from './parse-info'
import { ConstraintSet, ConstraintTypeCheckFunction } from './parse-contraints'

export const LOCALIZATION_TYPE_NAME = 'localization'

export const LocalizationTypeConstraint: ConstraintSet = new ConstraintSet('localization')
  .canHave('parent', 'string', ac => ac.isAString())
  .mustHave('locale', 'string', ac => ac.isAString())
  .canHave('alternates', 'string[]', ac => ac.isAnArrayOfStrings())
  .canHave('number', 'LocalizationNumberType', ac => ac.contains(csf => csf
    .mustHave('decimal', 'string', ac => ac.isAString())
    .mustHave('grouping', 'string', ac => ac.isAString())
    .mustHave('grouping-count', 'number[]', ac => ac.isAnArrayOfNumbers())
    .mustHave('negative', 'string', ac => ac.isAString())
    .mustHave('positive', 'string', ac => ac.isAString())
    .mustHave('digitsUpper', 'string', ac => ac
      .isAString()
      .has('string with 16 characters', src => (<any>src).digitsUpper && (<any>src).digitsUpper.length === 16))
    .mustHave('digitsLower', 'string', ac => ac
      .isAString()
      .has('string with 16 characters', src => (<any>src).digitsLower && (<any>src).digitsLower.length === 16))
  ))
  .canHave('date-markers', 'LocalizationDateMarkerType[]', ac => ac
    .isAnArrayWith('LocalizationDateMarkerType', csf => csf
      .mustHave('marker', 'string', ac => ac
        .isAString()
        .has('one character long', v => v && (<string>v).length === 1))
      .mustHave('from', 'string', ac => ac
        .isInStringSet(['day', 'month', 'year', 'yr', 'week']))
      .matchesOneOf({
        'map': csf => csf
          .has('one character keys', v => {
            return Object.keys(v).reduce<boolean>((prevValue, key) =>
              prevValue && !!key && key.length === 1,
              true)
          }),
        'direct-map': csf => csf
          .mustHave('direct-map', 'true', acf => acf
            .isA('true value', <ConstraintTypeCheckFunction<any>>(v => (<any>v) === true))),
      })
    ))

export const parseSrcAttribute: ParseSrcKey<LocalizationType> = (src: any): ParsedInfo<LocalizationType> => {
  const errors: ParsedError[] = []
  LocalizationTypeConstraint.runVerify(src, errors)
  return createParsedInfo(src, errors, LOCALIZATION_TYPE_NAME)
}

export interface LocalizationType {
  parent?: string | null
  locale: string
  alternates?: string[]

  // These define the localization for numbers and dates, but are not necessary
  // if the parent or alternates define them.
  number?: LocalizationNumberType
  'date-markers'?: LocalizationDateMarkerType[]
}

export interface LocalizationNumberType {
  decimal: string
  grouping: string
  'grouping-count': number[]
  negative: string
  positive: string
  digitsUpper: string
  digitsLower: string

  // per mille?
  // percent?
}

export interface LocalizationDateMarkerBaseType {
  marker: string
  from: 'day' | 'month' | 'year' | 'yr' | 'week'
}

export interface LocalizationDateMarkerDirectMappingType extends LocalizationDateMarkerBaseType {
  'direct-map': true
}

export interface LocalizationDateMarkerMappingType extends LocalizationDateMarkerBaseType {
  mapping: { [key: number]: string }
}

export type LocalizationDateMarkerType = LocalizationDateMarkerDirectMappingType | LocalizationDateMarkerMappingType

function isLocalizationDateMarkerBaseType(v: any): v is LocalizationDateMarkerBaseType {
  return typeof v.marker === 'string' && typeof v.from === 'string'
}

export function isLocalizationDateMarkerDirectMappingType(v: any): v is LocalizationDateMarkerDirectMappingType {
  return v['direct-map'] === true
    && isLocalizationDateMarkerBaseType(v)
}

export function isLocalizationDateMarkerMappingType(v: any): v is LocalizationDateMarkerMappingType {
  return typeof v.mapping === 'object'
    && isLocalizationDateMarkerBaseType(v)
}
