
/**
 * Constant value declarations in the module tree.
 */

// References a localization entry.
export const CONSTANT_LOCALIZED = 'l10n'
export type CONSTANT_LOCALIZED = 'l10n'

// A specific numeric value, can be any number, really.
// This allows for encoding in the tree magic numbers,
// such as the gravitational constant of the universe.
export const CONSTANT_NUMBER = 'constant'
export type CONSTANT_NUMBER = 'constant'

export interface ConstantLocalized {
  readonly domain: string
  readonly msgid: string
}

export interface ConstantNumber {
  readonly value: number
}
