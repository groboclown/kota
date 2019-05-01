
export * from './validator'
export * from './schema'

import * as schema from './schema'
export interface ModuleContents {
  about: schema.ModuleHeader
  contents: schema.FileStructure
}
