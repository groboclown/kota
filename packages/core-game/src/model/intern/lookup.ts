
import {
  PATH_SEPARATOR,
  Context,
  Internal,
  stripTrailingSlash,
  splitLast,
  joinPaths,
} from './base'
import {
  HasErrorValue,
  hasErrorValue,
  coreError,
} from '../../lib/error'
import {
  isContextReference,
  isGroupSetInternal,
  getGroupSetValue,
  pickGroupValueFromSet,
} from './type-objects';

/**
 * Looks up a value from a path for the context.  It will climb backwards
 * through the path parents until it finds values, looking for group or
 * context pointers.
 * 
 * An error is returned if the underlying pointer definitions are invalid.
 * 
 * Returns `[discovered value, final path to discovered value, history of path pointers]`
 * 
 * @path a normalized absolute path.
 */
export function lookupInternal(
  ctx: Context,
  path: string,
  maxIndirection: number
): [Internal | undefined | HasErrorValue, string, string[]] {
  const pathHistory: string[] = []

  let current = path
  while (true) {
    // Check for path problems.
    if (pathHistory.indexOf(current) >= 0) {
      return [{
        error: coreError('cyclic path pointer', { path: path, cycle: current })
      }, current, pathHistory]
    }

    pathHistory.push(current)
    if (pathHistory.length > maxIndirection) {
      return [{
        error: coreError('too many path indirections', { path: path, depth: maxIndirection })
      }, current, pathHistory]
    }

    const ref = find_element(ctx, current)
    if (!ref[0]) {
      return [undefined, current, pathHistory]
    }

    // Find if the referenced object is a pointer.
    const base = find_ref_path(ctx, ref[0], current)
    if (hasErrorValue(base)) {
      return [base, current, pathHistory]
    }
    if (base === undefined) {
      // It was not a pointer.
      if (ref[1].length <= 0) {
        // No remaining path to parse, so just return the
        // discovered value.
        return [ref[0], current, pathHistory]
      }
      // There was path left over, which means there was an
      // expectation for a pointer.  But the value was not a pointer.
      return [undefined, current, pathHistory]
    }

    // The value was a pointer to path `base`.
    // Loop around with the new path.
    if (ref[1].length <= 0) {
      current = base
    } else {
      current = joinPaths(base, ref[1])
    }
  }
}


function find_element(ctx: Context, path: string): [Internal | undefined, string] {
  let value = ctx.getInternal(path)
  let base = path
  let rest = ''
  while (value === undefined && base.length > 1) {
    const parts = splitLast(base)
    base = stripTrailingSlash(parts[0])
    rest = parts[1] + PATH_SEPARATOR + rest
    // console.log(`DEBUG: -+- ::=   looking to ${base}`)
    value = ctx.getInternal(base)
  }
  return [value, rest]
}


function find_ref_path(ctx: Context, value: Internal, path: string): string | HasErrorValue | undefined {
  if (isContextReference(value)) {
    return value.referencePath
  } else if (isGroupSetInternal(value)) {
    // Follow the group value's reference.  There may be 0 or more
    // entries in the group value, but we only care about the first.
    const groupValSet = getGroupSetValue(value, ctx)
    if (hasErrorValue(groupValSet)) {
      return groupValSet
    }
    const groupValue = pickGroupValueFromSet(groupValSet, ctx)
    if (groupValue === undefined) {
      return { error: coreError('empty group value set', { path }) }
    }
    return groupValue.referencePath
  }
  return undefined
}
