
import * as fs from 'fs'
import * as path from 'path'
import { FileLoader, FileData } from '../../lib/files'
import { HasErrorValue, coreError } from '../../lib/error'
import { loadModule } from '../../lib/modules/load-module'
import { createLogger } from '../../lib/log'

describe('Load module data', () => {
  const LOG = createLogger('integration.01-module')
  const loadFileData: FileLoader = (...filePath: string[]): Promise<FileData | HasErrorValue> => {
    filePath = [path.join(__dirname, '..', '..', '..', 'data')].concat(filePath)
    const fp = path.join.apply(path, filePath)
    LOG.notice('Loading file', fp)
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
  it('0000-core directory', () =>
    loadModule('modules/0000-core', loadFileData)
      .then(md => {
        expect(md.moduleResults).not.toBeUndefined
        expect(md.context).not.toBeUndefined
        expect(md.errors).toHaveLength(0)
        expect(md.parseErrors).toHaveLength(0)
        if (!md.context || !md.moduleResults) {
          return
        }
        expect(md.context.keysFor('/')).toEqual([
          '/l10n/'
        ])
        expect(md.context.keysFor('/l10n')).toEqual([
          '/l10n/en_US'
        ])
        console.log(JSON.stringify(md.context))
      })
  )
})
