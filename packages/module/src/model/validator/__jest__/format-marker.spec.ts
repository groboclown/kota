
import { coreError } from '@kota/base-libs'
import { checkFormatMarker, isFlatFormatMarker } from '../format-marker'

describe('format-marker', () => {
  describe('checkFormatMarker', () => {
    it('is a', () => {
      expect(checkFormatMarker('x')).toBeNull()
    })
    it('not a', () => {
      expect(checkFormatMarker('xdl')).toEqual(coreError('unknown format marker', { marker: 'xdl' }))
    })
  })
  describe('isFlatFormatMarker', () => {
    it('is a', () => {
      expect(isFlatFormatMarker('d')).toBe(true)
    })
    it('not a', () => {
      expect(isFlatFormatMarker('dl')).toBe(false)
    })
  })
})
