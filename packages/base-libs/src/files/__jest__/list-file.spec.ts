
// Ensure we're using the public API.
import { isListFileData, parseListFile } from '../index'
import { CORE_ERROR_DOMAIN, ErrorValue } from '../../error/error'

describe('list-file', () => {
  describe('isListFileData', () => {
    describe('checks out', () => {
      it('with an array of strings', () => {
        expect(isListFileData({ data: ['a', 'b'] })).toBe(true)
      })
      it('with an empty array', () => {
        expect(isListFileData({ data: [] })).toBe(true)
      })
    })
    describe('is not right', () => {
      it('with no data', () => {
        expect(isListFileData({ error: { domain: '', msgid: '', params: {} } })).toBe(false)
      })
      it('with data of not-strings', () => {
        expect(isListFileData(<any>{ data: [1] })).toBe(false)
      })
    })
  })

  describe('loadListFile', () => {
    it('empty', () => {
      const res: any = parseListFile('', true)
      expect(res.error).toBeUndefined()
      expect(res.data).toHaveLength(0)
    })
    it('Just comments and blanks', () => {
      const res: any = parseListFile('# Hey a comment\n\n\n\r\n\r   \n    \r  \n \r   # Another Comment\n \r \n', true)
      expect(res.error).toBeUndefined()
      expect(res.data).toHaveLength(0)
    })
    it('Single line without EOL', () => {
      const res: any = parseListFile('one line', true)
      expect(res.error).toBeUndefined()
      expect(res.data).toEqual(['one line'])
    })
    it('Single line with EOL', () => {
      const res: any = parseListFile('one line\n', true)
      expect(res.error).toBeUndefined()
      expect(res.data).toEqual(['one line'])
    })
    it('Two lines without trailing EOL', () => {
      const res: any = parseListFile('one\ntwo', true)
      expect(res.error).toBeUndefined()
      expect(res.data).toEqual(['one', 'two'])
    })
    it('Two lines with EOL', () => {
      const res: any = parseListFile('one\ntwo\n', true)
      expect(res.error).toBeUndefined()
      expect(res.data).toEqual(['one', 'two'])
    })
    it('Two lines with comments and blanks', () => {
      const res: any = parseListFile('# a comment\n\rone\n  \r# commant \n  two  \n \r', true)
      expect(res.error).toBeUndefined()
      expect(res.data).toEqual(['one', 'two'])
    })
    it('Simple escape codes', () => {
      const res: any = parseListFile('a\\\\u+1000 \\tu+1000 \\ru+1000 \\nu+1000 \\a \\b \\c \\\na\n', true)
      expect(res.error).toBeUndefined()
      expect(res.data).toEqual(['a\\u+1000 \tu+1000 \ru+1000 \nu+1000 a b c a'])
    })
    it('Line continuation', () => {
      const res: any = parseListFile('a b \\\n c d', true)
      expect(res.error).toBeUndefined()
      expect(res.data).toEqual(['a b  c d'])
    })

    it('Character codes - miss not strict', () => {
      const res: any = parseListFile('a\\u+\n\nb\\u+1x\n\nc\\u\n\n', false)
      expect(res.error).toBeUndefined()
      expect(res.data).toEqual(['au+\n', 'bu+1x', 'cu'])
    })
    it('Character codes - miss strict 1', () => {
      const res: any = parseListFile('a\\u+\n\nb\\u+1x\n\nc\\u\n\n', true)
      expect(res.data).toBeUndefined()
      expect(res.error).toEqual(<ErrorValue>{
        domain: CORE_ERROR_DOMAIN,
        msgid: 'list file hex code',
        params: { value: 'u+' }
      })
    })
    it('Character codes - miss strict 2', () => {
      const res: any = parseListFile('a\n\nb\\u+1x\n\nc\\u\n\n', true)
      expect(res.data).toBeUndefined()
      expect(res.error).toEqual(<ErrorValue>{
        domain: CORE_ERROR_DOMAIN,
        msgid: 'list file hex code',
        params: { value: 'u+1' }
      })
    })
    it('Character codes - miss strict 3', () => {
      const res: any = parseListFile('a\n\nb\n\nc\\u\n\n', true)
      expect(res.error).toBeUndefined()
      expect(res.data).toEqual(['a', 'b', 'cu'])
    })
    it('Character codes - hit', () => {
      const res: any = parseListFile(' a\\U+00A5b c\n', true)
      expect(res.error).toBeUndefined()
      expect(res.data).toEqual(['a\xA5b c'])
    })
    it('First line character is escaped', () => {
      const res: any = parseListFile('\\u+0020', true)
      expect(res.error).toBeUndefined()
      expect(res.data).toEqual([' '])
    })
    it('Dangling hex escape code, strict', () => {
      const res: any = parseListFile('\\u+', true)
      expect(res.error).toBeUndefined()
      expect(res.data).toEqual(['\x00'])
    })
    it('Dangling simple escape code, strict', () => {
      const res: any = parseListFile('\\u', true)
      expect(res.error).toBeUndefined()
      expect(res.data).toEqual(['u'])
    })
  })

})
