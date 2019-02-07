
import * as ln from '../../model/module/localization'
export {
  LocalizationNumberType,
  LocalizationDateMarkerType,
  LocalizationDateMarkerMappingType,
  LocalizationDateMarkerDirectMappingType,
  isLocalizationDateMarkerDirectMappingType,
  isLocalizationDateMarkerMappingType,
} from '../../model/module/localization'

/**
 * A fully expressed localization structure.  This is parsed from the
 * module localization file, including all parent inheritance and resolving
 * from alternate files.
 */
export interface Localization {
  /** Return the raw text string, or null if not present. */
  getText(domain: string, msgid: string, count?: number): string | null

  /** find the resource path for the media item with the given base path.
   * This is useful for, say, finding translated fancy graphics with
   * embedded words, or for translated audio.
   */
  getMediaResourcePath(basePath: string): string

  number: ln.LocalizationNumberType

  dateMarkers: ln.LocalizationDateMarkerType[]
}

export interface CountTranslationLookup {
  [count: number]: string
  plural?: string
}

export interface SimpleTranslation {
  [msgid: string]: string | CountTranslationLookup
}
