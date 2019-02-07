
import { replacePercentText } from '../replace-text'

describe('replacePercentText', () => {
  it('no replacement', () => {
    expect(replacePercentText(
      'abcdef', { 'a': 'x' }
    )).toBe('abcdef')
  })

  it('escaped 1', () => {
    expect(replacePercentText(
      'ab%%cdef', { 'a': 'x' }
    )).toBe('ab%cdef')
  })

  it('trailing sign 1', () => {
    expect(replacePercentText(
      'abcdef%', { 'a': 'x' }
    )).toBe('abcdef%')
  })

  it('no equivalent sign 1', () => {
    expect(replacePercentText(
      'a%xbcdef', { 'a': 'x' }
    )).toBe('a%xbcdef')
  })

  it('simple 1 - start', () => {
    expect(replacePercentText(
      '%aabcdef', { 'a': '123' }
    )).toBe('123abcdef')
  })

  it('simple 1 - middle', () => {
    expect(replacePercentText(
      'ab%acdef', { 'a': '123' }
    )).toBe('ab123cdef')
  })

  it('simple 1 - end', () => {
    expect(replacePercentText(
      'abcdef%a', { 'a': '123' }
    )).toBe('abcdef123')
  })

  it('simple 1 - only', () => {
    expect(replacePercentText(
      '%a', { 'a': '123' }
    )).toBe('123')
  })

  it('elaborate escaping', () => {
    expect(replacePercentText(
      '%%a%%%a%%%%a%%%%%a%%%', { 'a': '123' }
    )).toBe('%a%123%%a%%123%%')
  })
})
