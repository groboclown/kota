
import {
  Internal
} from '../base'
import { RandomSeed, seededRandom } from '../../../lib/math/seedrandom'
import * as tn from '../type-names'

// -------------------------------------------------------------------------
// The random source is a seed that generates random numbers.
// Note that this is NOT memoized, because every request returns a different value.
// Therefore, it cannot be a CalculatedIntern value.

export class RandomSource implements Internal {
  readonly type: tn.DATA_TYPE = tn.RANDOM_SOURCE_TYPE

  constructor(
    public seed: RandomSeed
  ) { }
}


export function isRandomSource(v: Internal): v is RandomSource {
  return v.type === tn.RANDOM_SOURCE_TYPE
}

export function getRandomSourceValue(v: RandomSource): number {
  // The random seed in the value will be updated with this random call
  return seededRandom(v.seed)
}
