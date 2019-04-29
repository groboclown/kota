
import {
  MODULE_DIRNAME,
  WORLD_STATE_DIRNAME,
  CURRENT_REFERENCES_DIRNAME,
  APPLICATION_STATE_DIRNAME,
  GUI_DIRNAME,
} from '../core-paths'

import {
  LocalizationType
} from '../../model/module'


export interface PendingGroup {

}

export interface SetupData {
  loadedModules: { [id: string]: number[] }
  groups: { [path: string]: PendingGroup }
  localizations: { [name: string]: LocalizationType }
}
