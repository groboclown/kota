import { coreError } from '../../../lib/error'
import { lookupInternal } from '../lookup'
import { StorageContext } from '../storage-context'
import * as tobj from '../type-objects'
import * as tn from '../type-names'

describe('lookupInternal', () => {
  const ctx = new StorageContext({
    // Group A, with members "x" and "y".
    '/ref/group/a/x/v1': new tobj.NumberInternal('/attr/number/1', 0.2),
    '/ref/group/a/y/v1': new tobj.NumberInternal('/attr/number/1', 0.4),
    '/def/group/a': tobj.createGroupDefinitionInternal([
      { name: 'x', matches: {}, referencePath: '/ref/group/a/x' },
      { name: 'y', matches: {}, referencePath: '/ref/group/a/y' },
    ]),
    '/attr/group/a': new tobj.GroupSetAttribute('/def/group/a'),
    '/value/group/a/x': new tobj.GroupSetInternal('/attr/group/a', { 'x': 1 }),
    '/value/group/a/y': new tobj.GroupSetInternal('/attr/group/a', { 'y': 1 }),

    // Group B, with members:
    //   "inc" which is incomplete path lookup.
    //   "inf" which has infinite recursion.
    '/ref/group/b/inc/v1': new tobj.NumberInternal('/attr/number/1', 0.2),
    '/ref/group/b/inf/v1': new tobj.GroupSetInternal('/attr/group/b', { 'inf': 1 }),
    '/def/group/b': tobj.createGroupDefinitionInternal([
      { name: 'inc', matches: {}, referencePath: '/ref/group/b/inc' },
      { name: 'inf', matches: {}, referencePath: '/ref/group/b/inf' },
    ]),
    '/attr/group/b': new tobj.GroupSetAttribute('/def/group/b'),
    '/value/group/b/inc': new tobj.GroupSetInternal('/attr/group/b', { 'inc': 1 }),
    '/value/group/b/inf': new tobj.GroupSetInternal('/attr/group/b', { 'inf': 1 }),

    // Context Refrences
    '/ptr/val/a/x/v1': new tobj.ContextReference('/ref/group/a/x/v1'),
    '/ptr/ref/a/x': new tobj.ContextReference('/value/group/a/x/v1'),

    // General reference
    '/attr/number/1': new tobj.NumberAttribute(0, 1),
  })
  describe('When no path registered', () => {
    it('returns undefined', () => {
      const ret = lookupInternal(ctx, '/not/exist', 1)
      expect(ret).toEqual([undefined, '/not/exist', ['/not/exist']])
    })
  })
  describe('When referencing a single, no indirection path', () => {
    it('returns the right value', () => {
      const path = '/ref/group/a/x/v1'
      const ret = lookupInternal(ctx, path, 1)
      expect(ret).toEqual([new tobj.NumberInternal('/attr/number/1', 0.2), path, [path]])
    })
  })
  describe('When looking up a group referenced value', () => {
    it('returns the indirection and value', () => {
      const ret = lookupInternal(ctx, '/value/group/a/x/v1', 2)
      expect(ret).toEqual([
        new tobj.NumberInternal('/attr/number/1', 0.2),
        '/ref/group/a/x/v1',
        ['/value/group/a/x/v1', '/ref/group/a/x/v1']
      ])
    })
  })
  describe('When looking up a group referenced value that goes too deep', () => {
    it('returns the indirection and value', () => {
      const ret = lookupInternal(ctx, '/value/group/a/x/v1', 1)
      expect(ret).toEqual([
        {
          error: coreError('too many path indirections', { depth: 1, path: "/value/group/a/x/v1" })
        },
        '/ref/group/a/x/v1',
        ['/value/group/a/x/v1', '/ref/group/a/x/v1']
      ])
    })
  })
  describe('When looking up a context reference pointer direct to a value', () => {
    it('returns the indirection and value', () => {
      const ret = lookupInternal(ctx, '/ptr/val/a/x/v1', 3)
      expect(ret).toEqual([
        new tobj.NumberInternal('/attr/number/1', 0.2),
        '/ref/group/a/x/v1',
        ['/ptr/val/a/x/v1', '/ref/group/a/x/v1']
      ])
    })
  })
  describe('When looking up a context reference pointer to a group', () => {
    it('returns the indirection and value', () => {
      const ret = lookupInternal(ctx, '/ptr/ref/a/x', 3)
      expect(ret).toEqual([
        new tobj.NumberInternal('/attr/number/1', 0.2),
        '/ref/group/a/x/v1',
        ['/ptr/ref/a/x', '/value/group/a/x/v1', '/ref/group/a/x/v1']
      ])
    })
  })
})
