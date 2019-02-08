
import {
  Internal,
  InternContext,
  PATH_SEPARATOR,
  normalizeAbsolutePath,
} from './base'
import { RelativeContext } from './relative-context'

import {
  ATTRIBUTE_DATA_TYPE
} from './type-names'

/**
 * Allows for storing data pointers from one path into another path of the
 * parent context.  A pointer source and destination must either be an exact
 * match, or a full path match, so no weird partial pointers will work,
 * like having a pointer from "/a/b" to "/a/c" allow for mapping
 * "/a/bat" to "a/cat".
 * Part of the logic here is that pointers to the root ('/') will not
 * work.  Pointers to pointers will also not work.
 *
 * Additionally, this will only return pointers, and not propigate
 * requests up to the parent.
 */
export class PointerContext implements InternContext {
  private readonly pointers: [string, string, string, string][] = []
  constructor(private readonly parent: InternContext) { }

  addPointer(srcPath: string, targetPath: string): PointerContext {
    srcPath = normalizeAbsolutePath(srcPath)
    targetPath = normalizeAbsolutePath(targetPath)
    this.pointers.push([
      srcPath,
      targetPath,
      srcPath + PATH_SEPARATOR,
      targetPath + PATH_SEPARATOR
    ])
    return this
  }

  get<X, T extends Internal<X>>(path: string, dataType: ATTRIBUTE_DATA_TYPE): T | undefined {
    for (let i = 0; i < this.pointers.length; i++) {
      const p = this.pointers[i]
      if (path === p[0]) {
        return this.parent.get(p[1], dataType)
      }
      if (path.startsWith(p[2])) {
        // replace the "key" part of the path (which is at the start)
        // with the pointer path.
        return this.parent.get(
          p[3] + path.substring(p[2].length),
          dataType
        )
      }
    }
    // Do not push up to parent.
    // return this.parent.get(path, dataType)
    return undefined
  }
}
