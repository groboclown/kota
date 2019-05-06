
import { ErrorValue, hasErrorValueList } from '@kota/base-libs'
import * as idx from '../index'
import { LocalizedMessageCatalog, Translation } from '../../model'
import { createLoader, BASIC_ERROR_1 } from './util'

describe('readModuleLocalizationText', () => {
  const validMsgCat: LocalizedMessageCatalog = {
    // FIXME this causes an error because the schema uses "allOf" + "additionalProperties: false"
    // This is explicitly called out in the JSON schema to NOT work, even though the ts generator
    // creates the expected structure.
    msgids: {
      dyz: [{ blockStyle: 'para', text: [] }],
    },
  }
  const FILENAME = 'mg-cat'
  const txn: Translation = {
    source: 'abc',
    locale: 'kg_EN',
    domain: '/x/y',
    file: FILENAME,
  }
  const expectedError: ErrorValue = BASIC_ERROR_1
  it('valid input data', () => {
    const loader = createLoader(FILENAME, validMsgCat)
    return idx.readModuleLocalizationText('x', txn, loader)
      .then((ret) => {
        if (hasErrorValueList(ret)) {
          // This is for error reporting...
          expect(ret.errors).toBeUndefined()
          return
        }
        expect(hasErrorValueList(ret)).toBe(false)
        expect(ret).toEqual(validMsgCat)
      })
  })
  it('bad read contents', () => {
    const loader = createLoader(FILENAME, expectedError)
    return idx.readModuleLocalizationText('x', txn, loader)
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
    const loader = createLoader(FILENAME, '"')
    return idx.readModuleLocalizationText('x', txn, loader)
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
            path: 'x/' + FILENAME,
          },
        }])
      })
  })
  it('bad object contents', () => {
    const loader = createLoader(FILENAME, {})
    return idx.readModuleLocalizationText('x', txn, loader)
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
            message: "should have required property 'msgids'",
            params: "{\"missingProperty\":\"msgids\"}",
            path: "x/" + FILENAME,
            propertyName: "(no property)",
            schema: "localized-message-catalog",
            schemaPath: "#/required",
          },
        }])
      })
  })
})
