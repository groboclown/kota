
import * as yaml from 'js-yaml'
import * as lf from '../load-raw'
import { ErrorValue, CORE_ERROR_DOMAIN } from '../../error/error'

describe('test out yaml', () => {
  it('Multi-contents', () => {
    const contents =
      '---\n' +
      'top-item:\n' +
      '  element: x\n' +
      '---\n' +
      'second:\n' +
      '  key: value\n'
    const raw: any[] = yaml.safeLoadAll(contents)
    // console.log(raw)
    expect(raw).toHaveLength(2)
    expect(raw[0]).toEqual({ 'top-item': { element: 'x' } })
    expect(raw[1]).toEqual({ second: { key: 'value' } })
  })
  it('List of objects', () => {
    const contents =
      '---\n' +
      'top-item:\n' +
      '  -\n' +
      '    a: 1\n' +
      '    b: 2\n' +
      '  -\n' +
      '    c: 3\n' +
      '    d: 4\n'
    const raw: any[] = yaml.safeLoadAll(contents)
    expect(raw).toHaveLength(1)
    expect(raw[0]).toEqual({ 'top-item': [{ a: 1, b: 2 }, { c: 3, d: 4 }] })
  })
  it('Yaml error', () => {
    const contents = 'a: x\b2\n'
    expect(() => yaml.safeLoadAll(contents)).toThrow(yaml.YAMLException)
  })
})

describe('loadStructuredFileContents', () => {
  it('invalid file format', () => {
    const raw: any = lf.loadStructuredFileContents('')
    expect(raw.data).toBeUndefined()
    expect(raw.error).toEqual({
      domain: CORE_ERROR_DOMAIN,
      msgid: 'bad yaml format first line',
      params: {}
    })
  })
  it('most basic n', () => {
    const ret = lf.loadStructuredFileContents('---\n')
    expect(ret).toEqual({ data: [null] })
  })
  it('most basic r', () => {
    const ret = lf.loadStructuredFileContents('---\r')
    expect(ret).toEqual({ data: [null] })
  })
  it('simple 1', () => {
    const ret = lf.loadStructuredFileContents('---\na:\n')
    expect(ret).toEqual({ data: [{ a: null }] })
  })
  it('simple 2', () => {
    const ret = lf.loadStructuredFileContents('---\ra:\r')
    expect(ret).toEqual({ data: [{ a: null }] })
  })
})

describe('loadListFile', () => {
  it('empty', () => {
    const res: any = lf.loadListFile('', true)
    expect(res.error).toBeUndefined()
    expect(res.data).toHaveLength(0)
  })
  it('Just comments and blanks', () => {
    const res: any = lf.loadListFile('# Hey a comment\n\n\n\r\n\r   \n    \r  \n \r   # Another Comment\n \r \n', true)
    expect(res.error).toBeUndefined()
    expect(res.data).toHaveLength(0)
  })
  it('Single line without EOL', () => {
    const res: any = lf.loadListFile('one line', true)
    expect(res.error).toBeUndefined()
    expect(res.data).toEqual(['one line'])
  })
  it('Single line with EOL', () => {
    const res: any = lf.loadListFile('one line\n', true)
    expect(res.error).toBeUndefined()
    expect(res.data).toEqual(['one line'])
  })
  it('Two lines without trailing EOL', () => {
    const res: any = lf.loadListFile('one\ntwo', true)
    expect(res.error).toBeUndefined()
    expect(res.data).toEqual(['one', 'two'])
  })
  it('Two lines with EOL', () => {
    const res: any = lf.loadListFile('one\ntwo\n', true)
    expect(res.error).toBeUndefined()
    expect(res.data).toEqual(['one', 'two'])
  })
  it('Two lines with comments and blanks', () => {
    const res: any = lf.loadListFile('# a comment\n\rone\n  \r# commant \n  two  \n \r', true)
    expect(res.error).toBeUndefined()
    expect(res.data).toEqual(['one', 'two'])
  })
  it('Simple escape codes', () => {
    const res: any = lf.loadListFile('a\\\\u+1000 \\tu+1000 \\ru+1000 \\nu+1000 \\a \\b \\c \\\na\n', true)
    expect(res.error).toBeUndefined()
    expect(res.data).toEqual(['a\\u+1000 \tu+1000 \ru+1000 \nu+1000 a b c a'])
  })
  it('Line continuation', () => {
    const res: any = lf.loadListFile('a b \\\n c d', true)
    expect(res.error).toBeUndefined()
    expect(res.data).toEqual(['a b  c d'])
  })

  it('Character codes - miss not strict', () => {
    const res: any = lf.loadListFile('a\\u+\n\nb\\u+1x\n\nc\\u\n\n', false)
    expect(res.error).toBeUndefined()
    expect(res.data).toEqual(['au+\n', 'bu+1x', 'cu'])
  })
  it('Character codes - miss strict 1', () => {
    const res: any = lf.loadListFile('a\\u+\n\nb\\u+1x\n\nc\\u\n\n', true)
    expect(res.data).toBeUndefined()
    expect(res.error).toEqual(<ErrorValue>{
      domain: CORE_ERROR_DOMAIN,
      msgid: 'list file hex code',
      params: { value: 'u+' }
    })
  })
  it('Character codes - miss strict 2', () => {
    const res: any = lf.loadListFile('a\n\nb\\u+1x\n\nc\\u\n\n', true)
    expect(res.data).toBeUndefined()
    expect(res.error).toEqual(<ErrorValue>{
      domain: CORE_ERROR_DOMAIN,
      msgid: 'list file hex code',
      params: { value: 'u+1' }
    })
  })
  it('Character codes - miss strict 3', () => {
    const res: any = lf.loadListFile('a\n\nb\n\nc\\u\n\n', true)
    expect(res.error).toBeUndefined()
    expect(res.data).toEqual(['a', 'b', 'cu'])
  })
  it('Character codes - hit', () => {
    const res: any = lf.loadListFile(' a\\U+00A5b c\n', true)
    expect(res.error).toBeUndefined()
    expect(res.data).toEqual(['a\xA5b c'])
  })
})
