
import { Internal, InternContext } from './base'

import { ATTRIBUTE_DATA_TYPE } from './type-names'

/**
 * A stack of contexts.
 */
export class StackContext implements InternContext {
  constructor(private readonly parents: InternContext[]) { }

  get<X, T extends Internal<X>>(path: string, dataType: ATTRIBUTE_DATA_TYPE): T | undefined {
    for (var i = 0; i < this.parents.length; i++) {
      const v = this.parents[i].get(path, dataType)
      if (v !== undefined) {
        return <T>v
      }
    }
    return undefined
  }
}
