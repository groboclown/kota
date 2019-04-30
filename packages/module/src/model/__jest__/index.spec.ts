
// This is itself a test - by passing this import line,
// it means all the generated schemas are valid.
import * as schema from '../schema'
import { ErrorValue } from '@kota/base-libs'

describe('module validator', () => {
  describe('with valid input', () => {
    describe('which is minimal', () => {
      it('has no errors and is valid', () => {
        const m: schema.Module = {
          id: 'abcd',
          name: 'abcde',
          description: 'what',
          version: [1],
        }
        const errors: ErrorValue[] = []
        schema.MODULE_VALIDATOR.validate('src file', m, errors)
        expect(errors).toHaveLength(0)
      })
    })
  })
})
