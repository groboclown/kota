
import {
  Internal,
  Context,
  PATH_SEPARATOR,
  normalizeAbsolutePath,
} from './base'

import { createLogger } from '../../lib/log'

const LOG = createLogger('model.pointer-context')


/**
 * Allows for storing data pointers from one path into another path of the
 * parent context.  A pointer source and destination must either be an exact
 * match, or a full path match, so no weird partial pointers will work,
 * like having a pointer from "/a/b" to "/a/c" allow for mapping
 * "/a/bat" to "a/cat".
 * Part of the logic here is that pointers to the root ('/') will not
 * work.  Pointers to pointers will also not work.
 *
 * Additionally, this will only return pointers, and not propigate
 * requests up to the parent.
 */
export class PointerContext implements Context {
  private readonly pointers: [string, string, string, string][] = []
  constructor(private readonly parent: Context) { }

  addPointer(srcPath: string, targetPath: string): PointerContext {
    srcPath = normalizeAbsolutePath(srcPath)
    targetPath = normalizeAbsolutePath(targetPath)
    this.pointers.push([
      srcPath,
      targetPath,
      srcPath + PATH_SEPARATOR,
      targetPath + PATH_SEPARATOR
    ])
    return this
  }

  getInternal(path: string): Internal | undefined {
    LOG.debug('++ checking [', path, ']')
    for (let i = 0; i < this.pointers.length; i++) {
      const p = this.pointers[i]
      if (path === p[0]) {
        LOG.ifDebug(() => { return ['++ mapped ', path, ' => ', p[1], '==', this.parent.getInternal(p[1])] })
        return this.parent.getInternal(p[1])
      }
      if (path.startsWith(p[2])) {
        // replace the "key" part of the path (which is at the start)
        // with the pointer path.
        const dest: string = p[3] + path.substring(p[2].length)
        LOG.ifDebug(() => { return ['++ mapped2 ', path, ' => ', dest, '==', this.parent.getInternal(dest)] })
        return this.parent.getInternal(dest)
      }
    }
    // Do not push up to parent.
    LOG.debug('++ no pointer matching', path)
    return undefined
  }

  keysFor(path: string): string[] {
    const searchPath = normalizeAbsolutePath(path, true)
    LOG.debug('++ PointerContext getting keys for', searchPath)
    const keys: { [key: string]: boolean } = {}
    for (let i = 0; i < this.pointers.length; i++) {
      const p = this.pointers[i]
      LOG.debug('++ checking', p[2], '->', p[3])
      // Exact pointer match doesn't make sense here, because it doesn't have sub-keys.
      if (searchPath.startsWith(p[2])) {
        // replace the "key" part of the path (which is at the start)
        // with the pointer path.
        const searchPrefix = searchPath.substring(p[2].length)
        const dest: string = p[3] + searchPrefix
        LOG.debug('++', searchPath, '->', dest)
        this.parent.keysFor(dest).forEach(k => {
          const key = searchPrefix + k.substring(p[3].length)
          LOG.debug('++', dest, '>>', k, '==', key)
          keys[key] = true
        })
      } else if (p[2].startsWith(searchPath)) {
        // Use the first key part of p[2] after searchPath
        let sp = p[2].indexOf(PATH_SEPARATOR, searchPath.length)
        if (sp <= 0) {
          sp = p[2].length
        }
        const subPath = searchPath + p[2].substring(searchPath.length, sp)
        LOG.debug('++', searchPath, '==>', subPath)
        keys[subPath] = true
      }
    }
    // Do not push up to parent.
    return Object.keys(keys)
  }
}
