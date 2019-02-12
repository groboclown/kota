
import {
  Internal,
  Context,
  PATH_SEPARATOR
} from './base'
import {
  ATTRIBUTE_DATA_TYPE,
  VALUE_CALCULATED,
  VALUE_DATE_DELTA,
  VALUE_FUZZ,
  VALUE_NAME_LIST_ITEM,
  VALUE_NUMBER
} from './type-names'

const NUMBER_TYPES: { [key: string]: boolean } = {
  [VALUE_DATE_DELTA]: true,
  [VALUE_FUZZ]: true,
  [VALUE_CALCULATED]: true,
  [VALUE_NAME_LIST_ITEM]: true,
  [VALUE_NUMBER]: true
}


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
