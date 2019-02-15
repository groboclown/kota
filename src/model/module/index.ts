
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

import { ParseSrcKey } from './parse-info'
import * as mattribute from './attribute'

// Turn module raw data into validated module objects.
export const OBJECT_PARSE_MAP: { [name: string]: ParseSrcKey<any> } = {
  [mattribute.ATTRIBUTE_TYPE_NAME]: mattribute.parseSrcAttribute,

  // `module` isn't a valid object outside the module.yaml file.
}
