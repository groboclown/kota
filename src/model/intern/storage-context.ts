
import {
  Internal,
  Context,
  normalizeAbsolutePath,
  PATH_SEPARATOR
} from './base'


export class StorageContext implements Context {
  constructor(private data: { [path: string]: Internal }) { }

  getInternal(path: string): Internal | undefined {
    if (path.length <= 0 || path[0] !== PATH_SEPARATOR) {
      return undefined
    }
    const value = this.data[path]
    return value
  }

  keysFor(path: string): string[] {
    // Ensure the path ends with a trailing slash
    const p = normalizeAbsolutePath(path, true)
    console.log(`DEBUG StorageContext: getting keys for ${p}`)
    const keys: string[] = []
    Object.keys(this.data).forEach(k => {
      if (k.startsWith(p)) {
        const pk = k.indexOf(PATH_SEPARATOR, p.length + 1)
        if (pk > 0) {
          keys.push(k.substring(0, pk + 1))
        } else {
          keys.push(k)
        }
      }
    })
    return keys
  }

  persist(): string {
    return JSON.stringify(this.data)
  }

  restore(data: string): void {
    this.data = JSON.parse(data)
  }
}
