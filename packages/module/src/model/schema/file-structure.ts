/* AUTO GENERATED FILE.  DO NOT MODIFY. */
/* tslint:disable */
import { SchemaVerifier } from '../validator'

export type Source = string
export type TreeItemEntry =
  | MapAttribute
  | FuzzAttribute
  | GroupAttribute
  | DateAttribute
  | DateDeltaAttribute
  | NumberAttribute
  | FunctionCalculatedNearTargetAttribute
  | FunctionCalculatedNearLessThanAttribute
  | FunctionCalculatedNearMoreThanAttribute
  | FunctionCalculatedNearRangeAttribute
  | FunctionCalculatedNumberAttribute
  | FunctionCalculatedFuzzAttribute
  | ConstantFuzzValue
  | ConstantNumberValue
  | ConstantL10NReferenceValue
export type NumberAttribute = {
  type: 'attribute-number'
  [k: string]: any
} & NumericRange
export type NumericValue = number
export type FunctionCalculatedNearTargetAttribute = FunctionCalculatedNearAttribute & {
  type: 'attribute-function-near-target'
  target: NumericValue
  [k: string]: any
}
export type FunctionCalculatedNearLessThanAttribute = FunctionCalculatedNearAttribute & {
  type: 'attribute-function-near-lessthan'
  lessThan: NumericValue
  [k: string]: any
}
export type FunctionCalculatedNearMoreThanAttribute = FunctionCalculatedNearAttribute & {
  type: 'attribute-function-near-morethan'
  moreThan: NumericValue
  [k: string]: any
}
export type FunctionCalculatedNearRangeAttribute = FunctionCalculatedNearAttribute & {
  type: 'attribute-function-near-range'
  [k: string]: any
} & NumericRange
export type FuzzValue = number
export type LocaleName = string

/**
 * A list of the different items stored in the module.  Every item contains a "source" to link back to its location within the original module (pre-compiled) location.  This helps with runtime reporting of errors back to the module authors.
 *
 */
export interface FileStructure {
  installHooks: InstallHook[]
  upgradeHooks: UpgradeHook[]
  groupValues: GroupValue[]
  overrideTree: OverrideTreeItem[]
  moduleTree: ModuleTreeItem[]
  localizations: Localization[]
  translations: Translation[]
  audio: MediaAudio[]
  videos: MediaVideo[]
  images: MediaImage[]
}
export interface InstallHook {
  source: Source
}
export interface UpgradeHook {
  source: Source
}
/**
 * A value to insert into a group-set.  These live outside the trees due to the way group values are inserted.
 *
 */
export interface GroupValue {
  source: Source
  groupPath: string
  name: string
  matches: {
    /**
     * This interface was referenced by `undefined`'s JSON-Schema definition
     * via the `patternProperty` "^\w$".
     */
    [k: string]: number
  }
}
export interface OverrideTreeItem {
  source: Source
  path: string
  entry: TreeItemEntry
}
export interface MapAttribute {
  type: 'attribute-map'
}
export interface FuzzAttribute {
  type: 'attribute-fuzz'
}
export interface GroupAttribute {
  type: 'attribute-group'
}
export interface DateAttribute {
  type: 'attribute-date'
}
export interface DateDeltaAttribute {
  type: 'attribute-datedelta'
}
export interface NumericRange {
  min: NumericValue
  max: NumericValue
}
export interface FunctionCalculatedNearAttribute {
  /**
   * the attribute in the context that the function uses.
   *
   */
  forValue: string
  /**
   * linear ramp distance from 0 to 1
   *
   */
  ramp: number
}
export interface FunctionCalculatedNumberAttribute {
  type: 'attribute-function-number'
  /**
   * computation string expression
   *
   */
  expression: string
  /**
   * map of expression variable names to context attribute name
   *
   */
  requires: {
    /**
     * This interface was referenced by `undefined`'s JSON-Schema definition
     * via the `patternProperty` "^[^\s/]+$".
     */
    [k: string]: string
  }
  /**
   * boundary conditions
   *
   */
  bound: {
    min: NumericValue
    max: NumericValue
  }
  round: 'floor' | 'ceiling' | 'closest'
}
export interface FunctionCalculatedFuzzAttribute {
  type: 'attribute-function-fuzz'
  /**
   * computation string expression
   *
   */
  expression: string
  /**
   * map of expression variable names to context attribute name
   *
   */
  requires: {
    /**
     * This interface was referenced by `undefined`'s JSON-Schema definition
     * via the `patternProperty` "^[^\s/]+$".
     */
    [k: string]: string
  }
}
export interface ConstantFuzzValue {
  type: 'constant-fuzz'
  value: FuzzValue
}
export interface ConstantNumberValue {
  type: 'constant-number'
  value: NumericValue
}
export interface ConstantL10NReferenceValue {
  type: 'constant-l10n'
  domain: string
  msgid: string
}
export interface ModuleTreeItem {
  source: Source
  relpath: string
  entry: TreeItemEntry
}
/**
 * A method for formatting certain values specific to an end-user locale. It also includes properties that allow for constructing a heirarchy for finding localized values from `localized-text.schema.yaml` files.
 *
 */
