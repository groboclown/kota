
export * from './error'

// This is how we export each thing as essentially a sub-module.
// Requiring the end-user to import each one of these sub-files breaks
// the expected use of a distributed package by asking the end-user to
// dig into the file structure, which can lead to incorrect importing
// of essentially "protected" information.
// But it doesn't export types.  Crap.
export const files = require('./files')
export const log = require('./log')
export const treepath = require('./tree-path')
