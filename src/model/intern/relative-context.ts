
import {
  Internal,
  InternContext,
  PATH_SEPARATOR,
  normalizeAbsolutePath,
  isRelativePath,
} from './base'

import {
  ATTRIBUTE_DATA_TYPE
} from './type-names'

/**
 * A sub-path aware context.
 */
export class RelativeContext implements InternContext {
  private readonly subPath: string

  constructor(
    private readonly parent: InternContext,
    subPath: string) {
    subPath = normalizeAbsolutePath(subPath)
    if (isRelativePath(subPath)) {
      throw new Error(`paths must be absolute; requested '${subPath}'`)
    }

    // Ensure the path ends with a slash.  This makes concatenation easy.
    // Due to the check above, we know that the length must be > 0.
    if (subPath[subPath.length - 1] !== PATH_SEPARATOR) {
      subPath += PATH_SEPARATOR
    }
    this.subPath = subPath
  }

  /*
  createChild(subPath: string): Context {
    if (subPath.length <= 0) {
      return this
    }
    if (subPath[0] === PATH_SEPARATOR) {
      return new RelativeContext(this.parent, subPath)
    }
    return new RelativeContext(this.parent, this.subPath + subPath)
  }
  */

  get<X, T extends Internal<X>>(relativePath: string, dataType: ATTRIBUTE_DATA_TYPE): T | undefined {
    if (relativePath.length <= 0) {
      return undefined
    }
    let path = relativePath
    if (relativePath[0] !== PATH_SEPARATOR) {
      path = this.subPath + relativePath
    }
    return this.parent.get(path, dataType)
  }
}
