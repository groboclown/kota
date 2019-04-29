
/**
 * Defines the list of operations that should be performed when installing the
 * module.  It will modify or augment the existing instance data.
 */
import { ParsedError, ParsedInfo, ParseSrcKey, createParsedInfo } from './parse-info'
import { ConstraintSet, ConstraintTypeCheckFunction } from './parse-contraints'

export const INSTALL_TYPE_NAME = 'install'

export const InstallTypeConstraint: ConstraintSet = new ConstraintSet('localization')
  .canHave('attach-value', 'AttachValue[]', ac => ac.isAnArrayWith('AttachValue', csf => csf
    .mustHave('name', 'string', acf => acf.isAString())
    .mustHave('owner', 'absolute path', acf => acf.isAString())
    .mustHave('type', 'value type', acf => acf.isAString())
    .canHave('value', 'matching type value', acf => true)))

export const parseSrcAttribute: ParseSrcKey<InstallType> = (src: any): ParsedInfo<InstallType> => {
  const errors: ParsedError[] = []
  InstallTypeConstraint.runVerify(src, errors)
  return createParsedInfo(src, errors, INSTALL_TYPE_NAME)
}

export interface InstallType {
  'attach-value': AttachValue[]
}

export interface AttachValue {
  name: string
  owner: string
  type: string
  value?: any
}
