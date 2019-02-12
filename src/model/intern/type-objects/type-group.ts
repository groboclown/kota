
import {
  Internal
} from '../base'
import * as tn from '../type-names'


// ---------------

export interface GroupValue {
  readonly name: string

  /** A mapping of other group values to the % matching to this group value.
   * Matching must be fuzzy (between 0 and 1 inclusive).
   */
  matches: { [name: string]: number }

  /**
   * Reference for the group value. Usually it's the parent path for a collection of attributes.
   */
  referencePath: string
}

// ---------------

// Group definitions are updated by adding modules.  They are never updated during play.
// So it has no explicit setter or getter for the internal values.

export class GroupDefinitionInternal implements Internal {
  public readonly type = tn.GROUP_DEFINITION
  public readonly values: { [name: string]: GroupValue } = {}
}

export function isGroupDefinitionInternal(v: Internal): v is GroupDefinitionInternal {
  return v.type === tn.GROUP_DEFINITION
}
