
import {
  Internal,
  Context,
  PATH_SEPARATOR,
  normalizeAbsolutePath,
  isRelativePath,
} from './base'

/**
 * A sub-path aware context.
 *
 * TODO Is this needed anymore?
 */
export class RelativeContext implements Context {
  private readonly subPath: string

  constructor(
    private readonly parent: Context,
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

  getInternal(relativePath: string): Internal | undefined {
    if (relativePath.length <= 0) {
      return undefined
    }
    let path = relativePath
    if (relativePath[0] !== PATH_SEPARATOR) {
      path = this.subPath + relativePath
    }
    return this.parent.getInternal(path)
  }
}
