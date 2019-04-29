/*
Taken from:
https://raw.githubusercontent.com/davidbau/seedrandom/released/seedrandom.js

Original copyright:

Copyright 2014 David Bau.

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// In order to maintain the JSON-serialization capability of the data types,
// the random seed is maintained in a very simple array.


const width = 256        // each RC4 output is 0 <= x < 256
const chunks = 6         // at least six RC4 outputs for each double
const digits = 52        // there are 52 significant digits in a double
const startdenom = Math.pow(width, chunks)
const significance = Math.pow(2, digits)
const overflow = significance * 2
const mask = width - 1

export type RandomSeed = number[]

export function createInitialRandomSeed(): RandomSeed {
  // i and j are the first two in the array.
  const ret: number[] = [0, 0]

  // initialize with not good but okay standard random numbers.
  for (let i = 0; i < width; i++) {
    ret.push(mask & (Math.floor(Math.random() * significance)))
  }

  return ret
}

// Seed values MUST be within the right range, or the random generator
// will produce numbers outside the expected range.
export function normalizeRandomSeed(seed: RandomSeed): void {
  for (let i = 0; i < seed.length; i++) {
    seed[i] = seed[i] & mask
  }
}

/**
 * Returns the next random number, within [0, 1).  The seed object
 * is updated with the new seed value.
 *
 * @param seed
 */
export function seededRandom(seed: RandomSeed): number {
  // This function returns a random double in [0, 1) that contains
  // randomness in every bit of the mantissa of the IEEE 754 value.
  let n = arc4Generator(chunks, seed)     // Start with a numerator n < 2 ^ 48
  let d = startdenom                      //   and denominator d = 2 ^ 48.
  let x = 0                               //   and no 'extra last byte'.
  while (n < significance) {              // Fill up all significant digits by
    n = (n + x) * width                   //   shifting numerator and
    d *= width                            //   denominator and generating a
    x = arc4Generator(1, seed)            //   new least-significant-byte.
  }
  while (n >= overflow) {                 // To avoid rounding up, before adding
    n /= 2;                               //   last byte, shift everything
    d /= 2;                               //   right using integer math until
    x >>>= 1;                             //   we have exactly the desired bits.
  }
  return (n + x) / d                     // Form the number within [0, 1).
}


// The "g" method returns the next (count) outputs as one number.
function arc4Generator(count: number, seed: RandomSeed): number {
  var t, r = 0,
    i = seed[0], j = seed[1], k
  for (let z = 0; z < count; z++) {
    i = mask & (i + 1)
    t = seed[2 + i]
    j = mask & (j + t)
    k = seed[j + 2]
    seed[i + 2] = k
    seed[j + 2] = t
    r = r * width + seed[mask & (t + k)]
  }
  seed[0] = i
  seed[1] = j
  return r
  // For robust unpredictability, the function call below automatically
  // discards an initial batch of values.  This is called RC4-drop[256].
  // See http://google.com/search?q=rsa+fluhrer+response&btnI
}
