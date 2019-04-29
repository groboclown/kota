
import { FileLoader } from '../files'
import { hasErrorValue, ErrorValue } from '../error'
import {
  ModuleResults,
  loadManifest,
  loadModuleFile,
  MODULE_FILE_NAME,
  MANIFEST_FILE_NAME,
} from './load-specific'
import { parseFileObject } from './parse-file-contents'
import { loadStructuredFileContents } from './load-raw'
import { ParsedError } from '../../model/module'
import { createLogger } from '../log'

export interface ModuleDataFileError extends ParsedError {
  readonly modulePath: string
  readonly moduleFile: string
}

export interface FileErrorValue extends ErrorValue {
  modulePath: string
  moduleFile: string
  location?: string
}

/**
 * Loaded, not null, parsed module file data.
 * 
 * @param T the parsed type, NOT AN Internal.
 */
export interface ModuleFileData<T> {
  modulePath: string
  moduleFile: string
  data: T
}

export interface ModuleData {
  moduleResults?: ModuleResults
  data: ModuleFileData<any>[]
  errors: FileErrorValue[]
  parseErrors: ModuleDataFileError[]
}

const LOG = createLogger('lib.modules.load-module')

export function loadModule(modulePath: string, fileLoader: FileLoader): Promise<ModuleData> {
  const ret: ModuleData = { data: [], errors: [], parseErrors: [] }

  LOG.info('Loading module from ', modulePath)

  return Promise.all([
    loadManifest(modulePath, fileLoader)
      .then(manifest => {
        if (hasErrorValue(manifest)) {
          ret.errors.push({
            modulePath,
            moduleFile: MANIFEST_FILE_NAME,
            ...manifest.error
          })
          return Promise.resolve()
        } else {
          const files: Promise<any>[] = []
          manifest.manifest.files.forEach(f => {
            files.push(loadModuleDataFile(modulePath, f, ret, fileLoader))
          })
          return Promise.all(files).then(() => Promise.resolve())
        }
      }),
    loadModuleFile(modulePath, fileLoader)
      .then(m => {
        if (hasErrorValue(m)) {
          ret.errors.push({
            modulePath,
            moduleFile: MODULE_FILE_NAME,
            ...m.error
          })
        } else {
          ret.moduleResults = m
        }
      })
  ])
    .then(() => ret)
}


// Note that this just loads the structured versions of the module files; it
// does not load any Internal data structures.
function loadModuleDataFile(modulePath: string, moduleFile: string, md: ModuleData, fileLoader: FileLoader): Promise<any> {
  return fileLoader(modulePath, moduleFile)
    .then(fileData => {
      if (hasErrorValue(fileData)) {
        md.errors.push({
          modulePath,
          moduleFile,
          ...fileData.error
        })
        return
      }
      const loadedStruct = loadStructuredFileContents(fileData.data)
      if (hasErrorValue(loadedStruct)) {
        md.errors.push({
          modulePath,
          moduleFile,
          ...loadedStruct.error
        })
        return
      }
      if (!loadedStruct.data) {
        // Empty file.  Allow it.  Maybe a warning?  It could just be filled with comments.
        return
      }
      loadedStruct.data.forEach(data => {
        if (!data) {
          // Empty structure.  Allow it.
          return
        }
        Object.keys(data).forEach(typeName => {
          const typeData = data[typeName]
          const parsed = parseFileObject(typeName, typeData)
          if (parsed.errors && parsed.errors.length > 0) {
            parsed.errors.forEach(pe => md.parseErrors.push({ modulePath, moduleFile, ...pe }))
          } else if (!parsed.valid || !parsed.parsed) {
            // Able to parse the file without parse errors, but it's not valid???
            throw new Error(`Invalid state for ${modulePath}/${moduleFile} => ${JSON.stringify(typeData)}`)
          } else {
            md.data.push({
              modulePath,
              moduleFile,
              data: parsed.parsed
            })
          }
        })
      })
    })
}
