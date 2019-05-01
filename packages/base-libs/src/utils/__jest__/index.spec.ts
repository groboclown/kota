
import * as idx from '../index'

describe('notNull', () => {
  it('null', () => {
    expect(idx.option(null, '')).toEqual('')
  })
  it('undefined', () => {
    expect(idx.option(undefined, '')).toEqual('')
  })
  it('not-null', () => {
    expect(idx.option<string>('x', '')).toEqual('x')
  })
})

describe('firstNotNull', () => {
  it('empty', () => {
    expect(idx.firstOption<string>([], '')).toEqual('')
  })
  it('null', () => {
    expect(idx.firstOption([null], '')).toEqual('')
  })
  it('undefined', () => {
    expect(idx.firstOption([undefined], '')).toEqual('')
  })
  it('one item', () => {
    expect(idx.firstOption<string>(['x'], '')).toEqual('x')
  })
  it('nulls then right one', () => {
    expect(idx.firstOption<string>([null, undefined, null, 'x'], '')).toEqual('x')
  })
  it('nulls and several others', () => {
    expect(idx.firstOption<string>([null, 'a', undefined, 'b', null, 'c'], '')).toEqual('a')
  })
  it('first not null, nulls and several others', () => {
    expect(idx.firstOption<string>(['a', undefined, 'b', null, 'c', null], '')).toEqual('a')
  })
})
