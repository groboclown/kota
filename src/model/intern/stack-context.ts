
import { Internal, Context } from './base'

import { ATTRIBUTE_DATA_TYPE } from './type-names'

/**
 * A stack of contexts.
 */
export class StackContext implements Context {
  constructor(private readonly parents: Context[]) { }

  getInternal(path: string): Internal | undefined {
    for (var i = 0; i < this.parents.length; i++) {
      const v = this.parents[i].getInternal(path)
      if (v !== undefined) {
        return v
      }
    }
    return undefined
  }
}
