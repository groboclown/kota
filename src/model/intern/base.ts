
import * as tn from './type-names'

export const PATH_SEPARATOR = '/'

/**
 * Basic definition for an internal representation of a module-loaded object.
 * The objects must be simple JSON data types, so that they can be easily
 * marshalled for persistence.
 *
 * The type parameter (`T`) represents the value type used in the get and
 * set value, not necessarily the inner data type.
 */
export interface Internal<T> {
  // One of the internal type names defined in `type-names.ts`.
  readonly type: tn.DATA_TYPE
}

/**
 * Basic tree-based discovery.
 */
export interface InternContext {
  /**
   * Fetches the data at the specific path.  Relative paths do not start
   * with a '/', and absolute paths do.
   */
  get<X, T extends Internal<X>>(path: string, dataType: tn.DATA_TYPE): T | undefined
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
export function normalizePath(path: string): string {
  // Strip out all double slashes
  while (path.indexOf(PATH_SEPARATOR + PATH_SEPARATOR) >= 0) {
    path = path.replace(PATH_SEPARATOR + PATH_SEPARATOR, PATH_SEPARATOR)
  }
  if (path.length > 1 && path[path.length - 1] === PATH_SEPARATOR) {
    path = path.substring(0, path.length - 1)
  }
  return path
}


/**
 * Ensures that the returned path is normalized and absolute.  The path
 * will be forced to have a leading slash.
 */
export function normalizeAbsolutePath(path: string): string {
  path = normalizePath(path)
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