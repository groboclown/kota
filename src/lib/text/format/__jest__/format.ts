import * as format from '../format'
import { Context, Internal, NumberInternal, ContextReference } from '../../../context'
import { CURRENT_FUNCTION_ARGUMENT_0_PATH } from '../../../core-paths'
import {
  StorageContext
} from '../../../../model/intern'

describe('format', () => {
  describe('lookup', () => {
    describe('With a context reference', () => {
      it('With an exact path', () => {
        const expectedValue = new NumberInternal('/p', 1)
        const ctx = new StorageContext({
          '/1/2/3': expectedValue,
          '/a/b/c': new ContextReference('/1/2/3')
        })
        const [value, path] = format.lookup(ctx, '/a/b/c', [])
        expect(path).toBe('/1/2/3')
        expect(value).toBe(expectedValue)
      })
      it('With an prefix path', () => {
        const expectedValue = new NumberInternal('/p', 1)
        const ctx = new StorageContext({
          '/1/2/3': expectedValue,
          '/a/b/c': new ContextReference('/1/2')
        })
        const [value, path] = format.lookup(ctx, '/a/b/c/3', [])
        expect(path).toBe('/1/2/3')
        expect(value).toBe(expectedValue)
      })
    })
  })
})
