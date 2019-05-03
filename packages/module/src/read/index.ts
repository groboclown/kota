
import * as baselibs from '@kota/base-libs'
import * as model from '../model'

export const MODULE_ABOUT_NAME = 'about.json'
export const MODULE_CONTENTS_NAME = 'contents.json'

/**
 * Usually called by itself to inspect each module, to present a list
 * of available modules to the end-user.
 * 
 * @param modulePath 
 * @param loader 
 */
export function readModuleHeader(
  modulePath: string, loader: baselibs.FileLoader
): Promise<model.ModuleHeader | baselibs.HasErrorValueList> {
  return loader(modulePath, MODULE_ABOUT_NAME)
    .then((text) => {
      if (baselibs.hasErrorValue(text)) {
        return { errors: [text.error] }
      }
      try {
        const raw = JSON.parse(text.data)
        const errors: baselibs.ErrorValue[] = []
        if (model.MODULEHEADER_VALIDATOR.validate(text.source, raw, errors)) {
          return raw
        }
        return { errors }
      } catch (e) {
        return { errors: [baselibs.coreError('bad json format', { path: text.source, msg: e.message })] }
      }
    })
}

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
