
import { ConstraintSet } from './parse-contraints'

/**
 * A group value is a single, disctinct name in a group.  For each group,
 * there can exist at most 1 group value.  Group values can include a mapping
 * of "how much" this group value maps onto other group values within the
 * same owning group.  Additionally, each group value has a path reference,
 * which refers to the owning value (one specific example is in roles, where
 * a role references a collection of child attributes).
 */

