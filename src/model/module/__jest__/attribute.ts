
import * as att from '../attribute'
import { ParsedError } from '../parse-info'
import { ErrorValue, CORE_ERROR_DOMAIN } from '../../../lib/error/error'
import { INTEGER_RANGE_MAX, INTEGER_RANGE_MIN } from '../../../lib/attributes/primitives'

describe('AttributeTypeConstraint', () => {
  function runAtc(value: any): { hasError: boolean, errors: ParsedError[] } {
    const err: ParsedError[] = []
    const ret = att.getAttributeTypeConstraint().runVerify(value, err)
    return { hasError: ret, errors: err }
  }

  describe('valid', () => {
    function expectValid(value: any) {
      const res = runAtc(value)
      expect(res.hasError).toBe(false)
      expect(res.errors).toHaveLength(0)
    }

    it('map', () => {
      expectValid({ name: 'my value', type: 'map' })
    })
    it('fuzz', () => {
      expectValid({ name: 'my value', type: 'fuzz' })
    })
    it('count', () => {
      expectValid({ name: 'my value', type: 'count' })
    })
    it('range - simple', () => {
      expectValid({ name: 'my value', type: 'range' })
    })
    it('range - min', () => {
      expectValid({ name: 'my value', type: 'range', min: -10 })
    })
    it('range - max', () => {
      expectValid({ name: 'my value', type: 'range', max: -10 })
    })
    it('range - min/max', () => {
      expectValid({ name: 'my value', type: 'range', min: 10, max: 100 })
    })
    it('number', () => {
      expectValid({ name: 'my valid', type: 'number', min: 10, max: 100 })
    })
    it('number - edge', () => {
      expectValid({ name: 'my valid', type: 'number', min: INTEGER_RANGE_MIN, max: INTEGER_RANGE_MAX })
    })
  })

  describe('invalid', () => {
    interface PE {
      name: string
      type: string
      error?: string
      missing?: boolean
      invalid?: boolean
      src?: any
      params?: any
    }
    function expectInvalid(value: any, ...problems: PE[]) {
      const res = runAtc(value)
      expect(res.hasError).toBe(true)
      expect(res.errors).toHaveLength(problems.length)
      problems.forEach((p) => {
        expect(res.errors).toContainEqual(<ParsedError>{
          attributeName: p.name,
          attributeType: p.type,
          missing: p.missing ? true : false,
          invalid: p.invalid ? true : false,
          srcValue: p.missing ? undefined : p.src ? p.src : value,
          violation: <ErrorValue>{
            domain: CORE_ERROR_DOMAIN,
            msgid: p.missing ? 'required attribute' : p.error,
            params: p.params ? p.params : {}
          }
        })
      })
    }

    it('empty', () => {
      expectInvalid({},
        { name: 'name', type: 'string', missing: true },
        { name: 'type', type: 'type', missing: true }
      )
    })

    /* TODO UNCOMMENT THESE
        it('number min range below', () => {
          expectInvalid({ name: 'a value', type: 'number', min: INTEGER_RANGE_MIN - 1 },
            { name: 'min < max', type: 'number', error: 'min < max', invalid: true })
        })

        it('number min range above', () => {
          expectInvalid({ name: 'a value', type: 'number', min: INTEGER_RANGE_MAX + 1 },
            { name: 'min < max', type: 'number', error: 'min < max', invalid: true })
        })

        it('number max range below', () => {
          expectInvalid({ name: 'a value', type: 'number', max: INTEGER_RANGE_MIN - 1 },
            { name: 'min < max', type: 'number', error: 'min < max', invalid: true })
        })


        it('number min/max mixup', () => {
          expectInvalid({ name: 'a value', type: 'number', min: 10, max: 0 },
            { name: 'min < max', type: 'number', error: 'min < max', invalid: true })
        })
    */
    /* This test is super unstable.  Any minor modification to the list of attributes breaks this test.
     it('number max range above', () => {
       //FIXME_DEBUG.debug = true
       try {
         expectInvalid({ name: 'a value', type: 'number', max: INTEGER_RANGE_MAX + 1 },
           // FIXME all these error messages show a distinct need for clarification.
           { name: 'type', type: 'string', invalid: true, src: 'number', error: 'map', params: { path: "for map: [object Object]" } },
           { name: 'type', type: 'string', invalid: true, src: 'number', error: 'fuzz', params: { path: "for fuzz: [object Object]" } },
           { name: 'type', type: 'string', invalid: true, src: 'number', error: 'group', params: { path: "for group: [object Object]" } },
           { name: 'type', type: 'string', invalid: true, src: 'number', error: 'random', params: { path: "for random: [object Object]" } },
           { name: 'type', type: 'string', invalid: true, src: 'number', error: 'date', params: { path: "for date: [object Object]" } },
           { name: 'min', type: 'number', missing: true, error: 'required attribute', params: { path: "for number: [object Object]" } },
           { name: 'max', type: 'number', invalid: true, src: 1000000001, error: 'number in [-1000000000, 1000000000]', params: { path: "for number: [object Object]" } },
           { name: 'type', type: 'string', invalid: true, src: 'number', error: 'count', params: { path: "for count: [object Object]" } },
           { name: 'type', type: 'string', invalid: true, src: 'number', error: 'range', params: { path: "for range: [object Object]" } },
           { name: 'max', type: 'number', invalid: true, src: 1000000001, error: 'number in [-1000000000, 1000000000]', params: { path: "for range: [object Object]" } },
           { name: 'type', type: 'string', invalid: true, src: 'number', error: 'calculated', params: { path: "for calculated: [object Object]" } },
           { name: 'function', type: 'function definition', missing: true, error: 'required attribute', params: { path: "for calculated: [object Object]" } },
         )
       } finally {
         //FIXME_DEBUG.debug = false
       }
     })
     */
  })
})

describe('isAttributeFunctionType', () => {
  it('wrong type', () => {
    expect(att.isAttributeFunctionType({
      name: 'blah', type: 'xyz'
    })).toBe(false)
  })
  it('missing expected attributes', () => {
    expect(att.isAttributeFunctionType({
      name: 'blah', type: 'function'
    })).toBe(false)
  })
  // FIXME the underlying API makes this impossible
  it('missing value', () => {
    expect(att.isAttributeFunctionType({
      name: 'blah', type: 'function', // valueType: 'blah'
    })).toBe(false)
  })
  it('missing valueType', () => {
    expect(att.isAttributeFunctionType({
      name: 'blah', type: 'function', // value: 'blah'
    })).toBe(false)
  })
})

describe('isValidNumber', () => {
  it('string', () => {
    expect(att.isValidNumber('t')).toBe(false)
  })
  it('nan', () => {
    expect(att.isValidNumber(NaN)).toBe(false)
  })
  it('inf', () => {
    expect(att.isValidNumber(Infinity)).toBe(false)
  })
  it('min', () => {
    expect(att.isValidNumber(INTEGER_RANGE_MIN)).toBe(true)
  })
  it('max', () => {
    expect(att.isValidNumber(INTEGER_RANGE_MAX)).toBe(true)
  })
  it('0', () => {
    expect(att.isValidNumber(0)).toBe(true)
  })
})
