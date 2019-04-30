
import { CORE_ERROR_DOMAIN, hasErrorValue, coreError } from '../error'

describe('error', () => {
  describe('coreError', () => {
    describe('generates correct format', () => {
      it('for a string message', () => {
        const res = coreError('x')
        expect(res.domain).toBe(CORE_ERROR_DOMAIN)
        expect(res.msgid).toBe('x')
        expect(Object.keys(res.params)).toHaveLength(0)
        expect(res.stack).toBeUndefined()
      })
      it('for an exception', () => {
        const err = new Error('m')
        const res = coreError(err, { x: 'x' })
        expect(res.domain).toBe(CORE_ERROR_DOMAIN)
        expect(res.msgid).toBe('m')
        expect(res.params).toEqual({ x: 'x' })
        expect(res.stack).toEqual(err.stack)
      })
    })
  })

  describe('hasErrorValue', () => {
    describe('is valid', () => {
      it('for coreError string without params', () => {
        expect(hasErrorValue({ error: coreError('x') })).toBe(true)
      })
      it('for hand-built error with params', () => {
        expect(hasErrorValue({ error: { domain: 'a', msgid: 'b', params: {} } }))
      })
    })
    describe('is not valid', () => {
      it('for non-object', () => {
        expect(hasErrorValue(1)).toBe(false)
      })
      it('for null', () => {
        expect(hasErrorValue(null)).toBe(false)
      })
      it('for undefined', () => {
        expect(hasErrorValue(undefined)).toBe(false)
      })
      it('for object without error key', () => {
        expect(hasErrorValue({ x: 'x' })).toBe(false)
      })
      it('for object with non-object error key', () => {
        expect(hasErrorValue({ error: 1 })).toBe(false)
      })
      it('for object with null error key', () => {
        expect(hasErrorValue({ error: null })).toBe(false)
      })
      it('for object with undefined error key', () => {
        expect(hasErrorValue({ error: undefined })).toBe(false)
      })
      it('for object with empty error key', () => {
        expect(hasErrorValue({ error: {} })).toBe(false)
      })
    })
  })
})

