
export { ModuleSetup } from './module'


import { SetupData } from './state'
import { ModuleSetup } from './module'

/**
 * The while-loading state of the system.  It's designed to have a specific
 * flow through the system state.
 */
export class Setup {
  private data: SetupData = {
    loadedModules: {},
    groups: {},
    localizations: {}
  }

  start(): ModuleSetup {
    return new ModuleSetup(this.data)
  }
}
