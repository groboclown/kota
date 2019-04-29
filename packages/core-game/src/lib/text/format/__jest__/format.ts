import * as format from '../format'
import { Context, Internal, NumberInternal, ContextReference } from '../../../context'
import { CURRENT_FUNCTION_ARGUMENT_0_PATH } from '../../../core-paths'
import {
  StorageContext
} from '../../../../model/intern'

describe('format', () => {
  describe('getContextValuesFor', () => {
    describe('When arguments are empty', () => {
      it('returns the original context', () => {
        const src = new StorageContext({ '/a': new NumberInternal('/x', 1) })
        const res = format.getContextValuesFor(src, {})
        expect(src.keysFor('/')).toEqual(['/a'])
      })
    })

    // TODO add more
  })
})
