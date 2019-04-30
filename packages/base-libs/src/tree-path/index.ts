
export * from './parse'

// A forceful way to create modules.
// Using "import" as a function returns a promise, and "require" is in-line.
export const core = require('./core')
export const conventions = require('./conventions')
