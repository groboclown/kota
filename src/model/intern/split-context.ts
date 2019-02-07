
import {
  Internal,
  InternContext,
} from './base'

import {
  ATTRIBUTE_DATA_TYPE
} from './type-names'

/**
 * Stores sub-contexts in specific paths.  Allows for a fall-back parent
 * context as a grab-bag for everything else.
 *
 * This allows for different context types to share the same space.
 */
export class SplitContext implements InternContext {
  /** Each path in the list must end with a '/' */
  constructor(
    private readonly subs: { [path: string]: InternContext },
    private readonly defaultParent?: InternContext
  ) { }

  get<X, T extends Internal<X>>(path: string, dataType: ATTRIBUTE_DATA_TYPE): T | undefined {
    for (const key of Object.keys(this.subs)) {
      if (path.startsWith(key)) {
        // Strip off the 'key' part, but leave the trailing '/'
        const subPath = path.substring(key.length - 1)
        return this.subs[key].get(subPath, dataType)
      }
    }
    return this.defaultParent ? this.defaultParent.get(path, dataType) : undefined
  }
}
