
export * from './parse'

// A forceful way to create modules.
// Using "import" as a function returns a promise, and "require" is in-line.


import * as c from './core'
export namespace paths {
  export const core = c.core
  export const parts = c.parts
}
