
import {
  Internal,
  Context,
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

  persist(): string {
    return JSON.stringify(this.data)
  }

  restore(data: string): void {
    this.data = JSON.parse(data)
  }
}
