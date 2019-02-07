
import { FileLoader } from '../files'
import { loadListFile, loadStructuredFileContents } from './load-raw'
import { HasErrorValue, hasErrorValue, coreError } from '../error'
import {
  Module,
  Manifest,
  parseSrcModule,
  MODULE_TYPE_NAME,
  ParsedError,
} from '../../model/module'

const MANIFEST_FILE_NAME = 'manifest.list'
const MODULE_FILE_NAME = 'module.yaml'

export interface ManifestResult {
  readonly manifest: Manifest
}

export function loadManifest(basedir: string, fileLoader: FileLoader): Promise<ManifestResult | HasErrorValue> {
  return fileLoader(basedir, MANIFEST_FILE_NAME)
    .then(fileContents => {
      if (hasErrorValue(fileContents)) {
        return { error: fileContents.error }
      }
      const items = loadListFile(fileContents.data, false)
      if (hasErrorValue(items)) {
        return { error: items.error }
      }
      const loaded: { [key: string]: boolean } = {}
      items.data.forEach(i => {
        while (i.length > 0 && i.startsWith('/')) {
          i = i.substring(1)
        }
        if (i.length > 0 && i !== MANIFEST_FILE_NAME && i !== MODULE_FILE_NAME) {
          loaded[i] = true
        }
      })
      return { manifest: { files: Object.keys(loaded) } }
    })
}

export interface ModuleResults {
  readonly module: Module | null
  readonly errors: ParsedError[] | null
  readonly valid: boolean
}

export function loadModuleFile(basedir: string, fileLoader: FileLoader): Promise<ModuleResults | HasErrorValue> {
  return fileLoader(basedir, MODULE_FILE_NAME)
    .then(fileContents => {
      if (hasErrorValue(fileContents)) {
        return fileContents
      }
      const items = loadStructuredFileContents(fileContents.data)
      if (hasErrorValue(items)) {
        return items
      }
      if (items.data.length !== 1 || !items.data[0][MODULE_TYPE_NAME]) {
        return { error: coreError('module file contents') }
      }

      const parsed = parseSrcModule(items.data[0][MODULE_TYPE_NAME])
      if (!parsed.valid) {
        return {
          module: null,
          errors: parsed.errors,
          valid: false
        }
      }
      return {
        module: parsed.parsed,
        errors: null,
        valid: true
      }
    })
}
