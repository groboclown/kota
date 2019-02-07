
import {
  Internal, InternContext, normalizeAbsolutePath
} from './base'
import { ATTRIBUTE_DATA_TYPE } from './type-names'

/**
 * The loader function.  It takes a requested value path as an argument.  If the
 * path is supported, then it returns an array of the loaded context and the
 * parent path that should be used as the base of the returned context.
 * If the path is not supported, then it returns `undefined`.
 *
 * The returned context object must support the full path in the `get` call - that is,
 * if the loader returns a context for the path `/a/b/c` under the path `/a`, then
 * the context must return the value for `/a/b/c`.
 *
 * The loader is expected to return identical information for the same request path.
 * So, if it returns undefined for a path, it must always return undefined for that path.
 */
export type ContextPathLoader = (requestPath: string) => [string, InternContext] | undefined

/**
 * Supports a limited in-memory cache of data that is either complex to load,
 * or large and can be shifted out of memory without issue.  Items in this
 * path should be considered static.
 */
export class LazyContext implements InternContext {
  private readonly cache: [string, InternContext][] = []
  private readonly unsupported: { [key: string]: boolean } = {}
  constructor(private readonly loader: ContextPathLoader) { }

  get<X, T extends Internal<X>>(path: string, dataType: ATTRIBUTE_DATA_TYPE): T | undefined {
    // Check if the path is supported.  This is quick, so do it once.
    if (this.unsupported[path]) {
      return undefined
    }

    for (let i = 0; i < this.cache.length; i++) {
      const p = this.cache[i]
      if (path === p[0] || path.startsWith(p[0])) {
        return p[1].get(path, dataType)
      }
    }

    const v = this.loader(path)
    if (v === undefined) {
      this.unsupported[path] = true
      return undefined
    }

    // We know that this path isn't in our cache, so it's safe to
    // add it.
    this.cache.push([normalizeAbsolutePath(v[0]), v[1]])
    return v[1].get(path, dataType)
  }
}
