
import * as l10n from '../localization'

describe('simpleTranslationLookup', () => {
  describe('with no count or grammar', () => {
    describe('with existing msgid', () => {
      it('generates a non-null string', () => {
        const tlate: l10n.SimpleTranslation = { 'abc': 'def' }
        const res = l10n.simpleTranslationLookup('abc', undefined, undefined, tlate)
        expect(res).toBe('def')
      })
    })
    describe('with non-existant msgid', () => {
      it('generates a null string', () => {
        const tlate: l10n.SimpleTranslation = {}
        const res = l10n.simpleTranslationLookup('abc', undefined, undefined, tlate)
        expect(res).toBeNull()
      })
    })
    describe('with tlate count, no 1, and no plural, and existing msg', () => {
      it('generates null', () => {
        const tlate: l10n.SimpleTranslation = { 'abc': { 5: 'x' } }
        const res = l10n.simpleTranslationLookup('abc', undefined, undefined, tlate)
        expect(res).toBeNull()
      })
    })
    describe('with tlate count, no 1 but a plural, and existing msg', () => {
      it('generates null', () => {
        const tlate: l10n.SimpleTranslation = { 'abc': { plural: 'x' } }
        const res = l10n.simpleTranslationLookup('abc', undefined, undefined, tlate)
        expect(res).toBe('x')
      })
    })
    describe('with tlate count, no plural but a 1, and existing msg', () => {
      it('generates null', () => {
        const tlate: l10n.SimpleTranslation = { 'abc': { 1: 'x' } }
        const res = l10n.simpleTranslationLookup('abc', undefined, undefined, tlate)
        expect(res).toBe('x')
      })
    })
    describe('with tlate count, plural and a 1, and existing msg', () => {
      it('generates null', () => {
        // Plural has precidence over 1
        const tlate: l10n.SimpleTranslation = { 'abc': { 1: 'x', plural: 'y' } }
        const res = l10n.simpleTranslationLookup('abc', undefined, undefined, tlate)
        expect(res).toBe('y')
      })
    })
  })
  describe('with count but no grammar', () => {
    describe('with existing msgid', () => {
      it('generates a non-null string', () => {
        const tlate: l10n.SimpleTranslation = { 'abc': 'def' }
        const res = l10n.simpleTranslationLookup('abc', 2, undefined, tlate)
        expect(res).toBe('def')
      })
    })
    describe('with non-existant msgid', () => {
      it('generates a null string', () => {
        const tlate: l10n.SimpleTranslation = {}
        const res = l10n.simpleTranslationLookup('abc', 2, undefined, tlate)
        expect(res).toBeNull()
      })
    })
    describe('with tlate count, not-matching number, no 1, and no plural, and existing msg', () => {
      it('generates null', () => {
        const tlate: l10n.SimpleTranslation = { 'abc': { 5: 'x' } }
        const res = l10n.simpleTranslationLookup('abc', 2, undefined, tlate)
        expect(res).toBeNull()
      })
    })
    describe('with tlate count, not-matching number, no 1 but a plural, and existing msg', () => {
      it('generates null', () => {
        const tlate: l10n.SimpleTranslation = { 'abc': { plural: 'x' } }
        const res = l10n.simpleTranslationLookup('abc', 2, undefined, tlate)
        expect(res).toBe('x')
      })
    })
    describe('with tlate count, count of 1, no 1 but a plural, and existing msg', () => {
      it('generates null', () => {
        // Even with a value of 1, the plural is used, because there's no matching number
        // for the singular case.
        const tlate: l10n.SimpleTranslation = { 'abc': { plural: 'x' } }
        const res = l10n.simpleTranslationLookup('abc', 1, undefined, tlate)
        expect(res).toBe('x')
      })
    })
    describe('with tlate count, no plural but a 1, and existing msg', () => {
      it('generates null', () => {
        const tlate: l10n.SimpleTranslation = { 'abc': { 1: 'x' } }
        const res = l10n.simpleTranslationLookup('abc', undefined, undefined, tlate)
        expect(res).toBe('x')
      })
    })
    describe('with tlate count, plural and a 1, and existing msg', () => {
      it('generates null', () => {
        const tlate: l10n.SimpleTranslation = { 'abc': { 1: 'x', plural: 'y' } }
        const res = l10n.simpleTranslationLookup('abc', undefined, undefined, tlate)
        expect(res).toBe('y')
      })
    })
  })
  describe('with grammar', () => {
    describe('and with count', () => {
      describe('and matching precise', () => {
        it('generates exact match', () => {
          const tlate: l10n.SimpleTranslation = { 'abc:xyz': { 1: 'x', plural: 'y' } }
          const res = l10n.simpleTranslationLookup('abc', 1, 'xyz', tlate)
          expect(res).toBe('x')
        })
      })
      describe('and matching close grammar', () => {
        it('generates exact match', () => {
          const tlate: l10n.SimpleTranslation = { 'abc:x': { 1: 'x', plural: 'y' } }
          const res = l10n.simpleTranslationLookup('abc', 1, 'xyz', tlate)
          expect(res).toBe('x')
        })
      })
      describe('and no matching grammar', () => {
        it('generates exact match', () => {
          const tlate: l10n.SimpleTranslation = { 'abc': { 1: 'x', plural: 'y' } }
          const res = l10n.simpleTranslationLookup('abc', 1, 'def', tlate)
          expect(res).toBe('x')
        })
      })

    })
  })
})
