
import { HasErrorValue } from '../error'

export {
  ListFileData,
  isListFileData,
  parseListFile,
} from './list-file'

export interface FileData {
  source: string
  data: string
}

/**
 * Generic type to allow loading from a zip file, a URL, or a local file,
 * or to make unit testing easier, or anything else.
 *
 * `path` is a list of file path parts, that should be joined together using
 * whatever path separator is applicable.  Some path parts may already be
 * joined together, in which case the separator should be '/'.
 */
export type FileLoader = (...path: string[]) => Promise<FileData | HasErrorValue>
