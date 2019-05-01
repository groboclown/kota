
import { FileLoader, FileData, ErrorValue, HasErrorValue, isErrorValue, hasErrorValueList } from '@kota/base-libs'
import * as idx from '../index'
import { ModuleHeader, FileStructure } from '../../model'

describe('readModule', () => {
  function createLoader(about: any, contents: any): FileLoader {
    return (...path: string[]): Promise<FileData | HasErrorValue> => {
      if (path[path.length - 1] === idx.MODULE_ABOUT_NAME) {
        if (isErrorValue(about)) {
          return Promise.resolve({ error: about })
        }
        return Promise.resolve({ source: path.join('/'), data: typeof about === 'string' && about || JSON.stringify(about) })
      }
      if (path[path.length - 1] === idx.MODULE_CONTENTS_NAME) {
        if (isErrorValue(contents)) {
          return Promise.resolve({ error: contents })
        }
        return Promise.resolve({ source: path.join('/'), data: typeof contents === 'string' && contents || JSON.stringify(contents) })
      }
      return Promise.resolve({ error: { domain: 'unittest', msgid: 'invalid path {path}', params: { path: path.join('/') } } })
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
  it('valid input data', () => {
    const loader = createLoader(validAbout, validContents)
    return idx.readModule('x', loader)
      .then((ret) => {
        if (hasErrorValueList(ret)) {
          // This is for error reporting...
          expect(ret.errors).toBeUndefined()
          return
        }
        expect(hasErrorValueList(ret)).toBe(false)
        expect(ret.about).toEqual(validAbout)
        expect(ret.contents).toEqual(validContents)
      })
  })
  it('bad read about', () => {
    const loader = createLoader(expectedError, validContents)
    return idx.readModule('x', loader)
      .then((ret) => {
        if (!hasErrorValueList(ret)) {
          // This is for error reporting...
          expect(hasErrorValueList(ret)).toBe(true)
          return
        }
        expect(ret.errors).toEqual([expectedError])
      })
  })
  it('bad read contents', () => {
    const loader = createLoader(validAbout, expectedError)
    return idx.readModule('x', loader)
      .then((ret) => {
        if (!hasErrorValueList(ret)) {
          // This is for error reporting...
          expect(hasErrorValueList(ret)).toBe(true)
          return
        }
        expect(ret.errors).toEqual([expectedError])
      })
  })
  it('bad read both', () => {
    const loader = createLoader(expectedError, expectedError2)
    return idx.readModule('x', loader)
      .then((ret) => {
        if (!hasErrorValueList(ret)) {
          // This is for error reporting...
          expect(hasErrorValueList(ret)).toBe(true)
          return
        }
        expect(ret.errors).toEqual([expectedError, expectedError2])
      })
  })
  it('bad json about', () => {
    const loader = createLoader('"', validContents)
    return idx.readModule('x', loader)
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
  it('bad json contents', () => {
    const loader = createLoader(validAbout, '"')
    return idx.readModule('x', loader)
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
  it('bad object about', () => {
    const loader = createLoader({
      id: 'ab', // <== ID too short
      name: 'abc def',
      description: 'a b c d',
      version: [2, 1],
      authors: [],
      license: [],
      source: [],
      requires: [],
    }, validContents)
    return idx.readModule('x', loader)
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
  it('bad object contents', () => {
    const loader = createLoader(validAbout, {
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
    return idx.readModule('x', loader)
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
