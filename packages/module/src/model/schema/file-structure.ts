/* AUTO GENERATED FILE.  DO NOT MODIFY. */
/* tslint:disable */
import { SchemaVerifier } from '../validator'

export type Source = string
export type NumberAttribute = {
  type: 'attribute-number'
} & NumericRange
export type NumericValue = number
export type FunctionCalculatedNearTargetAttribute = FunctionCalculatedNearAttribute & {
  type: 'attribute-function-near-target'
  target: NumericValue
}
export type FunctionCalculatedNearLessThanAttribute = FunctionCalculatedNearAttribute & {
  type: 'attribute-function-near-lessthan'
  lessThan: NumericValue
}
export type FunctionCalculatedNearMoreThanAttribute = FunctionCalculatedNearAttribute & {
  type: 'attribute-function-near-morethan'
  moreThan: NumericValue
}
export type FunctionCalculatedNearRangeAttribute = FunctionCalculatedNearAttribute & {
  type: 'attribute-function-near-range'
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
  entry:
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
  forValue?: string
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
  entry:
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
}
export interface Localization {
  source: Source
  parent?: LocaleName
  locale: LocaleName
  alternates: LocaleName[]
  number: L10NNumberFormat
  dateMarkers: DateMarker[]
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
  locale: string
  domain: string
  file: string
}
export interface MediaAudio {
  source: Source
  locale: string
  file: string
  codec: string
  seconds: number
  subtitles: Subtitle[]
}
export interface Subtitle {
  time: number
  duration: number
  domain: string
  msgid: string
}
export interface MediaVideo {
  source: Source
  locale: string
  file: string
  codec: string
  seconds: number
  size_x: number
  size_y: number
  subtitles: Subtitle[]
}
export interface MediaImage {
  source: Source
  locale: string
  file: string
  codec: string
  size_x: number
  size_y: number
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
        }
      },
      "required": [
        "source",
        "relpath",
        "entry"
      ],
      "additionalProperties": false
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
      "properties": {
        "source": {
          "$ref": "#/definitions/Source"
        },
        "parent": {
          "$ref": "#/definitions/LocaleName"
        },
        "locale": {
          "$ref": "#/definitions/LocaleName"
        },
        "alternates": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/LocaleName"
          }
        },
        "number": {
          "$ref": "#/definitions/L10nNumberFormat"
        },
        "dateMarkers": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/DateMarker"
          }
        }
      },
      "required": [
        "source",
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
      "additionalProperties": false
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
      "additionalProperties": false
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
      "additionalProperties": false
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
      "additionalProperties": false
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
      "additionalProperties": false
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
          "additionalProperties": false
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
          "additionalProperties": false
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
          "additionalProperties": false
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
          "additionalProperties": false
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
          "additionalProperties": false
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
      "additionalProperties": false
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
        "for",
        "ramp"
      ],
      "additionalProperties": false
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
      "properties": {
        "time": {
          "type": "number",
          "min": 0
        },
        "duration": {
          "type": "number",
          "min": 0
        },
        "domain": {
          "type": "string",
          "minLength": 2
        },
        "msgid": {
          "type": "string",
          "minLength": 1
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
export const FILESTRUCTURE_VALIDATOR = new SchemaVerifier<FileStructure>("file-structure", JSON_SCHEMA)
