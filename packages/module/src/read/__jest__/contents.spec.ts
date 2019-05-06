
import { ErrorValue, hasErrorValueList } from '@kota/base-libs'
import * as idx from '../index'
import { FileStructure, NumberAttribute } from '../../model'
import { createLoader, BASIC_ERROR_1 } from './util'

describe('readModuleContents', () => {
  const validContents: FileStructure = {
    installHooks: [],
    upgradeHooks: [],
    groupValues: [],
    overrideTree: [],
    moduleTree: [
      {
        source: 'abc',
        relpath: 'x/y',
        entry: {
          // Valid range check
          type: 'attribute-number',
          min: 10,
          max: 100,
        } as NumberAttribute,
      },
    ],
    localizations: [],
    translations: [],
    audio: [],
    videos: [],
    images: [],
  }
  const expectedError: ErrorValue = BASIC_ERROR_1
  it('valid input data', () => {
    const loader = createLoader(idx.MODULE_CONTENTS_NAME, validContents)
    return idx.readModuleContents('x', loader)
      .then((ret) => {
        if (hasErrorValueList(ret)) {
          // This is for error reporting...
          /* tslint:disable */
          console.error(JSON.stringify(ret.errors))
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
