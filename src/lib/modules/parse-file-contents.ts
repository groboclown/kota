
import {
  ParsedError
} from '../../model/module/parse-info'
import { coreError } from '../error'
import * as intern from '../../model/intern'
import * as module from '../../model/module'

export interface ParsedIntern<T> {
  readonly valid: boolean
  readonly errors: ParsedError[] | null
  readonly id: string | undefined
  readonly intern: intern.Internal | null
}

/**
 *
 * @param obj the module (raw) parsed data from the module file.
 * @returns the internal representation of that data object.
 */
export function parseFileObject(typeName: string, obj: any): ParsedIntern<any> {
  const f = module.OBJECT_PARSE_MAP[typeName]
  const id = obj.id
  const errors: ParsedError[] = []
  if (!id || id.length <= 0) {
    errors.push({
      attributeName: 'id',
      attributeType: 'string',
      missing: !id,
      invalid: id && id.length <= 0,
      srcValue: obj,
      violation: coreError('missing id field')
    })
  } else {
    // Remove it from the object, so it's not part of validation.
    delete obj.id
  }
  if (f) {
    const parsed = f(obj)
    if (parsed.valid) {
      return <ParsedIntern<any>>{
        id,
        intern: parsed.parsed,
        valid: true,
        errors: errors
      }
    } else {
      return <ParsedIntern<null>>{
        id,
        intern: null,
        valid: false,
        errors: errors.concat(parsed.errors)
      }
    }
  }
  return <ParsedIntern<null>>{
    id,
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
