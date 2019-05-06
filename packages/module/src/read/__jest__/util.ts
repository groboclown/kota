
import { FileLoader, FileData, ErrorValue, HasErrorValue, isErrorValue, hasErrorValueList } from '@kota/base-libs'
import { ModuleHeader, FileStructure } from '../../model'


export function createLoader(name: string, contents: any): FileLoader {
  return (...path: string[]): Promise<FileData | HasErrorValue> => {
    if (path[path.length - 1] === name) {
      if (isErrorValue(contents)) {
        return Promise.resolve({ error: contents })
      }
      return Promise.resolve({
        source: path.join('/'),
        data: typeof contents === 'string' && contents || JSON.stringify(contents),
      })
    }
    return Promise.resolve({
      error: { domain: 'unittest', msgid: 'invalid path {path}', params: { path: path.join('/') } },
    })
  }
}


export const BASIC_ERROR_1: ErrorValue = {
  domain: 'unittest',
  msgid: 'expected error',
  params: {},
}
export const BASIC_ERROR_2: ErrorValue = {
  domain: 'unittest',
  msgid: 'expected error2',
  params: {},
}
