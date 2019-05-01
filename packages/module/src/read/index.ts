
import * as baselibs from '@kota/base-libs'
import * as model from '../model'

export const MODULE_ABOUT_NAME = 'about.json'
export const MODULE_CONTENTS_NAME = 'contents.json'

export function readModuleAbout(
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

export function readModule(
  modulePath: string, loader: baselibs.FileLoader
): Promise<model.ModuleContents | baselibs.HasErrorValueList> {
  return Promise.all([readModuleAbout(modulePath, loader), readModuleContents(modulePath, loader)])
    .then((vv) => {
      let errors: baselibs.ErrorValue[] = []
      let about: model.ModuleHeader | null = null
      let contents: model.FileStructure | null = null
      if (baselibs.hasErrorValueList(vv[0])) {
        errors = errors.concat(vv[0].errors)
      } else {
        about = vv[0]
      }
      if (baselibs.hasErrorValueList(vv[1])) {
        errors = errors.concat(vv[1].errors)
      } else {
        contents = vv[1]
      }
      // The or checking here is redundant, but necessary for typescript type checking.
      if (errors.length > 0 || !about || !contents) {
        return { errors }
      }
      return { about, contents }
    })
}
