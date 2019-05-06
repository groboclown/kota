/* AUTO GENERATED FILE.  DO NOT MODIFY. */
/* tslint:disable */
import { SchemaVerifier } from '../validator'

export type LocalizedMessageBlock = {
  blockStyle: BlockStyle
  [k: string]: any
} & TextFragmentList
export type BlockStyle = 'para' | 'quote' | 'signature' | 'header' | 'subhead' | 'right' | 'section'
export type TextFragment =
  | StyledVariable
  | StyledContextVariable
  | StyledMessage
  | StyledLink
  | PlainVariable
  | PlainContextVariable
  | PlainMessage
  | PlainLink
export type StyledVariable = SpanStyle &
  VariableTextData & {
    type: 'styled-var'
    [k: string]: any
  }
/**
 * This interface was referenced by `ArgumentMapping`'s JSON-Schema definition
 * via the `patternProperty` "^[-,. -+0-9a-zA-Z]+$".
 */
export type ArgumentReference = string
export type StyledContextVariable = SpanStyle &
  ContextVariableTextData & {
    type: 'styled-context'
    [k: string]: any
  }
export type StyledMessage = SpanStyle &
  MessageTextData & {
    type: 'styled-text'
    [k: string]: any
  }
export type StyledLink = SpanStyle &
  LinkTextData & {
    type: 'styled-link'
    [k: string]: any
  }
export type PlainVariable = VariableTextData & {
  type: 'var'
  [k: string]: any
}
export type PlainContextVariable = ContextVariableTextData & {
  type: 'context'
  [k: string]: any
}
export type PlainMessage = MessageTextData & {
  type: 'text'
  [k: string]: any
}
export type PlainLink = LinkTextData & {
  type: 'link'
  [k: string]: any
}

/**
 * A catalog of localized text translations.  The translations have been pre-parsed for output.  At the top level, each key corresponds to a "msgid" in a localized message.
 * Localized text includes formatting notes for the output and variable lookup and formatting placeholders.
 * These localized-text files will only be used if referenced from a module's file-structure document in a `Translation` block.
 *
 */
export interface LocalizedMessageCatalog {
  msgids: {
    /**
     * This interface was referenced by `undefined`'s JSON-Schema definition
     * via the `patternProperty` "^[-,. -+0-9a-zA-Z]+$".
     */
    [k: string]: LocalizedMessageBlock[]
  }
}
export interface TextFragmentList {
  text: TextFragment[]
}
export interface SpanStyle {
  weight?: number
  slant?: number
  underline?: number
  strikethrough?: number
}
export interface VariableTextData {
  formatMarker: string
  keyValueNames: ArgumentMapping
  templateString?: string
}
export interface ArgumentMapping {
  [k: string]: ArgumentReference
}
export interface ContextVariableTextData {
  formatMarker: string
  keyValueNames: ArgumentMapping
  template: TextFragment[]
}
export interface MessageTextData {
  text: string
}
export interface LinkTextData {
  text: string
  linkTo: string
}

