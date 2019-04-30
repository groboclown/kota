
export const PATH_SEPARATOR = '/'

const DOUBLE_SEPARATOR = PATH_SEPARATOR + PATH_SEPARATOR

// Some of these functions are used EVERYWHERE, and so need to be
// extremely fast.  If they make assumptions about the input data, then those
// must be made explicitly clear.

export function isAbsolutePath(path: string): boolean {
  return path.length > 0 && path[0] === PATH_SEPARATOR
}

/**
 * Relative paths CANNOT be empty.
 * 
 * @param path path string to check
 */
export function isRelativePath(path: string): boolean {
  return path.length > 0 && path[0] !== PATH_SEPARATOR
}


/**
 * Change the path so that it conforms to the standard path format.
 * The path can be either a relative or absolute path, and does not
 * end with a slash.
 */
export function normalizePath(path: string, includeTrailingSlash?: boolean): string {
  // Strip out all double slashes
  while (path.indexOf(DOUBLE_SEPARATOR) >= 0) {
    path = path.replace(DOUBLE_SEPARATOR, PATH_SEPARATOR)
  }
  if (!includeTrailingSlash) {
    // Explicit check for path length > 1.  If it's == 0, then we don't need to worry
    // about this.  If it's == 1, then there's a chance it's the root path, and
    // for root paths we DO NOT want to remove that path separators.  Then for all other
    // cases (length > 1), there's a chance we can remove it.
    if (path.length > 1 && path[path.length - 1] === PATH_SEPARATOR) {
      path = path.substring(0, path.length - 1)
    }
  } else if (path !== PATH_SEPARATOR && path.length > 0 && path[path.length - 1] !== PATH_SEPARATOR) {
    // If the path is empty, then it is explicitly NOT the root path (it's also not a relative
    // path, but that's not the point), so adding a trailing slash would make it change from
    // a non-absolute path to an absolute path.  That's why we explicitly require the
    // path.length to be greater than 0 for this.  Additionally, if the path is the root
    // path, then this would become a double slash, so we need a check for that.
    path += PATH_SEPARATOR
  }
  return path
}


/**
 * Ensures that the returned path is normalized and absolute.  The path
 * will be forced to have a leading slash.
 */
export function normalizeAbsolutePath(path: string, includeTrailingSlash?: boolean): string {
  path = normalizePath(path, includeTrailingSlash)
  if (path.length <= 0 || path[0] !== PATH_SEPARATOR) {
    path = PATH_SEPARATOR + path
  }
  return path
}


/**
 * Join the given paths into a single, normalized path.  If any
 * path in the list is absolute, it will instead be considered relative
 * as though the leading slash was stripped off.
 */
export function joinRelativePaths(...paths: string[]): string {
  return normalizePath(paths.join(PATH_SEPARATOR))
}

/**
 * Join the given paths into a single, normalized path.  if a
 * path in the middle is absolute, it will become the new root.
 * Unless at least one path is absolute, then the returned path is
 * relative.
 */
export function joinPaths(...paths: string[]): string {
  return joinPathArray(paths)
}

export function joinPathArray(paths: string[]): string {
  if (paths.length <= 0) {
    return ''
  }
  return normalizePath(paths.reduce((fullPath, currPath) =>
    (currPath.length > 0 && currPath[0] === PATH_SEPARATOR)
      ? currPath
      : (fullPath + PATH_SEPARATOR + currPath)))
}


/**
 * Split the last part of the path (after the /) from everything before it.
 * For the root tree case, it returns `['/', '']`.  The first path value
 * will always end in a trailing slash.
 * 
 * @param path 
 */
export function absoluteSplitLast(path: string): [string, string] {
  // Because the path is normalized as an absolute path, the
  // path will always end up with a leading slash, so i is
  // always > 0.
  path = normalizeAbsolutePath(path, false)
  const i = path.lastIndexOf(PATH_SEPARATOR) + 1
  return [path.substring(0, i), path.substring(i)]
}

/**
 * Strips the trailing slash off of a path.
 * 
 * DOES NOT PERFORM NORMALIZATION OR OTHER OPERATIONS ON THE STRING.
 * 
 * @param path 
 */
export function stripTrailingSlash(path: string): string {
  let last = path.length - 1
  while (last > 1 && path[last] === PATH_SEPARATOR) {
    last--
  }
  return path.substring(0, last + 1)
}
