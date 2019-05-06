
import * as baselibs from '@kota/base-libs'
import * as model from '../model'


export function readModuleLocalizationText(
  modulePath: string, translation: model.Translation,
  loader: baselibs.FileLoader
): Promise<model.LocalizedMessageCatalog | baselibs.HasErrorValueList> {
  return loader(modulePath, translation.file)
    .then((text) => {
      if (baselibs.hasErrorValue(text)) {
        return { errors: [text.error] }
      }
      try {
        const raw = JSON.parse(text.data)
        const errors: baselibs.ErrorValue[] = []
        if (model.LOCALIZEDTEXT_VALIDATOR.validate(text.source, raw, errors)) {
          return raw
        }
        return { errors }
      } catch (e) {
        return { errors: [baselibs.coreError('bad json format', { path: text.source, msg: e.message })] }
      }
    })
}
