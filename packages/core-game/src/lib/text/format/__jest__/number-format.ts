
import * as nb from '../number-format'
import { MockLoc } from './loc-util'
import { Context, Internal, NumberInternal } from '../../../context'
import { CURRENT_FUNCTION_ARGUMENT_0_PATH } from '../../../core-paths'
import {
  StorageContext
} from '../../../../model/intern'

const NB = new nb.FormatNumber()

describe('formatNumber', () => {
  const stdL10n = new MockLoc([])
  function mkCtx(arg: number): Context {
    const d: { [key: string]: Internal } = {
      [CURRENT_FUNCTION_ARGUMENT_0_PATH]: new NumberInternal('/p', arg)
    }
    return new StorageContext(d)
  }

  it('positive - no format', () => {
    // Remember: radix number mapping defaults to digitsLower, which in this
    // mocked-up locale is upper case with 0=>A, 1=>B, etc.
    expect(NB.format(mkCtx(123), '', stdL10n)).toEqual({ text: 'BCD' })
  })
  it('positive - upper-case radix', () => {
    // mocked-up locale has digitsUpper setup with lower case characters.
    expect(NB.format(mkCtx(123), 'R:10', stdL10n)).toEqual({ text: 'bcd' })
  })
  it('positive - no format, big number', () => {
    // mocked-up locale has digitsUpper setup with lower case characters.
    expect(NB.format(mkCtx(1234567890), '', stdL10n)).toEqual({ text: 'BCDEFGHIJA' })
  })
  it('positive - lower radix 16', () => {
    // mocked-up locale has digitsUpper setup with lower case characters.
    // 1234567890 in hex is 499602d2
    expect(NB.format(mkCtx(1234567890), 'r:16', stdL10n)).toEqual({ text: 'EJJGACNC' })
  })
  it('positive - upper radix 2', () => {
    // mocked-up locale has digitsUpper setup with lower case characters.
    // 1234567890 in binary is 1001001100101100000001011010010
    expect(NB.format(mkCtx(1234567890), 'R:2', stdL10n)).toEqual({ text: 'baabaabbaababbaaaaaaababbabaaba' })
  })

  // That's enough basic radix stuff.

  it('negative - no format', () => {
    expect(NB.format(mkCtx(-2), '', stdL10n)).toEqual({ text: '@C' })
  })
  it('positive - space', () => {
    expect(NB.format(mkCtx(2), '-', stdL10n)).toEqual({ text: ' C' })
  })
  it('positive - sign', () => {
    expect(NB.format(mkCtx(2), '+', stdL10n)).toEqual({ text: '^C' })
  })
  it('negative - parens', () => {
    expect(NB.format(mkCtx(-2), '(', stdL10n)).toEqual({ text: '(C)' })
  })
  it('positive - sign, space padding', () => {
    expect(NB.format(mkCtx(2), '+;b:3', stdL10n)).toEqual({ text: ' ^C' })
  })
  it('positive - sign, space padding, large', () => {
    expect(NB.format(mkCtx(123), '+;b:3', stdL10n)).toEqual({ text: '^BCD' })
  })
  it('negative - space padding', () => {
    expect(NB.format(mkCtx(-2), 'b:5', stdL10n)).toEqual({ text: '   @C' })
  })
  it('negative - parens, space padding', () => {
    // TODO for proper padding + parens, the padding should be INSIDE the
    // parens; so, this should look like '(   @C)', so that the parens do not
    // add to the width.  However, this makes proper padding of positive
    // numbers bad, so we're going with this.
    expect(NB.format(mkCtx(-2), '(;b:5', stdL10n)).toEqual({ text: '  (C)' })
  })
  it('negative - space padding, large', () => {
    expect(NB.format(mkCtx(-12345), 'b:3', stdL10n)).toEqual({ text: '@BCDEF' })
  })
  it('negative - parens, space padding, large', () => {
    expect(NB.format(mkCtx(-12345), '(;b:3', stdL10n)).toEqual({ text: '(BCDEF)' })
  })

  it('positive - zero padding', () => {
    expect(NB.format(mkCtx(2), '0:4;b:3', stdL10n)).toEqual({ text: 'AAAC' })
  })
  it('positive - sign, zero padding', () => {
    expect(NB.format(mkCtx(2), '+;0:4;b:3', stdL10n)).toEqual({ text: '^AAAC' })
  })
  it('positive - sign, zero padding, large', () => {
    expect(NB.format(mkCtx(12345), '+;0:4;b:3', stdL10n)).toEqual({ text: '^BCDEF' })
  })
  it('negative - zero padding', () => {
    expect(NB.format(mkCtx(-2), '0:4', stdL10n)).toEqual({ text: '@AAAC' })
  })
  it('negative - parens, zero padding', () => {
    // Note: for proper padding + parens, the padding should be INSIDE the
    // parens; so, this should look like '(    C)', so that the parens do not
    // add to the width.  However, this makes proper padding of positive
    // numbers bad or horribly complex, so we're going with this.
    expect(NB.format(mkCtx(-2), '(;0:4', stdL10n)).toEqual({ text: '(AAAC)' })
  })

  it('negative - parens, zero padding, space padding', () => {
    expect(NB.format(mkCtx(-2), '(;0:4;b:8', stdL10n)).toEqual({ text: '  (AAAC)' })
  })

  it('positive - parens, zero padding, space padding', () => {
    // This is where that padding note above comes into play.  If that form
    // of padding ('(   1)') is used, then this value should be `   AAAC `
    expect(NB.format(mkCtx(2), '(;0:4;b:8', stdL10n)).toEqual({ text: '    AAAC' })
  })


  it('simple commas', () => {
    // group separator = ?,
    // grouping-count = [4, 3, 2]
    expect(NB.format(mkCtx(1234567890), ',', stdL10n)).toEqual({ text: 'B?CD?EFG?HIJA' })
  })
})
