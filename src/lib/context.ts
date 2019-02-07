
import {
  InternContext,
  DATA_TYPE,
  StackContext
} from '../model/intern'
import { RelativeContext } from '../model/intern/relative-context'

export {
  PATH_SEPARATOR,
  ATTRIBUTE_DATA_TYPE,
  ATTRIBUTE_NUMBER_TYPE,
  ATTRIBUTE_GROUP_DEFINITION,
  ATTRIBUTE_INTERNAL_POINTER,
  ATTRIBUTE_NAME_LIST_TYPE,
  ATTRIBUTE_REFERENCE_DEFINITION,
  ATTRIBUTE_DATE_TYPE,
  ATTRIBUTE_FUNCTION_TYPE,
  ATTRIBUTE_FUZZ_TYPE,
  ATTRIBUTE_GROUP_TYPE,
  RANDOM_SOURCE_TYPE,
  VALUE_GROUP_SET_FOR,
  VALUE_CALCULATED,
  VALUE_DATE,
  VALUE_DATE_DELTA,
  VALUE_FUZZ,
  VALUE_NAME_LIST_ITEM,
  VALUE_NUMBER,
  DATA_TYPE,
  isAbsolutePath,
  isRelativePath,
  normalizePath,
  normalizeAbsolutePath,
  joinRelativePaths,
  joinPaths,
} from '../model/intern'
import {
  getInternValue
} from '../model/intern/intern-get-set'
import { HasErrorValue, hasErrorValue } from './error';


export function isContext(val: any): val is Context {
  return typeof (val['get']) === 'function'
    && typeof (val['createChild']) === 'function'
}

/**
 * The basic context type.
 */
export interface Context {
  /**
   * Fetches the data at the specific path.  Relative paths do not start
   * with a '/', and absolute paths do.
   */
  get<T>(path: string, dataType: DATA_TYPE): T | HasErrorValue | undefined

  /**
   * Create a child, session context where relative references are to the
   * given sub-path to the current path.
   */
  createChild(subPath: string): Context

  push(additionalData: InternContext): Context
}


export class BaseContext implements Context {
  constructor(private readonly parent: InternContext) { }

  get<T>(path: string, dataType: DATA_TYPE): T | HasErrorValue | undefined {
    const r = this.parent.get(path, dataType)
    if (r === undefined) {
      return undefined
    }
    // DEBUG
    // console.log(`data type value:`)
    // console.log(r)
    const ret = getInternValue(r, this.parent)
    if (hasErrorValue(ret)) {
      return ret
    }
    return <T>ret
  }

  createChild(subPath: string): Context {
    return new BaseContext(new RelativeContext(this.parent, subPath))
  }

  push(additionalData: InternContext): Context {
    return new BaseContext(new StackContext([additionalData, this.parent]))
  }
}