const JSON_SCHEMA = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://groboclown.github.io/kota/site/schema/compiled/localized-text.schema.json",
  "title": "LocalizedMessageCatalog",
  "description": "A catalog of localized text translations.  The translations have been pre-parsed for output.  At the top level, each key corresponds to a \"msgid\" in a localized message.\nLocalized text includes formatting notes for the output and variable lookup and formatting placeholders.\nThese localized-text files will only be used if referenced from a module's file-structure document in a `Translation` block.\n",
  "type": "object",
  "properties": {
    "msgids": {
      "type": "object",
      "patternProperties": {
        "^[-,. -+0-9a-zA-Z]+$": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/LocalizedMessageBlock"
          }
        }
      }
    }
  },
  "required": [
    "msgids"
  ],
  "additionalProperties": false,
  "definitions": {
    "LocalizedMessage": {
      "oneOf": [
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "blocks"
              ]
            },
            "blocks": {
              "type": "array",
              "items": {
                "$ref": "#/definitions/LocalizedMessageBlock"
              }
            }
          },
          "required": [
            "type",
            "blocks"
          ],
          "noInheritProperties": false
        },
        {
          "allOf": [
            {
              "type": "object",
              "properties": {
                "type": {
                  "type": "string",
                  "enum": [
                    "fragment"
                  ]
                }
              },
              "required": [
                "type",
                "text"
              ],
              "noInheritProperties": false
            },
            {
              "$ref": "#/definitions/TextFragmentList"
            }
          ]
        }
      ]
    },
    "LocalizedMessageBlock": {
      "allOf": [
        {
          "type": "object",
          "properties": {
            "blockStyle": {
              "$ref": "#/definitions/BlockStyle"
            }
          },
          "required": [
            "blockStyle"
          ],
          "noInheritProperties": false
        },
        {
          "$ref": "#/definitions/TextFragmentList"
        }
      ]
    },
    "TextFragmentList": {
      "type": "object",
      "properties": {
        "text": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/TextFragment"
          }
        }
      },
      "required": [
        "text"
      ],
      "additionalProperties": true
    },
    "TextFragment": {
      "oneOf": [
        {
          "$ref": "#/definitions/StyledVariable"
        },
        {
          "$ref": "#/definitions/StyledContextVariable"
        },
        {
          "$ref": "#/definitions/StyledMessage"
        },
        {
          "$ref": "#/definitions/StyledLink"
        },
        {
          "$ref": "#/definitions/PlainVariable"
        },
        {
          "$ref": "#/definitions/PlainContextVariable"
        },
        {
          "$ref": "#/definitions/PlainMessage"
        },
        {
          "$ref": "#/definitions/PlainLink"
        }
      ]
    },
    "BlockStyle": {
      "type": "string",
      "enum": [
        "para",
        "quote",
        "signature",
        "header",
        "subhead",
        "right",
        "section"
      ]
    },
    "StyledMessage": {
      "allOf": [
        {
          "$ref": "#/definitions/SpanStyle"
        },
        {
          "$ref": "#/definitions/MessageTextData"
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "styled-text"
              ]
            }
          },
          "required": [
            "type"
          ],
          "noInheritProperties": false
        }
      ]
    },
    "PlainMessage": {
      "allOf": [
        {
          "$ref": "#/definitions/MessageTextData"
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "text"
              ]
            }
          },
          "required": [
            "type"
          ],
          "noInheritProperties": false
        }
      ]
    },
    "MessageTextData": {
      "type": "object",
      "properties": {
        "text": {
          "type": "string",
          "minLength": 0,
          "maxLength": 2000
        }
      },
      "required": [
        "text"
      ],
      "additionalProperties": true
    },
    "StyledVariable": {
      "allOf": [
        {
          "$ref": "#/definitions/SpanStyle"
        },
        {
          "$ref": "#/definitions/VariableTextData"
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "styled-var"
              ]
            }
          },
          "required": [
            "type"
          ],
          "noInheritProperties": false
        }
      ]
    },
    "PlainVariable": {
      "allOf": [
        {
          "$ref": "#/definitions/VariableTextData"
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "var"
              ]
            }
          },
          "required": [
            "type"
          ],
          "noInheritProperties": false
        }
      ]
    },
    "VariableTextData": {
      "type": "object",
      "properties": {
        "formatMarker": {
          "type": "string",
          "minLength": 1,
          "maxLength": 2
        },
        "keyValueNames": {
          "$ref": "#/definitions/ArgumentMapping"
        },
        "templateString": {
          "type": "string",
          "minLength": 0,
          "maxLength": 200
        }
      },
      "required": [
        "formatMarker",
        "keyValueNames",
        "template"
      ],
      "additionalProperties": true
    },
    "StyledContextVariable": {
      "allOf": [
        {
          "$ref": "#/definitions/SpanStyle"
        },
        {
          "$ref": "#/definitions/ContextVariableTextData"
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "styled-context"
              ]
            }
          },
          "required": [
            "type"
          ],
          "noInheritProperties": false
        }
      ]
    },
    "PlainContextVariable": {
      "allOf": [
        {
          "$ref": "#/definitions/ContextVariableTextData"
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "context"
              ]
            }
          },
          "required": [
            "type"
          ],
          "noInheritProperties": false
        }
      ]
    },
    "ContextVariableTextData": {
      "type": "object",
      "properties": {
        "formatMarker": {
          "type": "string",
          "minLength": 1,
          "maxLength": 2
        },
        "keyValueNames": {
          "$ref": "#/definitions/ArgumentMapping"
        },
        "template": {
          "type": "array",
          "items": {
            "$ref": "#/definitions/TextFragment"
          }
        }
      },
      "required": [
        "formatMarker",
        "keyValueNames",
        "template"
      ],
      "additionalProperties": true
    },
    "StyledLink": {
      "allOf": [
        {
          "$ref": "#/definitions/SpanStyle"
        },
        {
          "$ref": "#/definitions/LinkTextData"
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "styled-link"
              ]
            }
          },
          "required": [
            "type"
          ],
          "noInheritProperties": false
        }
      ]
    },
    "PlainLink": {
      "allOf": [
        {
          "$ref": "#/definitions/LinkTextData"
        },
        {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "link"
              ]
            }
          },
          "required": [
            "type"
          ],
          "noInheritProperties": false
        }
      ]
    },
    "LinkTextData": {
      "type": "object",
      "properties": {
        "text": {
          "type": "string"
        },
        "linkTo": {
          "type": "string"
        }
      },
      "required": [
        "text",
        "linkTo"
      ],
      "additionalProperties": true
    },
    "ArgumentMapping": {
      "type": "object",
      "patternProperties": {
        "^[-,. -+0-9a-zA-Z]+$": {
          "$ref": "#/definitions/ArgumentReference"
        }
      }
    },
    "ArgumentReference": {
      "type": "string",
      "minLength": 1
    },
    "SpanStyle": {
      "type": "object",
      "properties": {
        "weight": {
          "type": "number",
          "min": 0,
          "max": 2
        },
        "slant": {
          "type": "number",
          "min": 0,
          "max": 2
        },
        "underline": {
          "type": "number",
          "min": 0,
          "max": 2
        },
        "strikethrough": {
          "type": "number",
          "min": 0,
          "max": 2
        }
      },
      "required": [],
      "additionalProperties": true
    }
  }
}
export const LOCALIZEDMESSAGECATALOG_BASIC_VALIDATOR = new SchemaVerifier<LocalizedMessageCatalog>("localized-message-catalog", JSON_SCHEMA)
