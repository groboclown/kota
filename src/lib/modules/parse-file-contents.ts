
import {
  ParsedError
} from '../../model/module/parse-info'
import { coreError } from '../error'
import * as intern from '../../model/intern'
import * as moduleModel from '../../model/module'

/**
 *
 * @param obj the module (raw) parsed data from the module file.
 * @returns the internal representation of that data object.
 */
export function parseFileObject(typeName: string, obj: any): moduleModel.ParsedInfo<any> {
  const f = moduleModel.OBJECT_PARSE_MAP[typeName]
  const errors: ParsedError[] = []
  if (f) {
    return f(obj)
  }
  return <moduleModel.ParsedInfo<null>>{
    type: typeName,
    srcValue: obj,
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
