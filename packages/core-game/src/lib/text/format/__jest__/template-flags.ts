import { getNumberFlags } from '../template-flags'

describe('getNumberFlags', () => {
  it('empty', () => {
    const res = getNumberFlags('')
    expect(res).toEqual({})
  })

  it('single-no trailing semi', () => {
    const res = getNumberFlags('a:1')
    expect(res).toEqual({ a: 1 })
  })

  it('no-value', () => {
    const res = getNumberFlags('abc;c:2')
    expect(res).toEqual({ abc: 1, c: 2 })
  })

  it('empty-value 1', () => {
    const res = getNumberFlags('a:;c:2')
    expect(res).toEqual({ a: 1, c: 2 })
  })

  it('empty-value 2', () => {
    const res = getNumberFlags('a;c:2')
    expect(res).toEqual({ a: 1, c: 2 })
  })

  it('double-no trailing semi', () => {
    const res = getNumberFlags('a:1;c:2')
    expect(res).toEqual({ a: 1, c: 2 })
  })

  it('double-trailing semi', () => {
    const res = getNumberFlags('a:1;c:2;')
    expect(res).toEqual({ a: 1, c: 2 })
  })

  it('empty key', () => {
    const res = getNumberFlags(':1;c:2')
    expect(res).toEqual({ c: 2 })
  })

  it('not number', () => {
    const res = getNumberFlags('a:1c2;c:2')
    expect(res).toEqual({ c: 2 })
  })

  it('simple JS NaN check', () => {
    expect(Number('1v1')).toBeNaN()
    expect(!Number.isNaN(Number('1v1'))).toBe(false)
  })

  it('defaults-unchanged', () => {
    const df = { a: 1, c: 2 }
    const res = getNumberFlags('a:3;b:4', df)
    expect(res).toEqual({ a: 3, b: 4, c: 2 })
    expect(df).toEqual({ a: 1, c: 2 })
  })
})
