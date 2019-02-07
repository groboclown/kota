
import {
  ParsedError
} from '../../model/module/parse-info'
import { coreError } from '../error'
import * as intern from '../../model/intern'
import * as module from '../../model/module'

export interface ParsedIntern<T> {
  readonly valid: boolean
  readonly errors: ParsedError[] | null
  readonly intern: intern.Internal<T> | null
}

/**
 *
 * @param obj the module (raw) parsed data from the module file.
 * @returns the internal representation of that data object.
 */
export function parseFileObject(typeName: string, obj: any): ParsedIntern<any> {
  const f = module.OBJECT_PARSE_MAP[typeName]
  if (f) {
    const parsed = f(obj)
    if (parsed.valid) {
      return <ParsedIntern<any>>{
        intern: parsed.parsed,
        valid: true,
        errors: null
      }
    } else {
      return <ParsedIntern<null>>{
        intern: null,
        valid: false,
        errors: parsed.errors
      }
    }
  }
  return <ParsedIntern<null>>{
    intern: null,
    valid: false,
    errors: [{
      attributeName: 'typeName',
      attributeType: typeName,
      missing: false,
      invalid: true,
      srcValue: obj,
      violation: coreError('unknown data type', { name: typeName })
    }]
  }
}
