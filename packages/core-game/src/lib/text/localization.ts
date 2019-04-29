
import * as ln from '../../model/module/localization'
import { isArray } from 'util';
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
  /**
   * Return the raw text string, or null if not present.
   *
   * The rules for looking up translated text based on the count (to indicate generally
   * singular or plural) and grammar (to indicate position in the sentance and conjugation)
   * are very dependent upon the localization style used.  However, in general the
   * process goes:
   *
   * 1. If grammar is not provided, use the msgid as-is and go to step 4.
   * 2. For the current string "g", check if the msgid "msgid:g" exists.  If so, use that as the new message id and go to step 4.
   * 3. Trim the last character off of "g" and go to 3.  If "g" is empty, go to step 4.
   * 4. Get the translated message for the msgid.  If it does not support count, then return it.
   * 5. If count is not provided, then return message's "plural", or "1", or null (in that order of existence).
   * 7. If the count is in the message, then return it.
   * 8. Return the message's plural or 1 or null (in that order of existance).
   *
   * @param grammar an optional string of grammar indication characters.  Each character should represent
   *  some gramatical form for the particular language, but it's up to the translation to decide on this.
   *  Ordering of the characters must not matter.
   *  In the translation file, the gramatical characters should be alphabetical.
   */
  getText(domain: string, msgid: string, count?: number, grammar?: string): string | null

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
  [msgid: string]: string | string[] | CountTranslationLookup
}


const SPLIT_ARRAY = new RegExp('')

/**
 * Grammar is intended to be really flexible.  The grammar string is trimmed down character by character
 * (back-to-front) to find matchers.
 *
 * @param msgid
 * @param grammar
 * @param tlate
 */
function lookupGrammar(msgid: string, grammar: string | undefined, tlate: SimpleTranslation): string | CountTranslationLookup | null {
  if (!grammar) {
    return tlate[msgid] || null
  }
  let g = grammar
  while (g.length > 0) {
    const t = tlate[`${msgid}:${g}`]
    if (t) {
      return t
    }
    g = g.substring(0, g.length - 1)
  }
  return tlate[msgid] || null
}

function lookupCount(xlated: string | CountTranslationLookup | string[] | null, count: number | undefined): string | null {
  if (xlated === null || typeof xlated === 'string') {
    return xlated
  }
  if (isArray(xlated)) {
    if (xlated.length <= 0) {
      return null
    }
    if (count === undefined) {
      return xlated[0]
    }
    return xlated[count % xlated.length]
  }
  if (count === undefined) {
    return xlated.plural || xlated[1] || null
  }
  const c = xlated[count]
  if (c) {
    return c
  }
  return xlated.plural || xlated[1] || null
}

export function simpleTranslationLookup(msgid: string, count: number | undefined, grammar: string | undefined, tlate: SimpleTranslation): string | null {
  return lookupCount(lookupGrammar(msgid, grammar, tlate), count)
}
