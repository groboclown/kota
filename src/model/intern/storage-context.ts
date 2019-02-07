
import {
  Internal,
  InternContext,
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


export class StorageContext implements InternContext {
  constructor(private data: { [path: string]: Internal<any> }) { }

  get<X, T extends Internal<X>>(path: string, dataType: ATTRIBUTE_DATA_TYPE): T | undefined {
    if (path.length <= 0 || path[0] !== PATH_SEPARATOR) {
      console.log(`DEBUG --- path is not in list`)
      return undefined
    }
    const value = this.data[path]
    if (value === undefined) {
      console.log(`DEBUG --- path value not set ${path}`)
      return undefined
    }
    if (value.type === dataType) {
      return <T>(<unknown>value)
    }
    if (value.type === VALUE_CALCULATED && NUMBER_TYPES[dataType]) {
      // NOTE: correctly checking the type of the requested value requires
      // looking up the function definition, which may not even be in this
      // storage context.  So, this will just skip the prescise number check...
      return <T>(<unknown>value)
    }
    console.log(`DEBUG --- path has data type ${value.type}; expected ${dataType}`)
    return undefined
  }

  persist(): string {
    return JSON.stringify(this.data)
  }

  restore(data: string): void {
    this.data = JSON.parse(data)
  }
}
