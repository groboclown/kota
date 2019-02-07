
import * as pc from '../parse-contraints'
import { ParsedError } from '../parse-info'
import * as error from '../../../lib/error/error'

function runAc(ac: pc.AttributeConstraint, value: any): { hasError: boolean, errors: ParsedError[] } {
  const err: ParsedError[] = []
  const ret = ac.runVerify(value, err)
  return { hasError: ret, errors: err }
}
function expectNoErrors(ac: pc.AttributeConstraint, value: any): void {
  const res = runAc(ac, value)
  expect(res.errors).toHaveLength(0)
  expect(res.hasError).toBe(false)
}
interface PE {
  name: string
  type: string
  error?: string
  missing?: boolean
  invalid?: boolean
  params?: any
}
function expectErrors(
  ac: pc.AttributeConstraint, value: any,
  ...expected: PE[]): void {
  const res = runAc(ac, value)
  expect(res.errors).toHaveLength(expected.length)
  expect(res.hasError).toBe(true)
  expected.forEach(ex =>
    expect(res.errors).toContainEqual({
      attributeName: ex.name,
      attributeType: ex.type,
      invalid: ex.invalid ? true : false,
      missing: ex.missing ? true : false,
      srcValue: ex.missing ? undefined : value,
      violation: {
        domain: error.CORE_ERROR_DOMAIN,
        msgid: ex.error ? ex.error : (ex.missing ? 'required attribute' : 'ERROR'),
        params: ex.params ? ex.params : {}
      }
    })
  )
}

