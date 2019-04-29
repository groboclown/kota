import * as rd from '../seedrandom'

describe('seedrandom', () => {
  describe('createInitialRandomSeed', () => {
    it('generates a long random seed of integers', () => {
      const res = rd.createInitialRandomSeed()
      expect(res).toHaveLength(256 + 2)
      res.forEach(x => {
        expect(Math.floor(x) - x).toBe(0)
      })
    })
  })

  describe('seededRandom', () => {
    it('generates the same random value for the same seed value', () => {
      const seed1 = []
      const seed2 = []
      for (let i = 0; i < 256 + 2; i++) {
        seed1.push(0)
        seed2.push(0)
      }
      const r1 = rd.seededRandom(seed1)
      const r2 = rd.seededRandom(seed2)
      expect(r1).toBe(r2)
      expect(seed1).toEqual(seed2)
    })

    it('multiple executions generate different numbers in [0, 1)', () => {
      const found: { [key: string]: boolean } = {}
      const seed = rd.createInitialRandomSeed()
      // Over 10000 iterations, we shouldn't see the same floating point number appear.
      for (let i = 0; i < 1000; i++) {
        const res = rd.seededRandom(seed)
        expect(res).toBeGreaterThanOrEqual(0)
        expect(res).toBeLessThan(1)
        const rs = String(res)
        expect(found[rs]).toBeFalsy()
        found[rs] = true
      }
    })
  })
})
