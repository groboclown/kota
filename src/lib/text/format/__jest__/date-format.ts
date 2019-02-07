
import { mkWeekMap, mkMonthMap, mkDateMap, mkDirectMap, MockLoc } from './loc-util'
import * as dt from '../date-format'
import { Context, BaseContext } from '../../../context'
import { CURRENT_FUNCTION_ARGUMENT_0_PATH } from '../../../core-paths'
import {
  Internal, DateInternal,
  StorageContext,
  ATTRIBUTE_NUMBER_TYPE
} from '../../../../model/intern'

const DF = new dt.FormatDate()

describe('date format replacements', () => {
  function mkCtx(arg: Date): Context {
    const d: { [key: string]: Internal<any> } = {
      [CURRENT_FUNCTION_ARGUMENT_0_PATH]: new DateInternal(arg)
    }
    return new BaseContext(new StorageContext(d))
  }
  describe('valid-two-digits', () => {
    const d = mkCtx(new Date(1790, 10, 21))
    it('no replacement', () => {
      const l10n = new MockLoc([])
      const res = DF.format(d, 'a%%b%dc', l10n)
      expect(res).toEqual({ text: 'a%b%dc' })
    })
    it('day', () => {
      const l10n = new MockLoc([mkDateMap('d', 'day', 'v', 31)])
      const res = DF.format(d, 'a%db%dc%%d', l10n)
      expect(res).toEqual({ text: 'av21bv21c%d' })
    })
    it('month', () => {
      const l10n = new MockLoc([mkMonthMap('m', 'x')])
      const res = DF.format(d, 'a%mb%mc%%m', l10n)
      expect(res).toEqual({ text: 'ax10bx10c%m' })
    })
    it('yr', () => {
      const l10n = new MockLoc([mkDirectMap('y', 'yr')])
      const res = DF.format(d, 'a%yb%yc%%y', l10n)
      expect(res).toEqual({ text: 'a90b90c%y' })
    })
    it('year', () => {
      const l10n = new MockLoc([mkDirectMap('Y', 'year')])
      const res = DF.format(d, 'a%Yb%Yc%%Y', l10n)
      expect(res).toEqual({ text: 'a1790b1790c%Y' })
    })
    it('week', () => {
      const l10n = new MockLoc([mkWeekMap('w', 'z')])
      const res = DF.format(d, 'a%wb%wc%%w', l10n)
      expect(res).toEqual({ text: 'az0bz0c%w' })
    })
    it('Mix', () => {
      // const d = new Date(1790, 10, 21)
      const l10n = new MockLoc([
        mkMonthMap('m', 'a'),
        mkMonthMap('M', 'b'),
        mkDateMap('d', 'day', 'c', 32),
        mkDateMap('D', 'day', 'd', 32),
        mkDirectMap('y', 'yr'),
        mkDirectMap('Y', 'year'),
        mkWeekMap('w', 'e'),
        mkWeekMap('W', 'f'),
      ])
      const res = DF.format(d, '%m/%d/%y and a %M/%D/%Y with %w%W', l10n)
      expect(res).toEqual({ text: 'a10/c21/90 and a b10/d21/1790 with e0f0' })
    })
  })
  describe('valid-one-digits', () => {
    const d = mkCtx(new Date(1790, 5, 9))
    it('no replacement', () => {
      const l10n = new MockLoc([])
      const res = DF.format(d, 'a%%b%dc', l10n)
      expect(res).toEqual({ text: 'a%b%dc' })
    })
    it('day', () => {
      const l10n = new MockLoc([mkDateMap('d', 'day', 'v', 31)])
      const res = DF.format(d, 'a%db%dc%%d', l10n)
      expect(res).toEqual({ text: 'av9bv9c%d' })
    })
    it('month', () => {
      const l10n = new MockLoc([mkMonthMap('m', 'x')])
      const res = DF.format(d, 'a%mb%mc%%m', l10n)
      expect(res).toEqual({ text: 'ax5bx5c%m' })
    })
    it('Mix', () => {
      // const d = new Date(1790, 10, 21)
      const l10n = new MockLoc([
        mkMonthMap('m', 'a'),
        mkMonthMap('M', 'b'),
        mkDateMap('d', 'day', 'c', 32),
        mkDateMap('D', 'day', 'd', 32),
        mkDirectMap('y', 'yr'),
        mkDirectMap('Y', 'year'),
        mkWeekMap('w', 'e'),
        mkWeekMap('W', 'f'),
      ])
      const res = DF.format(d, '%m/%d/%y and a %M/%D/%Y with %w%W', l10n)
      expect(res).toEqual({ text: 'a5/c9/90 and a b5/d9/1790 with e3f3' })
    })
  })

})
