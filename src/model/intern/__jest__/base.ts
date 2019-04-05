import * as base from '../base'

describe('base', () => {
  describe('splitLast', () => {
    it('With empty path', () => {
      expect(base.splitLast('')).toEqual(['/', ''])
    })
    it('With root path', () => {
      expect(base.splitLast('/')).toEqual(['/', ''])
    })
    it('With one path', () => {
      expect(base.splitLast('/one')).toEqual(['/', 'one'])
    })
    it('With two paths', () => {
      expect(base.splitLast('/1/2')).toEqual(['/1/', '2'])
    })
    it('With three paths', () => {
      expect(base.splitLast('/1/two/3')).toEqual(['/1/two/', '3'])
    })
    it('With trailing slashes', () => {
      expect(base.splitLast('/1/two/')).toEqual(['/1/', 'two'])
    })
  })


  describe('stripTrailingSlash', () => {
    it('With empty path', () => {
      expect(base.stripTrailingSlash('')).toBe('')
    })
    it('With root', () => {
      expect(base.stripTrailingSlash('/')).toBe('/')
    })
    it('With non-slashed path', () => {
      expect(base.stripTrailingSlash('/abc')).toBe('/abc')
    })
    it('With single trailing slash', () => {
      expect(base.stripTrailingSlash('/abc/')).toBe('/abc')
    })
    it('With multiple trailing slashes', () => {
      expect(base.stripTrailingSlash('/abc////')).toBe('/abc')
    })
  })
})
