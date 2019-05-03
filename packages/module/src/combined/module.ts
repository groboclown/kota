
import {
  ModuleHeader,
  FileStructure,
} from '../model'

export interface ModuleContents {
  header: ModuleHeader
  contents: FileStructure
  path: string
}

export class ModuleCollector {
  private readonly headers: { [id: string]: ModuleHeader } = {}
  private readonly structures: { [id: string]: FileStructure } = {}
  private readonly paths: { [id: string]: string } = {}
  private readonly idReadOrder: string[] = []

  hasModuleHeaderLoaded(id: string): boolean {
    return !!this.headers[id]
  }

  hasModuleContentsLoaded(id: string): boolean {
    return !!this.structures[id]
  }

  getHeaders(): ModuleHeader[] {
    return Object.values(this.headers)
  }

  /**
   * 
   * @param header 
   * @return true if the value was added, or false if the ID is already loaded.
   */
  addHeader(header: ModuleHeader, modulePath: string): boolean {
    if (this.hasModuleHeaderLoaded(header.id)) {
      return false
    }
    this.headers[header.id] = header
    this.paths[header.id] = modulePath
    return true
  }

  /**
   * Module loading forces an order.  Later loaded modules override
   * earlier ones.
   * 
   * @return true if the module contents are added, or false if the header isn't
   *    registered, or if the module is already added.
   */
  addContents(id: string, contents: FileStructure): boolean {
    if (!this.hasModuleHeaderLoaded(id) || this.hasModuleContentsLoaded(id)) {
      return false
    }
    this.structures[id] = contents
    this.idReadOrder.push(id)
    return true
  }

  getLoadedModules(): ModuleContents[] {
    return this.idReadOrder.map((id): ModuleContents => ({
      header: this.headers[id],
      contents: this.structures[id],
      path: this.paths[id],
    }))
  }
}
