
import * as tn from './type-names'

export const PATH_SEPARATOR = '/'

/**
 * Basic definition for an internal representation of a module-loaded object.
 * The objects must be simple JSON data types, so that they can be easily
 * marshalled for persistence.
 */
export interface Internal {
  // One of the internal type names defined in `type-names.ts`.
  readonly type: tn.DATA_TYPE
}

/**
 * Basic tree-based discovery.
 */
export interface Context {
  /**
   * Fetches the data at the specific path.  This is only fetching absolute
   * paths.
   */
  getInternal(path: string): Internal | undefined

  // Looks up all the keys under the given path, but only that path (not sub-paths).
  // If there is a value '/a/b/c' and requests for keys under '/a', then '/a/b/' is
  // returned.  Keys which are paths are returned with the trailing '/'.
  // This will need to be used for data generation, but that will need to be
  // defined when we get there.  This is for "what kinds of 'x' exist?", but that
  // may be better handled through groups.
  keysFor(path: string): string[]
}

export function isAbsolutePath(path: string): boolean {
  return path.length > 0 && path[0] === PATH_SEPARATOR
}


export function isRelativePath(path: string): boolean {
  return path.length <= 0 || path[0] !== PATH_SEPARATOR
}


/**
 * Change the path so that it conforms to the standard path format.
 * The path can be either a relative or absolute path, and does not
 * end with a slash.
 */
export function normalizePath(path: string, includeTrailingSlash?: boolean): string {
  // Strip out all double slashes
  while (path.indexOf(PATH_SEPARATOR + PATH_SEPARATOR) >= 0) {
    path = path.replace(PATH_SEPARATOR + PATH_SEPARATOR, PATH_SEPARATOR)
  }
  if (!includeTrailingSlash) {
    if (path.length > 1 && path[path.length - 1] === PATH_SEPARATOR) {
      path = path.substring(0, path.length - 1)
    }
  } else if (path.length <= 0 || path[path.length - 1] !== PATH_SEPARATOR) {
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
 * Join the given paths into a single, normalized, absolute path.  If any
 * path in the list is absolute, it will instead be considered relative.
 */
export function joinRelativePaths(...paths: string[]): string {
  return normalizeAbsolutePath(paths.join(PATH_SEPARATOR))
}


/**
 * Join the given paths into a single, normalized, absolute path.  if a
 * path in the middle is absolute, it will become the new root.
 */
export function joinPaths(...paths: string[]): string {
  return normalizeAbsolutePath(paths.reduce((fullPath, currPath) =>
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
export function splitLast(path: string): [string, string] {
  path = normalizeAbsolutePath(path, false)
  const i = path.lastIndexOf(PATH_SEPARATOR) + 1
  if (i > 0) {
    return [path.substring(0, i), path.substring(i)]
  }
  return ['/', '']
}

/**
 * Strips the trailing slash off of a path.
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
