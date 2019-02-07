
import { ParsedError, ParsedInfo, ParseSrcKey, createParsedInfo } from './parse-info'
import { ConstraintSet, ConstraintTypeCheckFunction } from './parse-contraints'

export const MODULE_TYPE_NAME = 'module'

/**
 * Container for all the data that a module defines.
 */
export interface Module {
  readonly id: string
  readonly name: string
  // Stored in the file in "1.2.3" format, but will be parsed as an array of numbers.
  readonly version: string | number
  readonly authors: string[]
  readonly license: string[]
  readonly source: string
  readonly description: string

  /** Module id + " " + minimum version number. */
  readonly moduleDependencies: string[]

  /** map of global events to the corresponding handling file. */
  readonly hooks: { [key: string]: string }
}


export const ModuleConstraint: ConstraintSet = new ConstraintSet('module')
  .mustHave('id', 'id', ac => ac.isAnId())
  .mustHave('name', 'string', ac => ac.isAString())
  .mustHave('version', 'version', ac =>
    ac.isAn('id', <ConstraintTypeCheckFunction<string>>(v =>
      (typeof v === 'string'
        && /^\d+(\.\d+)*$/.test(v))
      || typeof v === 'number'))
  )
  .mustHave('authors', 'string', ac => ac.isAnArrayOfStrings(1))
  .mustHave('license', 'string', ac => ac.isAnArrayOfStrings(1))
  .mustHave('source', 'string', ac => ac.isAString())
  .mustHave('description', 'string', ac => ac.isAString())
  .canHave('moduleDependencies', 'list of id version', ac =>
    ac.isA('list of id version', <ConstraintTypeCheckFunction<any>>(v =>
      (v instanceof Array) && v.reduce(
        (prevValue, currentValue) =>
          prevValue
          && (
            typeof currentValue === 'string'

            // ID regex + ' ' + version number regex
            && /^[!@#\$%^&*_\-\+\<\>\~a-zA-Z0-9]+\s+\d+(\.\d+)*$/.test(currentValue)
          ),
        true)
    )))
  .canHave('hooks', 'dictionary', ac =>
    ac.has('string mapped to string', src =>
      (src instanceof Object) && Object.keys(src).reduce(
        (prevValue, currentKey) =>
          prevValue
          && (typeof (<any>src)[currentKey] === 'string')
        , true)
    ))


export const parseSrcModule: ParseSrcKey<Module> = (src: any): ParsedInfo<Module> => {
  const errors: ParsedError[] = []
  ModuleConstraint.runVerify(src, errors)
  return createParsedInfo(src, errors, 'module')
}
