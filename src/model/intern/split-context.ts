
import {
  Internal,
  Context,
  normalizeAbsolutePath,
  PATH_SEPARATOR
} from './base'

/**
 * Stores sub-contexts in specific paths.  Allows for a fall-back parent
 * context as a grab-bag for everything else.
 *
 * This allows for different context types to share the same space.
 */
export class SplitContext implements Context {
  /** Each path in the list must end with a '/' */
  constructor(
    private readonly subs: { [path: string]: Context },
    private readonly defaultParent?: Context
  ) { }

  getInternal(path: string): Internal | undefined {
    // console.log(`DEBUG )) Checking split for [${path}]`)
    for (const key of Object.keys(this.subs)) {
      //console.log(`DEBUG )) trying prefix [${key}]`)
      if (path.startsWith(key)) {
        // Strip off the 'key' part, but leave the trailing '/'
        const subPath = path.substring(key.length - 1)
        // console.log(`DEBUG )) using [${key}] => [${subPath}]`)
        return this.subs[key].getInternal(subPath)
      }
    }
    console.log(`DEBUG )) no split on ${path}; trying parent`)
    return this.defaultParent ? this.defaultParent.getInternal(path) : undefined
  }

  keysFor(path: string): string[] {
    const keys: string[] = []
    const p = normalizeAbsolutePath(path, true)
    console.log(`DEBUG SplitContext finding keys for ${p}`)
    for (const key of Object.keys(this.subs)) {
      if (p.startsWith(key)) {
        const subKey = key.substring(0, key.length - 1)
        const subPath = p.substring(key.length - 1)
        return this.subs[key].keysFor(subPath).map(k => subKey + k)
      }
    }
    return this.defaultParent ? this.defaultParent.keysFor(path) : []
  }
}
