
import {
  Internal,
  Context,
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
    // console.log(`DEBUG )) no split on ${path}; trying parent`)
    return this.defaultParent ? this.defaultParent.getInternal(path) : undefined
  }
}