describe('AttributeConstraint', () => {
  describe('constructor', () => {
    it('required - empty constraints - exists', () => {
      expectNoErrors(
        new pc.AttributeConstraint('keyName', true, 'theType'),
        {})
    })

    it('required - empty constraints - undefined', () => {
      expectErrors(
        new pc.AttributeConstraint('keyName', true, 'theType'),
        undefined,

        {
          name: 'keyName',
          type: 'theType',
          missing: true,
          error: 'required attribute'
        })
    })

    it('not required - empty constraints - undefined', () => {
      expectNoErrors(
        new pc.AttributeConstraint('keyName', false, 'theType'),
        undefined)
    })
  })

  describe('has', () => {
    it('valid', () => {
      expectNoErrors(
        new pc.AttributeConstraint('keyName', true, 'theType')
          .has('a value', _ => true),
        {})
    })

    it('invalid', () => {
      expectErrors(
        new pc.AttributeConstraint('keyName', true, 'theType')
          .has('a value', _ => false),
        {},

        {
          name: 'keyName',
          type: 'theType',
          invalid: true,
          error: 'a value'
        })
    })
  })

  // Note: isAn is an alias for isA
  describe('isA', () => {
    it('valid', () => {
      expectNoErrors(
        new pc.AttributeConstraint('keyName', true, 'theType')
          .isA('number', <pc.ConstraintTypeCheckFunction<any>>(v => typeof v === 'number')),
        1)
    })

    it('invalid', () => {
      expectErrors(
        new pc.AttributeConstraint('keyName', true, 'theType')
          .isA('number', <pc.ConstraintTypeCheckFunction<any>>(v => typeof v === 'number')),
        'a string',

        {
          name: 'keyName',
          type: 'theType',
          invalid: true,
          error: 'number'
        })
    })
  })

  describe('contains', () => {
    it('valid', () => {
      expectNoErrors(
        new pc.AttributeConstraint('keyName', true, 'theType')
          .contains(_ => { }),
        {})
    })

    it('invalid', () => {
      expectErrors(
        new pc.AttributeConstraint('keyName', true, 'theType')
          // passes validation to an embedded ConstraintSet.
          .contains(cs => cs.mustHave('x', 'string', _ => true)),
        {},

        {
          name: 'x',
          type: 'string',
          missing: true
        })
    })
  })

  describe('isAString', () => {
    it('valid', () => {
      expectNoErrors(
        new pc.AttributeConstraint('keyName', true, 'theType')
          .isAString(),
        'asdf')
    })

    it('valid - numeric string', () => {
      expectNoErrors(
        new pc.AttributeConstraint('keyName', true, 'theType')
          .isAString(),
        '6')
    })

    it('invalid', () => {
      expectErrors(
        new pc.AttributeConstraint('keyName', true, 'theType')
          .isAString(),
        6,

        {
          name: 'keyName',
          type: 'theType',
          invalid: true,
          error: 'string'
        })
    })

    it('invalid - undefined', () => {
      expectErrors(
        new pc.AttributeConstraint('keyName', true, 'theType')
          .isAString(),
        undefined,

        {
          name: 'keyName',
          type: 'theType',
          missing: true
        })
    })
  })

  describe('isAnArrayOfStrings', () => {
    it('valid', () => {
      expectNoErrors(
        new pc.AttributeConstraint('keyName', true, 'theType')
          .isAnArrayOfStrings(),
        ['a', 'asdf', 'ffef'])
    })
    it('valid - empty', () => {
      expectNoErrors(
        new pc.AttributeConstraint('keyName', true, 'theType')
          .isAnArrayOfStrings(),
        [])
    })

    it('invalid - not array', () => {
      expectErrors(
        new pc.AttributeConstraint('keyName', true, 'theType')
          .isAnArrayOfStrings(),
        6,

        {
          name: 'keyName',
          type: 'theType',
          invalid: true,
          error: 'list of strings'
        })
    })

    it('invalid - array without strings', () => {
      expectErrors(
        new pc.AttributeConstraint('keyName', true, 'theType')
          .isAnArrayOfStrings(),
        [6, 7, 8],

        {
          name: 'keyName',
          type: 'theType',
          invalid: true,
          error: 'list of strings'
        })
    })

    it('invalid - array with non strings', () => {
      expectErrors(
        new pc.AttributeConstraint('keyName', true, 'theType')
          .isAnArrayOfStrings(),
        ['a', 'b', 6, 'd'],

        {
          name: 'keyName',
          type: 'theType',
          invalid: true,
          error: 'list of strings'
        })
    })
  })

  describe('isANumber', () => {
    it('valid', () => {
      expectNoErrors(
        new pc.AttributeConstraint('keyName', true, 'theType')
          .isANumber(),
        6)
    })

    it('invalid - numeric string', () => {
      expectErrors(
        new pc.AttributeConstraint('keyName', true, 'theType')
          .isANumber(),
        '6',

        {
          name: 'keyName',
          type: 'theType',
          invalid: true,
          error: 'number'
        })
    })

    it('invalid', () => {
      expectErrors(
        new pc.AttributeConstraint('keyName', true, 'theType')
          .isANumber(),
        'a string',

        {
          name: 'keyName',
          type: 'theType',
          invalid: true,
          error: 'number'
        })
    })

    it('invalid - undefined', () => {
      expectErrors(
        new pc.AttributeConstraint('keyName', true, 'theType')
          .isANumber(),
        undefined,

        {
          name: 'keyName',
          type: 'theType',
          missing: true
        })
    })
  })

  describe('isNumberBetween', () => {
    it('valid - middle of range', () => {
      expectNoErrors(
        new pc.AttributeConstraint('keyName', true, 'theType')
          .isNumberBetween(5, 7),
        6)
    })
    it('valid - edge of range', () => {
      expectNoErrors(
        new pc.AttributeConstraint('keyName', true, 'theType')
          .isNumberBetween(5, 7),
        5)
    })
    it('valid - negative lower bound', () => {
      expectNoErrors(
        new pc.AttributeConstraint('keyName', true, 'theType')
          .isNumberBetween(-10, 7),
        -5)
    })
    it('valid - negative both', () => {
      expectNoErrors(
        new pc.AttributeConstraint('keyName', true, 'theType')
          .isNumberBetween(-10, -1),
        -5)
    })
    it('invalid - below positive', () => {
      expectErrors(
        new pc.AttributeConstraint('keyName', true, 'theType')
          .isNumberBetween(5, 7),
        4,

        {
          name: 'keyName',
          type: 'theType',
          invalid: true,
          error: 'number in [5, 7]'
        })
    })
    it('invalid - below negative', () => {
      expectErrors(
        new pc.AttributeConstraint('keyName', true, 'theType')
          .isNumberBetween(-5, 7),
        -6,

        {
          name: 'keyName',
          type: 'theType',
          invalid: true,
          error: 'number in [-5, 7]'
        })
    })
    it('invalid - above positive', () => {
      expectErrors(
        new pc.AttributeConstraint('keyName', true, 'theType')
          .isNumberBetween(5, 7),
        8,

        {
          name: 'keyName',
          type: 'theType',
          invalid: true,
          error: 'number in [5, 7]'
        })
    })
    it('invalid - above negative', () => {
      expectErrors(
        new pc.AttributeConstraint('keyName', true, 'theType')
          .isNumberBetween(-5, -2),
        -1,

        {
          name: 'keyName',
          type: 'theType',
          invalid: true,
          error: 'number in [-5, -2]'
        })
    })

    it('invalid - numeric string', () => {
      expectErrors(
        new pc.AttributeConstraint('keyName', true, 'theType')
          .isNumberBetween(5, 7),
        '6',

        {
          name: 'keyName',
          type: 'theType',
          invalid: true,
          error: 'number in [5, 7]'
        })
    })

    it('invalid - not a number', () => {
      expectErrors(
        new pc.AttributeConstraint('keyName', true, 'theType')
          .isNumberBetween(5, 7),
        'a string',

        {
          name: 'keyName',
          type: 'theType',
          invalid: true,
          error: 'number in [5, 7]'
        })
    })

    it('invalid - mixed bounds', () => {
      expectErrors(
        new pc.AttributeConstraint('keyName', true, 'theType')
          .isNumberBetween(7, 5),
        6,

        {
          name: 'keyName',
          type: 'theType',
          invalid: true,
          error: 'number in [7, 5]'
        })
    })
  })

  describe('isAnObject', () => {
    it('valid', () => {
      expectNoErrors(
        new pc.AttributeConstraint('keyName', true, 'theType')
          .isAnObject(),
        {})
    })
    it('invalid - array', () => {
      expectErrors(
        new pc.AttributeConstraint('keyName', true, 'theType')
          .isAnObject(),
        [],

        {
          name: 'keyName',
          type: 'theType',
          invalid: true,
          error: 'object'
        })
    })
    it('invalid - string', () => {
      expectErrors(
        new pc.AttributeConstraint('keyName', true, 'theType')
          .isAnObject(),
        '',

        {
          name: 'keyName',
          type: 'theType',
          invalid: true,
          error: 'object'
        })
    })
  })

  describe('isAnId', () => {
    describe('with valid input', () => {
      it('single letter', () => {
        expectNoErrors(
          new pc.AttributeConstraint('keyName', true, 'theType')
            .isAnId(),
          'a')
      })
      it('all the valid letters', () => {
        expectNoErrors(
          new pc.AttributeConstraint('keyName', true, 'theType')
            .isAnId(),
          '!@#$%^&*<>-_+~abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890')
      })
    })
    describe('invalid input', () => {
      it('empty string', () => {
        expectErrors(
          new pc.AttributeConstraint('keyName', true, 'theType')
            .isAnId(),
          '',

          {
            name: 'keyName',
            type: 'theType',
            invalid: true,
            error: 'id'
          })
      })
      it('spaces', () => {
        expectErrors(
          new pc.AttributeConstraint('keyName', true, 'theType')
            .isAnId(),
          'a b',

          {
            name: 'keyName',
            type: 'theType',
            invalid: true,
            error: 'id'
          })
      })
      it('period', () => {
        expectErrors(
          new pc.AttributeConstraint('keyName', true, 'theType')
            .isAnId(),
          'a.b',

          {
            name: 'keyName',
            type: 'theType',
            invalid: true,
            error: 'id'
          })
      })
      it('slash', () => {
        expectErrors(
          new pc.AttributeConstraint('keyName', true, 'theType')
            .isAnId(),
          'a/b',

          {
            name: 'keyName',
            type: 'theType',
            invalid: true,
            error: 'id'
          })
      })
      it('{ brace', () => {
        expectErrors(
          new pc.AttributeConstraint('keyName', true, 'theType')
            .isAnId(),
          'a{b',

          {
            name: 'keyName',
            type: 'theType',
            invalid: true,
            error: 'id'
          })
      })
      it('} brace', () => {
        expectErrors(
          new pc.AttributeConstraint('keyName', true, 'theType')
            .isAnId(),
          'a}b',

          {
            name: 'keyName',
            type: 'theType',
            invalid: true,
            error: 'id'
          })
      })
      it('[ brace', () => {
        expectErrors(
          new pc.AttributeConstraint('keyName', true, 'theType')
            .isAnId(),
          'a[b',

          {
            name: 'keyName',
            type: 'theType',
            invalid: true,
            error: 'id'
          })
      })
      it('backslash', () => {
        expectErrors(
          new pc.AttributeConstraint('keyName', true, 'theType')
            .isAnId(),
          'a\\b',

          {
            name: 'keyName',
            type: 'theType',
            invalid: true,
            error: 'id'
          })
      })
    })
  })

  // TODO isInStringSet
  // TODO matchesOneOf
})

