
import ajv from 'ajv'
import yaml from 'js-yaml'
import { FileLoader } from '../../lib/files'
import { hasErrorValue, HasErrorValue, coreError, ErrorValue } from '../../lib/error'
import { isArray, isObject } from 'util'
import { loadListFile } from '../../lib/modules/load-raw';

const SCHEMA_LIST_FILENAME = 'schemas.list'

export function loadAllSchemas(schemaPath: string, loader: FileLoader): Promise<(SchemaVerifier | HasErrorValue)[]> {
  return loader(schemaPath, SCHEMA_LIST_FILENAME)
    .then(data => {
      if (hasErrorValue(data)) {
        return [data]
      }
      const list = loadListFile(data.data, true)
      if (hasErrorValue(list)) {
        return [list]
      }
      return Promise.all(list.data.map(x => loadSchema(schemaPath, x, loader)))
    })
}

export function loadSchema(schemaPath: string, filename: string, loader: FileLoader): Promise<SchemaVerifier | HasErrorValue> {
  return loader(schemaPath, filename)
    .then(data => {
      if (hasErrorValue(data)) {
        return data
      }
      let raw: any[]
      if (filename.endsWith('.yaml') || filename.endsWith('.yml')) {
        try {
          raw = yaml.safeLoadAll(data.data)
        } catch (e) {
          return { error: coreError('bad yaml format', { msg: e.toString(), path: filename }) }
        }
      } else if (filename.endsWith('.json')) {
        try {
          const p = JSON.parse(data.data)
          if (isArray(p)) {
            raw = p
          } else if (isObject(p)) {
            raw = [p]
          } else {
            return { error: coreError('json file not array or object', { path: filename }) }
          }
        } catch (e) {
          return { error: coreError('bad json format', { msg: e.toString(), path: filename }) }
        }
      } else {
        return { error: coreError('unsupported file format', { path: filename }) }
      }
      if (raw.length != 1) {
        return { error: coreError('schema file must contain only one entry', { path: filename }) }
      }
      try {
        return new SchemaVerifier(filename, raw[0])
      } catch (e) {
        return { error: coreError('bad schema format', { msg: e.toString(), path: filename }) }
      }
    })
}

const AJV = new ajv({ allErrors: true })
export class SchemaVerifier {
  readonly title: string
  private readonly verifier: ajv.ValidateFunction

  constructor(readonly filename: string, raw: any) {
    if (typeof raw.title !== 'string') {
      throw new Error('no "title" property')
    }
    this.title = raw.title
    this.verifier = AJV.compile(raw)
  }

  validate(filename: string, raw: any): ErrorValue[] {
    const ret: ErrorValue[] = []
    if (!this.verifier(raw)) {
      if (this.verifier.errors) {
        for (const e of this.verifier.errors) {
          ret.push(coreError('invalid file schema format', {
            path: filename,
            schema: this.title,
            keyword: e.keyword,
            dataPath: e.dataPath,
            schemaPath: e.schemaPath,
            params: JSON.stringify(e.params),
            message: e.message || '(no message)',
            propertyName: e.propertyName || '(no property)',
          }))
        }
      }
    }
    return ret
  }
}
