
import { FileLoader } from '../files'
import { hasErrorValue, ErrorValue } from '../error'
import { loadManifest, loadModuleFile, ModuleResults } from './load-specific'
import { parseFileObject } from './parse-file-contents'
import { loadStructuredFileContents } from './load-raw'
import { Context, StorageContext, Internal, joinRelativePaths } from '../../model/intern'
import { ParsedError } from '../../model/module';
import { splitLast } from 'model/intern/base';

export interface ModuleDataFileError extends ParsedError {
  readonly modulePath: string
  readonly moduleFile: string
}

export interface ModuleData {
  module?: ModuleResults
  /** The context for the module.  Its paths are relative to the module. */
  context?: Context
  contextFilePaths: string[]
  errors: ErrorValue[]
  parseErrors: ModuleDataFileError[]
}

export function loadModule(modulePath: string, fileLoader: FileLoader): Promise<ModuleData> {
  const ret: ModuleData = { contextFilePaths: [], errors: [], parseErrors: [] }

  return Promise.all([
    loadManifest(modulePath, fileLoader)
      .then(manifest => {
        if (hasErrorValue(manifest)) {
          ret.errors.push(manifest.error)
          return Promise.resolve()
        } else {
          const files: Promise<any>[] = []
          manifest.manifest.files.forEach(f => {
            ret.contextFilePaths.push(f)
            files.push(loadModuleDataFile(modulePath, f, ret, fileLoader))
          })
          return Promise.all(files).then(() => Promise.resolve())
        }
      }),
    loadModuleFile(modulePath, fileLoader)
      .then(module => {
        if (hasErrorValue(module)) {
          ret.errors.push(module.error)
        } else {
          ret.module = module
        }
      })
  ])
    .then(() => ret)
}


function loadModuleDataFile(modulePath: string, moduleFile: string, md: ModuleData, fileLoader: FileLoader): Promise<any> {
  return fileLoader(modulePath, moduleFile)
    .then(fileData => {
      if (hasErrorValue(fileData)) {
        md.errors.push(fileData.error)
        return
      }
      const loadedStruct = loadStructuredFileContents(fileData.data)
      if (hasErrorValue(loadedStruct)) {
        md.errors.push(loadedStruct.error)
        return
      }
      const context: { [path: string]: Internal } = {}
      loadedStruct.data.forEach(data => {
        Object.keys(data).forEach(typeName => {
          const typeData = data[typeName]
          const parsed = parseFileObject(typeName, typeData)
          if (parsed.errors && parsed.errors.length > 0) {
            parsed.errors.forEach(pe => md.parseErrors.push({ modulePath, moduleFile, ...pe }))
          } else if (!parsed.valid || !parsed.id || !parsed.intern) {
            // Able to parse the file without parse errors, but it's not valid???
            throw new Error(`Invalid state for ${modulePath}/${moduleFile} => ${JSON.stringify(typeData)}`)
          } else {
            context[mkContextPath(moduleFile, parsed.id)] = parsed.intern
          }
        })
      })
      md.context = new StorageContext(context)
    })
}


function mkContextPath(moduleFile: string, id: string): string {
  // The context path is the relative module file path, without the filename, + the ID.
  const moduleRelPath = splitLast(moduleFile)[0]
  return joinRelativePaths(moduleRelPath, id)
}