export interface Localization {
  source: Source
  /**
   * An ordered list of locales that indicate the order to find localized messages if a requested message is not found in this locale's translation files.  The order should be -
   *   1. This locale's messages.
   *   2. Each parent's strictly defined ordered message lookup, in the order
   *      they are listed here.
   * This means that if the first parent also has parents, then its parents will be looked up before the next item in this list.
   * Any circular references will be ignored.
   * This does not support aliasing locales.  If you want to support regions, then each region will need its own fully defined Localalization block, with valid parent hierarchies.
   * The date markers, though, will be joined together using the same algorithm as the translations.
   * If multiple localization blocks are found through the modules, they will be merged together into a single entry, with later loaded modules overwriting settings from previous modules.
   *
   */
  parents: LocaleName[]
  locale: LocaleName
  /**
   * A human readable name of the language.  Should be the language's native name for itself (i.e. "Deutch" instead of "German")
   *
   */
  name: string
  icon: MediaImage
  number: L10NNumberFormat
  /**
   * Markers for how to display various types of date attributes. All dates are based upon Gregorian calendar attributes.
   *
   */
  dateMarkers: DateMarker[]
}
export interface MediaImage {
  source: Source
  locale: string
  /**
   * relative path to the media file within the module's file structure.
   *
   */
  file: string
  codec: string
  size_x: number
  size_y: number
}
export interface L10NNumberFormat {
  decimal: string
  grouping: string
  negative: string
  positive: string
  digitsUpper: string
  digitsLower: string
}
export interface DateMarker {
  marker: string
  map: DateMarkerDirectMapping | DateMarkerValueMapping
}
export interface DateMarkerDirectMapping {
  type: 'direct'
  from: 'year' | 'yr' | 'day' | 'month' | 'week'
}
export interface DateMarkerValueMapping {
  type: 'map'
  from: 'day' | 'month' | 'week'
  mapping: {
    /**
     * This interface was referenced by `undefined`'s JSON-Schema definition
     * via the `patternProperty` "\d+".
     */
    [k: string]: string
  }
}
export interface Translation {
  source: Source
  /**
   * The name of the locale, as marked by the "localization" block. It's better to be less precise with the locale here, to allow for wider use of a single translation.
   * A locale's domain and messages are joined together based on the load order, which means that later loaded messages overwrite previous ones.
   *
   */
  locale: string
  domain: string
  /**
   * relative path to the media file within the module's file structure.
   *
   */
  file: string
}
export interface MediaAudio {
  source: Source
  locale: string
  /**
   * relative path to the media file within the module's file structure.
   *
   */
  file: string
  codec: string
  seconds: number
  subtitles: Subtitle[]
}
/**
 * A localized subtitle message.  It can be formatted text with variables. Each subtitle appears immediately after the previous one.  To include no subtitle for a period of time, set the `domain` and `msgid` to empty strings.
 *
 */
