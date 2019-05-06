
import { coreError } from '@kota/base-libs'
import { checkValidRange } from '../range'

describe('range', () => {
  describe('checkValidRange', () => {
    it('valid', () => {
      expect(checkValidRange('x', 0, 1)).toBeNull()
    })
    it('equal', () => {
      expect(checkValidRange('x', 0, 0)).toEqual(coreError('invalid range', { key: 'x', min: 0, max: 0 }))
    })
    it('invalid', () => {
      expect(checkValidRange('y', 10, 0)).toEqual(coreError('invalid range', { key: 'y', min: 10, max: 0 }))
    })
  })
})

