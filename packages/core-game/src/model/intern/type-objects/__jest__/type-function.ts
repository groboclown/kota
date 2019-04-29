import * as itr from '../..'
import * as fn from '../type-function'


describe('runCalculation', () => {
  function mkFn(expr: itr.FunctionExpression): itr.FunctionAttribute {
    return new itr.FunctionAttribute({}, itr.VALUE_FUZZ, itr.VALUE_FUZZ, -2000, 2000, expr)
  }

  describe('valid setup', () => {
    describe('single constant', () => {
      it('spits out correct value', () => {
        const f = mkFn([
          [itr.FUNCTION_EXPRESSION_TYPE_CONST, 5]
        ])
        const res = fn.runCalculation(f, {})
        expect(res).toBe(5)
      })
    })
    describe('single variable', () => {
      it('generates correct value', () => {
        const f = mkFn([
          [itr.FUNCTION_EXPRESSION_TYPE_VAR, 'a']
        ])
        const res = fn.runCalculation(f, { a: 5 })
        expect(res).toBe(5)
      })
    })
    describe('constant function', () => {
      it('generates correct value', () => {
        const f = mkFn([
          [itr.FUNCTION_EXPRESSION_TYPE_OPERATION, 'pi']
        ])
        const res = fn.runCalculation(f, {})
        expect(res).toBe(Math.PI)
      })
    })
  })

  describe('simple math - binary operators', () => {
    describe('addition', () => {
      it('generates the correct value', () => {
        const f = mkFn([
          [itr.FUNCTION_EXPRESSION_TYPE_CONST, 7],
          [itr.FUNCTION_EXPRESSION_TYPE_CONST, 3],
          [itr.FUNCTION_EXPRESSION_TYPE_OPERATION, '+']
        ])
        const res = fn.runCalculation(f, {})
        expect(res).toBe(7 + 3)
      })
    })
    describe('subtraction', () => {
      it('generates the correct value', () => {
        const f = mkFn([
          [itr.FUNCTION_EXPRESSION_TYPE_CONST, 7],
          [itr.FUNCTION_EXPRESSION_TYPE_CONST, 3],
          [itr.FUNCTION_EXPRESSION_TYPE_OPERATION, '-']
        ])
        const res = fn.runCalculation(f, {})
        expect(res).toBe(7 - 3)
      })
    })
    describe('multiplication', () => {
      it('generates the correct value', () => {
        const f = mkFn([
          [itr.FUNCTION_EXPRESSION_TYPE_CONST, 7],
          [itr.FUNCTION_EXPRESSION_TYPE_CONST, 3],
          [itr.FUNCTION_EXPRESSION_TYPE_OPERATION, '*']
        ])
        const res = fn.runCalculation(f, {})
        expect(res).toBe(7 * 3)
      })
    })
    describe('division', () => {
      it('generates the correct value', () => {
        const f = mkFn([
          [itr.FUNCTION_EXPRESSION_TYPE_CONST, 7],
          [itr.FUNCTION_EXPRESSION_TYPE_CONST, 3],
          [itr.FUNCTION_EXPRESSION_TYPE_OPERATION, '/']
        ])
        const res = fn.runCalculation(f, {})
        expect(res).toBe(7 / 3)
      })
    })
  })

  describe('simple math - unary operators', () => {
    describe('negate', () => {
      it('generates the correct value', () => {
        const f = mkFn([
          [itr.FUNCTION_EXPRESSION_TYPE_CONST, 7],
          [itr.FUNCTION_EXPRESSION_TYPE_OPERATION, 'neg']
        ])
        const res = fn.runCalculation(f, {})
        expect(res).toBe(-7)
      })
    })
    describe('inverse', () => {
      it('generates the correct value', () => {
        const f = mkFn([
          [itr.FUNCTION_EXPRESSION_TYPE_CONST, 7],
          [itr.FUNCTION_EXPRESSION_TYPE_OPERATION, 'inv']
        ])
        const res = fn.runCalculation(f, {})
        expect(res).toBe(1 / 7)
      })
    })
    describe('arc tangent', () => {
      it('generates the correct value', () => {
        const f = mkFn([
          [itr.FUNCTION_EXPRESSION_TYPE_CONST, 7],
          [itr.FUNCTION_EXPRESSION_TYPE_OPERATION, 'atan']
        ])
        const res = fn.runCalculation(f, {})
        expect(res).toBe(Math.atan(7))
      })
    })
  })

  describe('deep math', () => {
    describe('embeded calculation', () => {
      it('unary + binary generates the correct value', () => {
        const f = mkFn([
          [itr.FUNCTION_EXPRESSION_TYPE_CONST, 8],
          [itr.FUNCTION_EXPRESSION_TYPE_CONST, 7],
          [itr.FUNCTION_EXPRESSION_TYPE_OPERATION, 'neg'],
          [itr.FUNCTION_EXPRESSION_TYPE_OPERATION, '+'],
        ])
        const res = fn.runCalculation(f, {})
        expect(res).toBe(1)
      })
      it('deep binary tree generates the correct value', () => {
        const f = mkFn([
          [itr.FUNCTION_EXPRESSION_TYPE_CONST, 8],
          [itr.FUNCTION_EXPRESSION_TYPE_CONST, 7],
          [itr.FUNCTION_EXPRESSION_TYPE_CONST, 6],
          [itr.FUNCTION_EXPRESSION_TYPE_CONST, 5],
          [itr.FUNCTION_EXPRESSION_TYPE_CONST, 4],
          [itr.FUNCTION_EXPRESSION_TYPE_CONST, 3],
          [itr.FUNCTION_EXPRESSION_TYPE_CONST, 2],
          [itr.FUNCTION_EXPRESSION_TYPE_OPERATION, '+'],
          [itr.FUNCTION_EXPRESSION_TYPE_OPERATION, '*'],
          [itr.FUNCTION_EXPRESSION_TYPE_OPERATION, '+'],
          [itr.FUNCTION_EXPRESSION_TYPE_OPERATION, '*'],
          [itr.FUNCTION_EXPRESSION_TYPE_OPERATION, '+'],
          [itr.FUNCTION_EXPRESSION_TYPE_OPERATION, '*'],
        ])
        const res = fn.runCalculation(f, {})
        expect(res).toBe(((((((3 + 2) * 4) + 5) * 6) + 7) * 8))
      })
    })
  })

  describe('bounding range', () => {
    it('is limited to top range', () => {
      const f = mkFn([
        [itr.FUNCTION_EXPRESSION_TYPE_CONST, 1000],
        [itr.FUNCTION_EXPRESSION_TYPE_CONST, 1000],
        [itr.FUNCTION_EXPRESSION_TYPE_OPERATION, '*']
      ])
      const res = fn.runCalculation(f, {})
      // range bounded to 2000 in the upper side.
      expect(res).toBe(2000)
    })
    it('is limited to bottom range', () => {
      const f = mkFn([
        [itr.FUNCTION_EXPRESSION_TYPE_CONST, -1000],
        [itr.FUNCTION_EXPRESSION_TYPE_CONST, 1000],
        [itr.FUNCTION_EXPRESSION_TYPE_OPERATION, '*']
      ])
      const res = fn.runCalculation(f, {})
      // range bounded to -2000 in the lower side.
      expect(res).toBe(-2000)
    })
  })
})
