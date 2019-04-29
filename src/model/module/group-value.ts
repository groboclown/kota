
import { ParsedError, ParsedInfo, ParseSrcKey, createParsedInfo } from './parse-info'
import { ConstraintSet, ConstraintTypeCheckFunction } from './parse-contraints'

/**
 * A group value is a single, disctinct name in a group.  For each group,
 * there can exist at most 1 group value with that name.  Group values can include a mapping
 * of "how much" this group value maps onto other group values within the
 * same owning group.  Additionally, each group value has a path reference,
 * which refers to the owning value (one specific example is in roles, where
 * a role references a collection of child attributes).
 * 
 * Because this doesn't translate directly to an Internal object,
 */

export const GROUP_VALUE_TYPE_NAME = 'group-value'

export const LocalizationTypeConstraint: ConstraintSet = new ConstraintSet('localization')
  .canHave('group', 'string', ac => ac.isAString())
  .mustHave('locale', 'string', ac => ac.isAString())
