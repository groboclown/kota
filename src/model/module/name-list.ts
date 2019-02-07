
import { ParsedError, ParsedInfo, ParseSrcKey, createParsedInfo } from './parse-info'
import { ConstraintSet } from './parse-contraints'

/**
 * A name list is a list of names stored with a module, usually not translated.
 * This has a special meaning with the code, because a name format takes a
 * number and crafts it so that it's within the size of the name list
 * (absolute value then modulo the name list length).  Name lists can be
 * added to by other modules.
 *
 * FIXME this is incorrectly implemented.  The lists of names should be
 * in the translation files.  The name-list is just a number used as an index
 * into the name list (modulo the translation's list length).
 */
export const NameListTypeConstraint: ConstraintSet = new ConstraintSet('name-list')
  .mustHave('name', 'string', ac => ac.isAString())
  .mustHave('values', 'string[]', ac => ac.isAnArrayOfStrings())


export const parseSrcAttribute: ParseSrcKey<NameListType> = (src: any): ParsedInfo<NameListType> => {
  const errors: ParsedError[] = []
  NameListTypeConstraint.runVerify(src, errors)
  return createParsedInfo(src, errors, 'name-list')
}

export interface NameListType {
  name: string
  values: string[]
}
