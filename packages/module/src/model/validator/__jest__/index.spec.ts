import * as idx from '../index'
import { ErrorValue } from '@kota/base-libs'

describe('SchemaVerifier', () => {
  const SCHEMA = {
    $schema: "http://json-schema.org/draft-07/schema#",
    $id: "https://x/y.json",
    title: "TestSchema",
    type: "object",
    properties: {
      id: {
        type: "string",
        pattern: "^[a-zA-Z][-a-zA-Z0-9]+$",
        minLength: 4,
      },
    },
    additionalProperties: false,
    required: ["id"],
  }
  interface TestSchema {
    id: string
  }
  const validator = new idx.SchemaVerifier<TestSchema>('s', SCHEMA)
  describe('with valid input', () => {
    it('all checks out', () => {
      const errs: ErrorValue[] = []
      const res = validator.validate('x1', { id: 'abcd' }, errs)
      expect(errs).toHaveLength(0)
      expect(res).toBe(true)
    })
  })
  describe('with invalid input', () => {
    it('no id', () => {
      const errs: ErrorValue[] = []
      const res = validator.validate('x2', {}, errs)
      expect(errs).toHaveLength(1)
      expect(res).toBe(false)
    })
  })
})
