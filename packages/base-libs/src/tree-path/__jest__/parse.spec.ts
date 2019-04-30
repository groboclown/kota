import * as parse from '../parse'

describe('parse', () => {
  describe('isAbsolutePath', () => {
    it('With empty path', () => {
      expect(parse.isAbsolutePath('')).toBe(false)
    })
    it('With root path', () => {
      expect(parse.isAbsolutePath('/')).toBe(true)
    })
    it('With relative path', () => {
      expect(parse.isAbsolutePath('x/')).toBe(false)
    })
  })

  describe('isRelativePath', () => {
    it('With empty path', () => {
      expect(parse.isRelativePath('')).toBe(false)
    })
    it('With root path', () => {
      expect(parse.isRelativePath('/')).toBe(false)
    })
    it('With relative path', () => {
      expect(parse.isRelativePath('x/')).toBe(true)
    })
  })

  describe('normalizePath', () => {
    it('with empty path, non-trailing slash', () => {
      expect(parse.normalizePath('', false)).toBe('')
    })
    it('with empty path, trailing slash', () => {
      expect(parse.normalizePath('', true)).toBe('')
    })
    it('with root path, trailing slash', () => {
      expect(parse.normalizePath('/', true)).toBe('/')
    })
    it('with root path, no trailing slash', () => {
      expect(parse.normalizePath('/', false)).toBe('/')
    })
    it('with double slashes, no trailing slash', () => {
      expect(parse.normalizePath('a//b', false)).toBe('a/b')
    })
    it('with double + triple + quadruple slashes, trailing slash', () => {
      expect(parse.normalizePath('a/b//c///d////e', true)).toBe('a/b/c/d/e/')
    })
  })

  describe('joinPaths', () => {
    it('with no paths', () => {
      expect(parse.joinPaths()).toBe('')
    })
    it('with empty path', () => {
      expect(parse.joinPaths('')).toBe('')
    })
    it('with root path', () => {
      expect(parse.joinPaths('/')).toBe('/')
    })
    it('with one relative path', () => {
      expect(parse.joinPaths('x')).toBe('x')
    })
    it('with one absolute path', () => {
      expect(parse.joinPaths('/x')).toBe('/x')
    })
    it('with two relative paths', () => {
      expect(parse.joinPaths('x', 'y')).toBe('x/y')
    })
    it('with two absolute paths', () => {
      expect(parse.joinPaths('/x', '/y')).toBe('/y')
    })
    it('with relative, absolute, relative paths, and stripped trailing slash', () => {
      expect(parse.joinPaths('x', '/y', 'z/')).toBe('/y/z')
    })
  })

  describe('absoluteSplitLast', () => {
    it('With empty path', () => {
      expect(parse.absoluteSplitLast('')).toEqual(['/', ''])
    })
    it('With root path', () => {
      expect(parse.absoluteSplitLast('/')).toEqual(['/', ''])
    })
    it('With one path', () => {
      expect(parse.absoluteSplitLast('/one')).toEqual(['/', 'one'])
    })
    it('With two paths', () => {
      expect(parse.absoluteSplitLast('/1/2')).toEqual(['/1/', '2'])
    })
    it('With three paths', () => {
      expect(parse.absoluteSplitLast('/1/two/3')).toEqual(['/1/two/', '3'])
    })
    it('With trailing slashes', () => {
      expect(parse.absoluteSplitLast('/1/two/')).toEqual(['/1/', 'two'])
    })
  })


  describe('stripTrailingSlash', () => {
    it('With empty path', () => {
      expect(parse.stripTrailingSlash('')).toBe('')
    })
    it('With root', () => {
      expect(parse.stripTrailingSlash('/')).toBe('/')
    })
    it('With non-slashed path', () => {
      expect(parse.stripTrailingSlash('/abc')).toBe('/abc')
    })
    it('With single trailing slash', () => {
      expect(parse.stripTrailingSlash('/abc/')).toBe('/abc')
    })
    it('With multiple trailing slashes', () => {
      expect(parse.stripTrailingSlash('/abc////')).toBe('/abc')
    })
  })
})
