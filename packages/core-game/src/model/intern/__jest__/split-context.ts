

import { StorageContext } from '../storage-context'
import { SplitContext } from '../split-context'
import * as tobj from '../type-objects'
import * as tn from '../type-names'

describe('StorageContext', () => {
  const ctx = new SplitContext({
    '/x/': new StorageContext({
      '/a': new tobj.NumberInternal('/q', 1),
    }),
    '/y/': new StorageContext({
      '/a': new tobj.NumberInternal('/q', 2),
      '/b': new tobj.NumberInternal('/q', 3),

      // Note: no leading slash
      'c': new tobj.NumberInternal('/q', 4),
    }),

    // Note: no leading slash
    '/z': new StorageContext({
      '/a': new tobj.NumberInternal('', 1)
    }),
  })
  describe('Given no default', () => {
    it('then requests for slashed paths returns correct value', () => {
      const res1 = ctx.getInternal('/x/a')
      expect(res1).not.toBeUndefined()
      if (res1 === undefined) {
        return
      }
      expect(res1.type).toBe(tn.VALUE_NUMBER)
      if (tobj.isNumberInternal(res1)) {
        expect(res1.value).toBe(1)
      }
      const res2 = ctx.getInternal('/y/a')
      expect(res2).not.toBeUndefined()
      if (res2 === undefined) {
        return
      }
      expect(res2.type).toBe(tn.VALUE_NUMBER)
      if (tobj.isNumberInternal(res2)) {
        expect(res2.value).toBe(2)
      }
    })
    it('then requests for non-slashed storage does not return anything', () => {
      const res = ctx.getInternal("/y/c")
      expect(res).toBeUndefined()
    })
    it('then non-trailing slash keys are not used', () => {
      const res = ctx.getInternal('/z/a')
      expect(res).toBeUndefined()
    })
  })
})
