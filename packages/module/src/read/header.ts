
import * as baselibs from '@kota/base-libs'
import * as model from '../model'

export const MODULE_CONTENTS_NAME = 'contents.json'


export function readModuleContents(
  modulePath: string, loader: baselibs.FileLoader
): Promise<model.FileStructure | baselibs.HasErrorValueList> {
  return loader(modulePath, MODULE_CONTENTS_NAME)
    .then((text) => {
      if (baselibs.hasErrorValue(text)) {
        return { errors: [text.error] }
      }
      try {
        const raw = JSON.parse(text.data)
        const errors: baselibs.ErrorValue[] = []
        if (model.FILESTRUCTURE_VALIDATOR.validate(text.source, raw, errors)) {
          return raw
        }
        return { errors }
      } catch (e) {
        return { errors: [baselibs.coreError('bad json format', { path: text.source, msg: e.message })] }
      }
    })
}
