
import * as tv from '../type-value'


describe('date-delta-type', () => {
  describe('getDateFromEpoch', () => {
    describe('for old date', () => {
      it('increments across years', () => {
        const dd = new tv.DateDeltaInternal('/', 365 * 2)
        // 2000 was a leap year.
        // Javascript: month is 0 indexed.
        const epoch = new Date(1999, 11, 31)
        const res = tv.getDateFromEpoch(dd, new tv.DateInternal('/', epoch))
        expect(res.getDate()).toBe(30)
        expect(res.getMonth()).toBe(11)
        expect(res.getUTCFullYear()).toBe(2001)
      })
      it('decrements across years', () => {
        const dd = new tv.DateDeltaInternal('/', 365 * -2)
        const epoch = new Date(2001, 11, 30)
        const res = tv.getDateFromEpoch(dd, new tv.DateInternal('/', epoch))
        expect(res.getDate()).toBe(31)
        expect(res.getMonth()).toBe(11)
        expect(res.getUTCFullYear()).toBe(1999)
      })
    })
  })
})
