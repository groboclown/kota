
import { SetupData } from './state'
import { ModuleFileData } from '../modules/load-module'
import { Module } from '../../model/module'
import { ErrorValue, HasErrorValue, hasErrorValue, coreError } from '../error'

export class ModuleSetup {
  constructor(private data: SetupData) { }

  merge(moduleInfo: Module, files: ModuleFileData<any>[]): ErrorValue[] {
    const ret: ErrorValue[] = []

    const version = getModuleVersion(moduleInfo)
    if (hasErrorValue(version)) {
      ret.push(version.error)
    }
    if (this.data.loadedModules[moduleInfo.id]) {
      ret.push(coreError('duplicate module loaded', {
        id: moduleInfo.id,
        v1: this.data.loadedModules[moduleInfo.id].map(s => String(s)).join('.'),
        v2: moduleInfo.version,
      }))
    }

    checkModuleDependencies(moduleInfo, this.data, ret)

    // TODO license check???

    // TODO Merge each file.

    return ret
  }
}


function checkModuleDependencies(moduleInfo: Module, data: SetupData, errs: ErrorValue[]): void {
  // FIXME
}


function getModuleVersion(moduleInfo: Module): number[] | HasErrorValue {
  if (typeof moduleInfo.version === 'number') {
    return [moduleInfo.version]
  }
  try {
    return moduleInfo.version.split('.').map(k => parseInt(k, 10))
  } catch (e) {
    return { error: coreError('invalid module version number', { id: moduleInfo.id, version: moduleInfo.version }) }
  }
}