describe('ConstraintSet', () => {
  function runCs(cs: pc.ConstraintSet, value: any): { hasError: boolean, errors: ParsedError[] } {
    const err: ParsedError[] = []
    const ret = cs.runVerify(value, err)
    return { hasError: ret, errors: err }
  }


  describe('has', () => {
    it('valid - pass', () => {
      const res = runCs(new pc.ConstraintSet('name')
        .has('abc', _ => true),
        {})
      expect(res.hasError).toBe(false)
      expect(res.errors).toHaveLength(0)
    })
    it('invalid', () => {
      const res = runCs(new pc.ConstraintSet('name')
        .has('xyz', _ => false),
        {})
      expect(res.hasError).toBe(true)
      expect(res.errors).toHaveLength(1)
    })
  })


  describe('canHave', () => {
    describe('valid', () => {
      it('not present', () => {
        const res = runCs(new pc.ConstraintSet('name')
          .canHave('abc', 'a value', _ => true),
          {})
        expect(res.hasError).toBe(false)
        expect(res.errors).toHaveLength(0)
      })
      it('matches', () => {
        const res = runCs(new pc.ConstraintSet('name')
          .canHave('abc', 'a value', ac => ac.isANumber()),
          { abc: 1 })
        expect(res.hasError).toBe(false)
        expect(res.errors).toHaveLength(0)
      })
    })
    describe('invalid', () => {
      it('wrong type', () => {
        const res = runCs(new pc.ConstraintSet('name')
          .canHave('xyz', 'a value', ac => ac.isANumber()),
          { xyz: 'a string' })
        expect(res.hasError).toBe(true)
        expect(res.errors).toHaveLength(1)
      })
      it('wrong value', () => {
        const res = runCs(new pc.ConstraintSet('name')
          .canHave('xyz', 'a value', ac => ac.isNumberBetween(5, 6)),
          { xyz: 4 })
        expect(res.hasError).toBe(true)
        expect(res.errors).toHaveLength(1)
      })
    })
  })

  describe('asTypeBy', () => {
    describe('valid', () => {
      it('simple match', () => {
        const val: any = { t: 'x' }
        const res = runCs(new pc.ConstraintSet('name')
          .asTypeBy('t', { x: _ => { } }),
          val)
        expect(res.errors).toHaveLength(0)
        expect(res.hasError).toBe(false)
        expect(val).toHaveProperty(pc.SUBTYPE_SET_KEY)
        expect(val[pc.SUBTYPE_SET_KEY]).toEqual({ x: true })
      })
    })
    describe('invalid', () => {
      it('no match', () => {
        const val: any = { t: 'x' }
        const res = runCs(new pc.ConstraintSet('name')
          .asTypeBy('t', {}),
          val)
        expect(res.errors).toHaveLength(1)
        expect(res.hasError).toBe(true)
        expect(val[pc.SUBTYPE_SET_KEY]).not.toBeDefined()
      })
      it('internal match mixup', () => {
        const val: any = { t: 'x', v: -2 }
        const res = runCs(new pc.ConstraintSet('name')
          .asTypeBy('t', {
            x: cs => cs
              .mustHave('v', 'value', ac => ac
                .isNumberBetween(0, 10))
          }),
          val)
        expect(res.errors).toHaveLength(1)
        expect(res.hasError).toBe(true)
      })
    })
  })

  // TODO all the functions
})
