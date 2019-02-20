
import {
  Internal, Context, PATH_SEPARATOR, joinPaths
} from '../base'
import {
  PointerContext
} from '../pointer-context'
import * as tn from '../type-names'

// -------------------------------------------------------------------------
// The ContextReference forms a pointer to another location.  These should
// be used as a pointer in some rare cases (but it's currently being decided
// if those should be allowed).  Instead, they aid the creation of the
// PointerContext for the "current" values based on a story fragment.

export class ContextReference implements Internal {
  readonly type: tn.DATA_TYPE = tn.CONTEXT_REFERENCE_TYPE

  constructor(
    readonly referencePath: string
  ) { }
}


export function isContextReference(v: Internal): v is ContextReference {
  return v.type === tn.CONTEXT_REFERENCE_TYPE
}


/**
 * Creates a Context containing only values designated by the source path's keys.
 * All direct keys in the `sourcePath` which are `ContextReference` values are
 * created as pointers at the `destPath + key` location in the returned context.
 * The passed-in context values are not available through the returned context;
 * if you want to use them, then you need to add that and this returned context
 * to a `StackContext`.
 *
 * @param ctx
 * @param sourcePath
 * @param destPath
 */
export function createContextReferences(ctx: Context, sourcePath: string, destPath: string): Context {
  const ret = new PointerContext(ctx)
  ctx.keysFor(sourcePath).filter(path => !path.endsWith(PATH_SEPARATOR)).forEach(path => {
    const obj = ctx.getInternal(path)
    if (obj && isContextReference(obj)) {
      const p = path.lastIndexOf('/')
      if (p >= 0) {
        const pointerPath = joinPaths(destPath, path.substring(p + 1))
        console.log(`DEBUG: -$- adding pointer from ${pointerPath} -> ${obj.referencePath}`)
        ret.addPointer(pointerPath, obj.referencePath)
      }
    }
  })
  return ret
}