export interface Subtitle {
  duration: number
  domain: string
  msgid: string
}
export interface MediaVideo {
  source: Source
  locale: string
  /**
   * relative path to the media file within the module's file structure.
   *
   */
  file: string
  codec: string
  seconds: number
  size_x: number
  size_y: number
  subtitles: Subtitle[]
}

const JSON_SCHEMA = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://groboclown.github.io/kota/site/schema/compiled/file-structure.schema.json",
  "title": "FileStructure",
  "description": "A list of the different items stored in the module.  Every item contains a \"source\" to link back to its location within the original module (pre-compiled) location.  This helps with runtime reporting of errors back to the module authors.\n",
  "definitions": {
    "GroupValue": {
      "type": "object",
      "description": "A value to insert into a group-set.  These live outside the trees due to the way group values are inserted.\n",
      "properties": {
        "source": {
          "$ref": "#/definitions/Source"
        },
        "groupPath": {
          "type": "string",
          "minLength": 2
        },
        "name": {
          "type": "string",
          "minLength": 1
        },
        "matches": {
          "type": "object",
          "patternProperties": {
            "^\\w$": {
              "type": "number",
              "min": 0,
              "max": 1
            }
          }
        }
      },
      "required": [
        "source",
        "groupPath",
        "name",
        "matches"
      ],
      "additionalProperties": false
    },
    "OverrideTreeItem": {
      "type": "object",
      "properties": {
        "source": {
          "$ref": "#/definitions/Source"
        },
        "path": {
          "type": "string",
          "minLength": 2,
          "maxLength": 1024
        },
        "entry": {
          "$ref": "#/definitions/TreeItemEntry"
        }
      },
      "required": [
        "source",
        "path",
        "entry"
      ],
      "additionalProperties": false
    },
    "ModuleTreeItem": {
      "type": "object",
      "properties": {
        "source": {
          "$ref": "#/definitions/Source"
        },
        "relpath": {
          "type": "string",
          "minLength": 1,
          "maxLength": 1024
        },
        "entry": {
          "$ref": "#/definitions/TreeItemEntry"
        }
      },
      "required": [
        "source",
        "relpath",
        "entry"
      ],
      "additionalProperties": false
    },
    "TreeItemEntry": {
      "oneOf": [
        {
          "$ref": "#/definitions/MapAttribute"
        },
        {
          "$ref": "#/definitions/FuzzAttribute"
        },
        {
          "$ref": "#/definitions/GroupAttribute"
        },
        {
          "$ref": "#/definitions/DateAttribute"
        },
        {
          "$ref": "#/definitions/DateDeltaAttribute"
        },
        {
          "$ref": "#/definitions/NumberAttribute"
        },
        {
          "$ref": "#/definitions/FunctionCalculatedNearTargetAttribute"
        },
        {
          "$ref": "#/definitions/FunctionCalculatedNearLessThanAttribute"
        },
        {
          "$ref": "#/definitions/FunctionCalculatedNearMoreThanAttribute"
        },
        {
          "$ref": "#/definitions/FunctionCalculatedNearRangeAttribute"
        },
        {
          "$ref": "#/definitions/FunctionCalculatedNumberAttribute"
        },
        {
          "$ref": "#/definitions/FunctionCalculatedFuzzAttribute"
        },
        {
          "$ref": "#/definitions/ConstantFuzzValue"
        },
        {
          "$ref": "#/definitions/ConstantNumberValue"
        },
        {
          "$ref": "#/definitions/ConstantL10nReferenceValue"
        }
      ]
    },
    "InstallHook": {
      "type": "object",
      "properties": {
        "source": {
          "$ref": "#/definitions/Source"
        }
      },
      "required": [
        "source"
      ],
      "additionalProperties": false
    },
    "UpgradeHook": {
      "type": "object",
      "properties": {
        "source": {
          "$ref": "#/definitions/Source"
        }
      },
      "required": [
        "source"
      ],
      "additionalProperties": false
    },
    "Localization": {
      "type": "object",
      "description": "A method for formatting certain values specific to an end-user locale. It also includes properties that allow for constructing a heirarchy for finding localized values from `localized-text.schema.yaml` files.\n",
      "properties": {
        "source": {
          "$ref": "#/definitions/Source"
        },
        "parents": {
          "description": "An ordered list of locales that indicate the order to find localized messages if a requested message is not found in this locale's translation files.  The order should be -\n  1. This locale's messages.\n  2. Each parent's strictly defined ordered message lookup, in the order\n     they are listed here.\nThis means that if the first parent also has parents, then its parents will be looked up before the next item in this list.\nAny circular references will be ignored.\nThis does not support aliasing locales.  If you want to support regions, then each region will need its own fully defined Localalization block, with valid parent hierarchies.\nThe date markers, though, will be joined together using the same algorithm as the translations.\nIf multiple localization blocks are found through the modules, they will be merged together into a single entry, with later loaded modules overwriting settings from previous modules.\n",
          "type": "array",
          "items": {
            "$ref": "#/definitions/LocaleName"
          }
        },
        "locale": {
          "$ref": "#/definitions/LocaleName"
        },
        "name": {
          "description": "A human readable name of the language.  Should be the language's native name for itself (i.e. \"Deutch\" instead of \"German\")\n",
          "type": "string",
          "minLength": 2,
          "maxLength": 60
        },
        "icon": {
          "$ref": "#/definitions/MediaImage"
        },
        "number": {
          "$ref": "#/definitions/L10nNumberFormat"
        },
        "dateMarkers": {
          "description": "Markers for how to display various types of date attributes. All dates are based upon Gregorian calendar attributes.\n",
          "type": "array",
          "items": {
            "$ref": "#/definitions/DateMarker"
          }
        }
      },
      "required": [
        "source",
        "name",
        "icon",
        "parents",
        "locale",
        "alternates",
        "number",
        "dateMarkers"
      ],
      "additionalProperties": false
    },
    "Translation": {
      "type": "object",
      "properties": {
        "source": {
          "$ref": "#/definitions/Source"
        },
        "locale": {
          "description": "The name of the locale, as marked by the \"localization\" block. It's better to be less precise with the locale here, to allow for wider use of a single translation.\nA locale's domain and messages are joined together based on the load order, which means that later loaded messages overwrite previous ones.\n",
          "type": "string",
          "minLength": 2,
          "maxLength": 12
        },
        "domain": {
          "type": "string",
          "minLength": 1,
          "maxLength": 200
        },
        "file": {
          "description": "relative path to the media file within the module's file structure.\n",
          "type": "string",
          "minLength": 1,
          "maxLength": 200
        }
      },
      "required": [
        "source",
        "locale",
        "domain",
        "file"
      ],
      "additionalProperties": false
    },
    "MediaAudio": {
      "type": "object",
      "properties": {
        "source": {
          "$ref": "#/definitions/Source"
        },
        "locale": {
          "type": "string",
          "minLength": 2,
          "maxLength": 12
        },
        "file": {
          "description": "relative path to the media file within the module's file structure.\n",
          "type": "string",
          "minLength": 1,
          "maxLength": 200
        },
        "codec": {
          "type": "string",
          "minLength": 1,
          "maxLength": 60
        },
        "seconds": {
          "type": "number",
          "min": 0
        },
        "subtitles": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/Subtitle"
          }
        }
      },
      "required": [
        "source",
        "locale",
        "file",
        "codec",
        "seconds",
        "subtitles"
      ],
      "additionalProperties": false
    },
    "MediaVideo": {
      "type": "object",
      "properties": {
        "source": {
          "$ref": "#/definitions/Source"
        },
        "locale": {
          "type": "string",
          "minLength": 2,
          "maxLength": 12
        },
        "file": {
          "description": "relative path to the media file within the module's file structure.\n",
          "type": "string",
          "minLength": 1,
          "maxLength": 200
        },
        "codec": {
          "type": "string",
          "minLength": 1,
          "maxLength": 60
        },
        "seconds": {
          "type": "number",
          "min": 0
        },
        "size_x": {
          "type": "integer",
          "min": 0
        },
        "size_y": {
          "type": "integer",
          "min": 0
        },
        "subtitles": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/Subtitle"
          }
        }
      },
      "required": [
        "source",
        "locale",
        "file",
        "codec",
        "seconds",
        "size_x",
        "size_y",
        "subtitles"
      ],
      "additionalProperties": false
    },
    "MediaImage": {
      "type": "object",
      "properties": {
        "source": {
          "$ref": "#/definitions/Source"
        },
        "locale": {
          "type": "string",
          "minLength": 2,
          "maxLength": 12
        },
        "file": {
          "description": "relative path to the media file within the module's file structure.\n",
          "type": "string",
          "minLength": 1,
          "maxLength": 200
        },
        "codec": {
          "type": "string",
          "minLength": 1,
          "maxLength": 60
        },
        "size_x": {
          "type": "integer",
          "min": 0
        },
        "size_y": {
          "type": "integer",
          "min": 0
        }
      },
      "required": [
        "source",
        "locale",
        "file",
        "codec",
        "size_x",
        "size_y"
      ],
      "additionalProperties": false
    },
    "MapAttribute": {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "attribute-map"
          ]
        }
      },
      "required": [
        "type"
      ],
      "additionalProperties": true
    },
    "FuzzAttribute": {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "attribute-fuzz"
          ]
        }
      },
      "required": [
        "type"
      ],
      "additionalProperties": true
    },
    "GroupAttribute": {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "attribute-group"
          ]
        }
      },
      "required": [
        "type"
      ],
      "additionalProperties": true
    },
    "DateAttribute": {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "attribute-date"
          ]
        }
      },
      "required": [
        "type"
      ],
      "additionalProperties": true
    },
    "DateDeltaAttribute": {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "attribute-datedelta"
          ]
        }
      },
      "required": [
        "type"
      ],
      "additionalProperties": true
    },
    "NumberAttribute": {
      "allOf": [
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "attribute-number"
              ]
            }
          },
          "required": [
            "type"
          ],
          "noInheritProperties": false
        },
        {
          "$ref": "#/definitions/NumericRange"
        }
      ]
    },
    "FunctionCalculatedNearTargetAttribute": {
      "allOf": [
        {
          "$ref": "#/definitions/FunctionCalculatedNearAttribute"
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "attribute-function-near-target"
              ]
            },
            "target": {
              "$ref": "#/definitions/NumericValue"
            }
          },
          "required": [
            "type",
            "target"
          ],
          "noInheritProperties": false
        }
      ]
    },
    "FunctionCalculatedNearLessThanAttribute": {
      "allOf": [
        {
          "$ref": "#/definitions/FunctionCalculatedNearAttribute"
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "attribute-function-near-lessthan"
              ]
            },
            "lessThan": {
              "$ref": "#/definitions/NumericValue"
            }
          },
          "required": [
            "type",
            "lessThan"
          ],
          "noInheritProperties": false
        }
      ]
    },
    "FunctionCalculatedNearMoreThanAttribute": {
      "allOf": [
        {
          "$ref": "#/definitions/FunctionCalculatedNearAttribute"
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "attribute-function-near-morethan"
              ]
            },
            "moreThan": {
              "$ref": "#/definitions/NumericValue"
            }
          },
          "required": [
            "type",
            "moreThan"
          ],
          "noInheritProperties": false
        }
      ]
    },
    "FunctionCalculatedNearRangeAttribute": {
      "allOf": [
        {
          "$ref": "#/definitions/FunctionCalculatedNearAttribute"
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "attribute-function-near-range"
              ]
            }
          },
          "required": [
            "type"
          ],
          "noInheritProperties": false
        },
        {
          "$ref": "#/definitions/NumericRange"
        }
      ]
    },
    "FunctionCalculatedNumberAttribute": {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "attribute-function-number"
          ]
        },
        "expression": {
          "description": "computation string expression\n",
          "type": "string",
          "minLength": 3,
          "maxLength": 200
        },
        "requires": {
          "description": "map of expression variable names to context attribute name\n",
          "type": "object",
          "patternProperties": {
            "^[^\\s/]+$": {
              "type": "string",
              "pattern": "^[^\\s/]+$"
            }
          }
        },
        "bound": {
          "description": "boundary conditions\n",
          "$ref": "#/definitions/NumericRange"
        },
        "round": {
          "type": "string",
          "enum": [
            "floor",
            "ceiling",
            "closest"
          ]
        }
      },
      "required": [
        "type",
        "expression",
        "requires",
        "bound",
        "round"
      ],
      "additionalProperties": false
    },
    "FunctionCalculatedFuzzAttribute": {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "attribute-function-fuzz"
          ]
        },
        "expression": {
          "description": "computation string expression\n",
          "type": "string",
          "minLength": 3,
          "maxLength": 200
        },
        "requires": {
          "description": "map of expression variable names to context attribute name\n",
          "type": "object",
          "patternProperties": {
            "^[^\\s/]+$": {
              "type": "string",
              "pattern": "^[^\\s/]+$"
            }
          }
        }
      },
      "required": [
        "type",
        "expression",
        "requires"
      ],
      "additionalProperties": false
    },
    "ConstantFuzzValue": {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "constant-fuzz"
          ]
        },
        "value": {
          "$ref": "#/definitions/FuzzValue"
        }
      },
      "required": [
        "type",
        "value"
      ],
      "additionalProperties": false
    },
    "ConstantNumberValue": {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "constant-number"
          ]
        },
        "value": {
          "$ref": "#/definitions/NumericValue"
        }
      },
      "required": [
        "type",
        "value"
      ],
      "additionalProperties": false
    },
    "ConstantL10nReferenceValue": {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "constant-l10n"
          ]
        },
        "domain": {
          "type": "string",
          "minLength": 1,
          "maxLength": 200
        },
        "msgid": {
          "type": "string",
          "minLength": 1,
          "maxLength": 200
        }
      },
      "required": [
        "type",
        "domain",
        "msgid"
      ],
      "additionalProperties": false
    },
    "L10nNumberFormat": {
      "type": "object",
      "properties": {
        "decimal": {
          "type": "string",
          "minLength": 1,
          "maxLength": 1
        },
        "grouping": {
          "type": "string",
          "minLength": 1,
          "maxLength": 1
        },
        "negative": {
          "type": "string",
          "minLength": 1,
          "maxLength": 1
        },
        "positive": {
          "type": "string",
          "minLength": 1,
          "maxLength": 1
        },
        "digitsUpper": {
          "type": "string",
          "minLength": 16,
          "maxLength": 16
        },
        "digitsLower": {
          "type": "string",
          "minLength": 16,
          "maxLength": 16
        }
      },
      "required": [
        "decimal",
        "grouping",
        "negative",
        "positive",
        "digitsUpper",
        "digitsLower"
      ],
      "additionalProperties": false
    },
    "DateMarkerDirectMapping": {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "direct"
          ]
        },
        "from": {
          "type": "string",
          "enum": [
            "year",
            "yr",
            "day",
            "month",
            "week"
          ]
        }
      },
      "required": [
        "type",
        "from"
      ],
      "additionalProperties": false
    },
    "DateMarkerValueMapping": {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "map"
          ]
        },
        "from": {
          "type": "string",
          "enum": [
            "day",
            "month",
            "week"
          ]
        },
        "mapping": {
          "type": "object",
          "patternProperties": {
            "\\d+": {
              "type": "string",
              "minLength": 1,
              "maxLength": 200
            }
          }
        }
      },
      "required": [
        "type",
        "from",
        "mapping"
      ],
      "additionalProperties": false
    },
    "DateMarker": {
      "type": "object",
      "properties": {
        "marker": {
          "type": "string",
          "minLength": 1,
          "maxLength": 1
        },
        "map": {
          "oneOf": [
            {
              "$ref": "#/definitions/DateMarkerDirectMapping"
            },
            {
              "$ref": "#/definitions/DateMarkerValueMapping"
            }
          ]
        }
      },
      "required": [
        "marker",
        "map"
      ],
      "additionalProperties": false
    },
    "NumericValue": {
      "type": "integer",
      "min": -1000000000,
      "max": 1000000000
    },
    "FuzzValue": {
      "type": "number",
      "min": 0,
      "max": 1
    },
    "NumericRange": {
      "type": "object",
      "properties": {
        "min": {
          "$ref": "#/definitions/NumericValue"
        },
        "max": {
          "$ref": "#/definitions/NumericValue"
        }
      },
      "required": [
        "min",
        "max"
      ],
      "additionalProperties": true
    },
    "FunctionCalculatedNearAttribute": {
      "type": "object",
      "properties": {
        "forValue": {
          "description": "the attribute in the context that the function uses.\n",
          "type": "string",
          "pattern": "^[^\\s/]+$"
        },
        "ramp": {
          "description": "linear ramp distance from 0 to 1\n",
          "type": "number",
          "min": 0,
          "max": 1
        }
      },
      "required": [
        "forValue",
        "ramp"
      ],
      "additionalProperties": true
    },
    "Source": {
      "type": "string",
      "minLength": 1,
      "maxLength": 200
    },
    "LocaleName": {
      "type": "string",
      "minLength": 2,
      "maxLength": 12,
      "pattern": "^[a-z][a-z](_[A-Z][A-Z])+"
    },
    "Subtitle": {
      "type": "object",
      "description": "A localized subtitle message.  It can be formatted text with variables. Each subtitle appears immediately after the previous one.  To include no subtitle for a period of time, set the `domain` and `msgid` to empty strings.\n",
      "properties": {
        "duration": {
          "type": "number",
          "min": 0
        },
        "domain": {
          "type": "string",
          "minLength": 0
        },
        "msgid": {
          "type": "string",
          "minLength": 0
        }
      },
      "required": [
        "time",
        "duration",
        "domain",
        "msgid"
      ],
      "additionalProperties": false
    }
  },
  "type": "object",
  "properties": {
    "installHooks": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/InstallHook"
      }
    },
    "upgradeHooks": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/UpgradeHook"
      }
    },
    "groupValues": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/GroupValue"
      }
    },
    "overrideTree": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/OverrideTreeItem"
      }
    },
    "moduleTree": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/ModuleTreeItem"
      }
    },
    "localizations": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/Localization"
      }
    },
    "translations": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/Translation"
      }
    },
    "audio": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/MediaAudio"
      }
    },
    "videos": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/MediaVideo"
      }
    },
    "images": {
      "type": "array",
      "items": {
        "$ref": "#/definitions/MediaImage"
      }
    }
  },
  "required": [
    "installHooks",
    "upgradeHooks",
    "groupValues",
    "overrideTree",
    "moduleTree",
    "localizations",
    "translations",
    "audio",
    "videos",
    "images"
  ],
  "additionalProperties": false
}
export const FILESTRUCTURE_BASIC_VALIDATOR = new SchemaVerifier<FileStructure>("file-structure", JSON_SCHEMA)
