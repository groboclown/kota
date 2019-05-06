
import { ErrorValue, hasErrorValueList } from '@kota/base-libs'
import * as idx from '../index'
import { ModuleHeader } from '../../model'
import { createLoader, BASIC_ERROR_1 } from './util'

describe('readModuleHeader', () => {
  const validAbout: ModuleHeader = {
    id: 'abcd',
    name: 'abc def',
    description: 'a b c d',
    version: [2, 1],
    authors: [],
    license: [],
    source: [],
    requires: [],
  }
  const expectedError: ErrorValue = BASIC_ERROR_1
  it('valid input data', () => {
    const loader = createLoader(idx.MODULE_ABOUT_NAME, validAbout)
    return idx.readModuleHeader('x', loader)
      .then((ret) => {
        if (hasErrorValueList(ret)) {
          // This is for error reporting...
          expect(ret.errors).toBeUndefined()
          return
        }
        expect(hasErrorValueList(ret)).toBe(false)
        expect(ret).toEqual(validAbout)
      })
  })
  it('bad read about', () => {
    const loader = createLoader(idx.MODULE_ABOUT_NAME, expectedError)
    return idx.readModuleHeader('x', loader)
      .then((ret) => {
        if (!hasErrorValueList(ret)) {
          // This is for error reporting...
          expect(hasErrorValueList(ret)).toBe(true)
          return
        }
        expect(ret.errors).toEqual([expectedError])
      })
  })
  it('bad json about', () => {
    const loader = createLoader(idx.MODULE_ABOUT_NAME, '"')
    return idx.readModuleHeader('x', loader)
      .then((ret) => {
        if (!hasErrorValueList(ret)) {
          // This is for error reporting...
          expect(hasErrorValueList(ret)).toBe(true)
          return
        }
        expect(ret.errors).toEqual([{
          domain: "/modules/core/system-text/errors",
          msgid: "bad json format",
          params: {
            msg: 'Unexpected end of JSON input',
            path: 'x/about.json',
          },
        }])
      })
  })
  it('bad object about', () => {
    const loader = createLoader(idx.MODULE_ABOUT_NAME, {
      id: 'ab', // <== ID too short
      name: 'abc def',
      description: 'a b c d',
      version: [2, 1],
      authors: [],
      license: [],
      source: [],
      requires: [],
    })
    return idx.readModuleHeader('x', loader)
      .then((ret) => {
        if (!hasErrorValueList(ret)) {
          // This is for error reporting...
          expect(hasErrorValueList(ret)).toBe(true)
          return
        }
        expect(ret.errors).toEqual([{
          domain: "/modules/core/system-text/errors",
          msgid: "invalid file schema format",
          params: {
            dataPath: ".id",
            keyword: "minLength",
            message: "should NOT be shorter than 4 characters",
            params: "{\"limit\":4}",
            path: "x/about.json",
            propertyName: "(no property)",
            schema: "module",
            schemaPath: "#/properties/id/minLength",
          },
        }])
      })
  })
})
