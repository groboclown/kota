
import { FileLoader, FileData, ErrorValue, HasErrorValue, isErrorValue, hasErrorValueList } from '@kota/base-libs'
import * as idx from '../index'
import { ModuleHeader, FileStructure } from '../../model'

describe('read', () => {
  function createLoader(name: string, contents: any): FileLoader {
    return (...path: string[]): Promise<FileData | HasErrorValue> => {
      if (path[path.length - 1] === name) {
        if (isErrorValue(contents)) {
          return Promise.resolve({ error: contents })
        }
        return Promise.resolve({
          source: path.join('/'),
          data: typeof contents === 'string' && contents || JSON.stringify(contents),
        })
      }
      return Promise.resolve({
        error: { domain: 'unittest', msgid: 'invalid path {path}', params: { path: path.join('/') } },
      })
    }
  }
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
  const validContents: FileStructure = {
    installHooks: [],
    upgradeHooks: [],
    groupValues: [],
    overrideTree: [],
    moduleTree: [],
    localizations: [],
    translations: [],
    audio: [],
    videos: [],
    images: [],
  }
  const expectedError: ErrorValue = {
    domain: 'unittest',
    msgid: 'expected error',
    params: {},
  }
  const expectedError2: ErrorValue = {
    domain: 'unittest',
    msgid: 'expected error2',
    params: {},
  }
  describe('readModuleHeader', () => {
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
  describe('readModuleContents', () => {
    it('valid input data', () => {
      const loader = createLoader(idx.MODULE_CONTENTS_NAME, validContents)
      return idx.readModuleContents('x', loader)
        .then((ret) => {
          if (hasErrorValueList(ret)) {
            // This is for error reporting...
            expect(ret.errors).toBeUndefined()
            return
          }
          expect(hasErrorValueList(ret)).toBe(false)
          expect(ret).toEqual(validContents)
        })
    })
    it('bad read contents', () => {
      const loader = createLoader(idx.MODULE_CONTENTS_NAME, expectedError)
      return idx.readModuleContents('x', loader)
        .then((ret) => {
          if (!hasErrorValueList(ret)) {
            // This is for error reporting...
            expect(hasErrorValueList(ret)).toBe(true)
            return
          }
          expect(ret.errors).toEqual([expectedError])
        })
    })
    it('bad json contents', () => {
      const loader = createLoader(idx.MODULE_CONTENTS_NAME, '"')
      return idx.readModuleContents('x', loader)
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
              path: 'x/contents.json',
            },
          }])
        })
    })
    it('bad object contents', () => {
      const loader = createLoader(idx.MODULE_CONTENTS_NAME, {
        installHooks: [],
        upgradeHooks: [],
        groupValues: [],
        overrideTree: [],
        moduleTree: [],
        localizations: [],
        translations: [],
        audio: [],
        videos: [],
        // images: [], <== no images
      })
      return idx.readModuleContents('x', loader)
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
              dataPath: "",
              keyword: "required",
              message: "should have required property 'images'",
              params: "{\"missingProperty\":\"images\"}",
              path: "x/contents.json",
              propertyName: "(no property)",
              schema: "file-structure",
              schemaPath: "#/required",
            },
          }])
        })
    })
  })
})
