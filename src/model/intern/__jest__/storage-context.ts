
import * as sc from '../storage-context'
import * as tobj from '../type-objects'
import * as tn from '../type-names'

describe('StorageContext', () => {
  const ctx = new sc.StorageContext({
    '/y': new tobj.FuzzAttribute(),
    '/x': new tobj.FuzzInternal('/y', 1),
    // Invalid key - should not be accessible
    'x': new tobj.FuzzInternal('/y', 0.1)
  })
  describe('Given get with bad path', () => {
    describe('which is empty', () => {
      it('Then returns undefined', () => {
        expect(ctx.getInternal('')).toBeUndefined()
      })
    })
    describe('which exists but has no leading slash', () => {
      it('Then returns undefined', () => {
        // Value exists in the context, but has no leading slash
        expect(ctx.getInternal('x')).toBeUndefined()
      })
    })
    describe('which does not exist and has no leading slash', () => {
      it('Then returns undefined', () => {
        // Value exists in the context, but has no leading slash
        expect(ctx.getInternal('x')).toBeUndefined()
      })
    })
    describe('which does not exist', () => {
      it('Then returns undefined', () => {
        // Value exists in the context, but has no leading slash
        expect(ctx.getInternal('/a')).toBeUndefined()
      })
    })
  })
  describe('Given get with a good path', () => {
    it('Then returns that value', () => {
      const v = ctx.getInternal('/x')
      expect(v).toBeDefined()
      if (!v) { return }
      expect(v.type).toBe(tn.VALUE_FUZZ)
      expect(tobj.isFuzzInternal(v)).toBeTruthy()
      if (!tobj.isFuzzInternal(v)) { return }
      expect(v.value).toBe(1)
    })
  })
})
