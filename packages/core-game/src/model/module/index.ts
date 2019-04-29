
export {
  Module,
  ModuleConstraint,
  parseSrcModule,
  MODULE_TYPE_NAME
} from './module'

export {
  AttributeType,
  parseSrcAttribute,
  AttributeMapType,
  isAttributeMapType,
  AttributeFuzzType,
  isAttributeFuzzType,
  AttributeGroupSetType,
  isAttributeGroupType,
  AttributeIntegerType,
  isAttributeIntegerType,
  AttributeFunctionBaseType,
  AttributeFunctionType,
  isAttributeFunctionType,
  ATTRIBUTE_TYPE_NAME
} from './attribute'

export {
  FunctionAttributeBaseType,
  FunctionAttributeConstraint,
  FunctionAttributeNearTarget,
  isFunctionAttributeNearTarget,
  FunctionAttributeNearLowerBound,
  isFunctionAttributeNearLowerBound,
  FunctionAttributeNearUpperBound,
  isFunctionAttributeNearUpperBound,
} from './function'

export {
  ConstantLocalized,
  ConstantNumber
} from './constants'

export {
  Manifest
} from './manifest'

export {
  ParsedError,
  ParsedInfo
} from './parse-info'

export {
  LocalizationDateMarkerBaseType,
  LocalizationDateMarkerDirectMappingType,
  LocalizationDateMarkerMappingType,
  LocalizationDateMarkerType,
  LocalizationNumberType,
  LocalizationType,
  LocalizationTypeConstraint,
  isLocalizationDateMarkerDirectMappingType,
  isLocalizationDateMarkerMappingType,
} from './localization'

import { ParseSrcKey } from './parse-info'
import * as mattribute from './attribute'
import * as mlocalization from './localization'
import * as minstall from './install'
import * as mgroupvalue from './group-value'

// Turn module raw data into validated module objects.
export const OBJECT_PARSE_MAP: { [name: string]: ParseSrcKey<any> } = {
  [mattribute.ATTRIBUTE_TYPE_NAME]: mattribute.parseSrcAttribute,
  [mlocalization.LOCALIZATION_TYPE_NAME]: mlocalization.parseSrcAttribute,
  [minstall.INSTALL_TYPE_NAME]: minstall.parseSrcAttribute,
  // [mgroupvalue.]

  // `module` isn't a valid object outside the module.yaml file, so it doesn't appear here.
}
