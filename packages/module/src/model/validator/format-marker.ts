import { ErrorValue, coreError } from '@kota/base-libs'

export const CONTEXT_FORMAT_MARKER = 'x'
export const NUMBER_FORMAT_MARKER = 'c'
export const DATE_FORMAT_MARKER = 'd'
export const TEXT_FORMAT_MARKER = 't'
export const LOCALIZED_REFERENCE_FORMAT_MARKER = 'l'

const NON_CONTEXT_MARKERS =
  NUMBER_FORMAT_MARKER + DATE_FORMAT_MARKER + TEXT_FORMAT_MARKER + LOCALIZED_REFERENCE_FORMAT_MARKER
const CONTEXT_MARKERS =
  CONTEXT_FORMAT_MARKER
const ALL_MARKERS =
  NON_CONTEXT_MARKERS + CONTEXT_FORMAT_MARKER


/**
 * In order to prevent certain classes of runtime errors,
 * the schema defines only a limited set of recognized
 * format markers.  On top of that, only a select few are
 * considered "context" style markers, meaning that they
 * can contain other variable formats within them (a
 * recursive structure).
 */
export function isContextFormatMarker(marker: string): boolean {
  return isFormatMarkerClass(marker, CONTEXT_MARKERS)
}

/**
 * In order to prevent certain classes of runtime errors,
 * the schema defines only a limited set of recognized
 * format markers.
 * 
 * @param marker 
 */
export function isFlatFormatMarker(marker: string): boolean {
  return isFormatMarkerClass(marker, NON_CONTEXT_MARKERS)
}

export function checkFormatMarker(marker: string): ErrorValue | null {
  if (isFormatMarkerClass(marker, ALL_MARKERS)) {
    return null
  }
  return coreError('unknown format marker', { marker })
}

function isFormatMarkerClass(marker: string, classList: string): boolean {
  return marker.length === 1 && classList.indexOf(marker) >= 0
}
