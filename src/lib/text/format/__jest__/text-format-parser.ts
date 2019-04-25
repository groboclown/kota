import { HasErrorValue, hasErrorValue, ErrorValue } from '../../../error'
import * as tx from '../text-format-parser'

describe('parseTextFormat', () => {
  describe('called with blank format', () => {
    it('returns an empty string', () => {
      const res = tx.parseTextFormat('')
      expect(hasErrorValue(res)).toBe(false)
      if (hasErrorValue(res)) {
        return
      }
      expect(res).toHaveLength(0)
    })
  })
  describe('called with plain text', () => {
    [
      'my text format',
      'more \\ text',
      'an \\{ escaped \\} value',
    ].forEach(template => describe(template, () => {
      it('returns a single text node', () => {
        const res = tx.parseTextFormat(template)
        expect(hasErrorValue(res)).toBe(false)
        if (hasErrorValue(res)) {
          return
        }
        expect(res).toHaveLength(1)
        const res0 = res[0]
        expect(tx.isTextFormatPlain(res0)).toBe(true)
        if (!tx.isTextFormatPlain(res0)) {
          return
        }
        expect(res0.text).toBe(template.replace(/\\/g, ''))
      })
    }))
    // Moved into its own, because it's easier.
    describe('an escaped backslash', () => {
      it('returns a single text node', () => {
        const res = tx.parseTextFormat('a\\\\b')
        expect(hasErrorValue(res)).toBe(false)
        if (hasErrorValue(res)) {
          return
        }
        expect(res).toHaveLength(1)
        const res0 = res[0]
        expect(tx.isTextFormatPlain(res0)).toBe(true)
        if (!tx.isTextFormatPlain(res0)) {
          return
        }
        expect(res0.text).toBe('a\\b')
      })
    })
  })
  describe('called with a half template', () => {
    [
      '{',
      'a {',
      'a {x:',
      'a {x:b',
    ].forEach(template => describe(template, () => {
      it('returns an error', () => {
        const res = tx.parseTextFormat(template)
        expect(hasErrorValue(res)).toBe(true)
        if (hasErrorValue(res)) {
          expect(res.error.msgid).toBe('bad format missing }')
          expect(res.error.params['format']).toBe(template)
        }
      })
    }))
  })
  describe('called with a invalid template', () => {
    [
      '{x:b;a',
    ].forEach(template => describe(template, () => {
      it('returns an error', () => {
        const res = tx.parseTextFormat(template)
        expect(hasErrorValue(res)).toBe(true)
        if (hasErrorValue(res)) {
          expect(res.error.msgid).toBe('bad format missing }')
          expect(res.error.params['format']).toBe(template)
        }
      })
    }))
  })
  describe('called with a trailing character', () => {
    [
      '}',
      'a }',
      'a } x:',
      'a } x:b',
      '}x:b;',
    ].forEach(template => describe(template, () => {
      it('returns an error', () => {
        const res = tx.parseTextFormat(template)
        expect(hasErrorValue(res)).toBe(true)
        if (hasErrorValue(res)) {
          expect(res.error.msgid).toBe('template danging }')
          expect(res.error.params['format']).toBe(template)
        }
      })
    }))
  })
  describe('called with a single replacement, no template, no surrounding text', () => {
    [
      ['marker', 'the value'],
    ].forEach(replacement => {
      const template = '{' + `${replacement[0]}:${replacement[1]}` + '}'
      describe(template, () => {
        it('returns a single template', () => {
          const res = tx.parseTextFormat(template)

          expect(hasErrorValue(res)).toBe(false)
          if (hasErrorValue(res)) {
            return
          }
          expect(res).toHaveLength(1)
          const res0 = res[0]
          expect(tx.isTextFormatReplace(res0)).toBe(true)
          if (!tx.isTextFormatReplace(res0)) {
            return
          }
          expect(res0.formatTypeMarker).toBe(replacement[0])
          expect(res0.valueKeyNames).toEqual({
            '0': replacement[1],
            value: replacement[1]
          })
          expect(res0.template).toHaveLength(0)
        })
      })
    })
  })
  describe('called with a single replacement and template, and no surrounding text', () => {
    [
      ['marker', 'the value', 'the template'],
    ].forEach(replacement => {
      const template = '{' + `${replacement[0]}:${replacement[1]};${replacement[2]}` + '}'
      describe(template, () => {
        it('returns a single template', () => {
          const res = tx.parseTextFormat(template)
          // console.log(`<<${template}>> returned ${JSON.stringify(res)}`)
          expect(hasErrorValue(res)).toBe(false)
          if (hasErrorValue(res)) {
            return
          }
          expect(res).toHaveLength(1)
          const res0 = res[0]
          expect(tx.isTextFormatReplace(res0)).toBe(true)
          if (!tx.isTextFormatReplace(res0)) {
            return
          }
          expect(res0.formatTypeMarker).toBe(replacement[0])
          expect(res0.valueKeyNames).toEqual({
            '0': replacement[1],
            value: replacement[1]
          })
          expect(res0.template).toHaveLength(1)
          expect(res0.template).toContainEqual({ text: replacement[2] })
        })
      })
    })
    describe('called with surrounding text', () => {
      it('as "abc {a:x;} def"', () => {
        const res = tx.parseTextFormat('abc {a:x;} def')
        expect(hasErrorValue(res)).toBe(false)
        if (hasErrorValue(res)) {
          return
        }
        expect(res).toHaveLength(3)
        expect(res[0]).toEqual({ text: 'abc ' })
        expect(res[2]).toEqual({ text: ' def' })
        expect(res[1]).toEqual({
          formatTypeMarker: 'a',
          template: [],
          valueKeyNames: { '0': 'x', value: 'x' }
        })
      })
    })
    describe('called with multiple arguments', () => {
      it('as "{a:x,y}"', () => {
        const res = tx.parseTextFormat('{a:x,y}')
        expect(hasErrorValue(res)).toBe(false)
        if (hasErrorValue(res)) {
          return
        }
        expect(res).toHaveLength(1)
        expect(res[0]).toEqual({
          formatTypeMarker: 'a',
          template: [],
          valueKeyNames: {
            '0': 'x',
            '1': 'y'
          }
        })
      })
    })
    describe('called with multiple named arguments', () => {
      it('as "{a:wbc=x,@def=y}"', () => {
        const res = tx.parseTextFormat('{a:wbc=x,@def=y}')
        expect(hasErrorValue(res)).toBe(false)
        if (hasErrorValue(res)) {
          return
        }
        expect(res).toHaveLength(1)
        expect(res[0]).toEqual({
          formatTypeMarker: 'a',
          template: [],
          valueKeyNames: {
            '0': 'x',
            '1': 'y',
            'wbc': 'x',
            '@def': 'y'
          }
        })
      })
    })
    describe('called with mixed named arguments', () => {
      it('as "{a:x,@def=y}"', () => {
        const res = tx.parseTextFormat('{a:x,@def=y}')
        expect(hasErrorValue(res)).toBe(false)
        if (hasErrorValue(res)) {
          return
        }
        expect(res).toHaveLength(1)
        expect(res[0]).toEqual({
          formatTypeMarker: 'a',
          template: [],
          valueKeyNames: {
            '0': 'x',
            '1': 'y',
            '@def': 'y'
          }
        })
      })
    })
    describe('called with weird blocks', () => {
      it('as "{:;}x"', () => {
        // Found through fuzz testing.  Hurray for fuzz testing!
        const res = tx.parseTextFormat('{:;}x')
        expect(hasErrorValue(res)).toBe(true)
        if (hasErrorValue(res)) {
          expect(res.error).toEqual(<ErrorValue>{
            domain: '/modules/core/system-text/errors', msgid: 'bad format no format name', params: {
              format: '{:;}x'
            }
          })
        }
      })
      it('as "{x:y}{"', () => {
        const res = tx.parseTextFormat('{x:y}{')
        expect(hasErrorValue(res)).toBe(true)
        if (hasErrorValue(res)) {
          expect(res.error).toEqual(<ErrorValue>{
            domain: '/modules/core/system-text/errors', msgid: 'bad format missing }', params: {
              format: '{x:y}{'
            }
          })
        }
      })
    })
  })


  /**
   * Perform fuzz testing, to ensure odd, unexpected characters don't
   * introduce exceptions.
   */
  describe('fuzz', () => {
    function rng(min: number, max: number): number {
      return Math.floor(Math.random() * (max - min)) + min
    }
    const loopCount = 100
    const maxTextLength = 10000
    var totCharCount = 0
    var totCheckTime = 0
    for (var i = 0; i < loopCount; i++) {
      const len = rng(1, maxTextLength)
      totCharCount += len
      it(`iteration ${i}`, () => {
        var s = ''
        for (var j = 0; j < len; j++) {
          switch (rng(0, 14)) {
            case 0:
            case 1:
            case 2:
              s += '{'
              break
            case 3:
            case 4:
            case 5:
              s += '}'
              break
            case 6:
              s += String.fromCharCode(0, 32)
              break
            case 7:
              s += String.fromCharCode(128, 0x7fffff)
              break
            case 8:
              s += ':'
              break
            case 9:
              s += ','
              break
            case 10:
              s += ';'
              break
            case 11:
              s += '>'
              break
            default:
              s += String.fromCharCode(32, 127)
              break
          }
          //console.log(`DEBUG running parse`)
          const start = new Date()
          try {
            tx.parseTextFormat(s)
            // console.log(`DEBUG completed parse`)
          } catch (e) {
            console.log(`Caught exception for:\n<<${s}>>`)
            throw e
          }
          const end = new Date()
          const tots = new Date(end.getTime() - start.getTime())
          totCheckTime += tots.getTime()
          if (i === loopCount - 1) {
            console.log(`Total time taken for ${loopCount} iterations, ${totCharCount} characters parsed: ${totCheckTime} millis`)
          }
        }
      })
    }
  })
})


describe('isTextFormatPlain', () => {
  it('yes', () => {
    expect(tx.isTextFormatPlain({ text: '' })).toBe(true)
  })
  it('no', () => {
    expect(tx.isTextFormatPlain(
      { formatTypeMarker: 'x', valueKeyNames: { '0': 'y' }, template: [] })
    ).toBe(false)
  })
})

describe('isTextFormatReplace', () => {
  it('yes', () => {
    expect(tx.isTextFormatReplace(
      { formatTypeMarker: 'x', valueKeyNames: { '0': 'y' }, template: [] })
    ).toBe(true)
  })
  it('no', () => {
    expect(tx.isTextFormatReplace({ text: '' })).toBe(false)
  })
})
