
import * as fs from 'fs'
import * as path from 'path'
import { FileLoader, FileData } from '../lib/files'
import { HasErrorValue, coreError } from '../lib/error'
import { ModuleData, loadModule } from '../lib/modules/load-module'

describe('Load module data', () => {
  const loadFileData: FileLoader = (...filePath: string[]): Promise<FileData | HasErrorValue> => {
    filePath = [__dirname].concat(filePath)
    const fp = path.join.apply(path, filePath)
    return new Promise(resolve => {
      // Production version will check if the file size is too big before loading.
      fs.readFile(fp, 'utf8', (err, data) => {
        if (err) {
          return resolve({ error: coreError('file load error', { path: fp }) })
        }
        return resolve({ source: fp, data: data.toString() })
      })
    })
  }
  it('01-module-data directory', () =>
    loadModule(path.join(__dirname, '01-module-data'), loadFileData)
      .then(md => {
        expect(md.module).not.toBeUndefined
        expect(md.context).not.toBeUndefined
        expect(md.errors).toHaveLength(0)
        expect(md.parseErrors).toHaveLength(0)
        // console.log(md.)
      })
  )
})
