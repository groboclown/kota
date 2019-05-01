/* AUTO GENERATED FILE.  DO NOT MODIFY. */
/* tslint:disable */
import { SchemaVerifier } from '../validator'

export type BlockStyle = 'para' | 'quote' | 'signature' | 'header' | 'subhead' | 'right' | 'section'
export type MessageSpan = SpanStyle & MessageText
export type VariableSpan = SpanStyle & VariableText
/**
 * This interface was referenced by `ArgumentMapping`'s JSON-Schema definition
 * via the `patternProperty` "^[-,. -+0-9a-zA-Z]+$".
 */
export type ArgumentReference = string

/**
 * A catalog of localized text translations.  The translations have been pre-parsed for output.  At the top level, each key corresponds to a "msgid" in a localized message.
 * Localized text includes formatting notes for the output and variable lookup and formatting placeholders.
 *
 */
export interface LocalizedText {
  [k: string]: any
}
export interface LocalizedMessageBlock {
  blockStyle: BlockStyle
  text: (MessageSpan | VariableSpan)[]
}
export interface SpanStyle {
  weight?: number
  slant?: number
  underline?: number
  strikethrough?: number
}
export interface MessageText {
  type: 'text'
  text: string
}
export interface VariableText {
  type: 'var'
  formatMarker: string
  keyValueNames?: ArgumentMapping
  template: (MessageText | VariableText)[]
}
export interface ArgumentMapping {
  [k: string]: ArgumentReference
}

const JSON_SCHEMA = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://groboclown.github.io/kota/site/schema/compiled/localized-text.schema.json",
  "title": "LocalizedText",
  "description": "A catalog of localized text translations.  The translations have been pre-parsed for output.  At the top level, each key corresponds to a \"msgid\" in a localized message.\nLocalized text includes formatting notes for the output and variable lookup and formatting placeholders.\n",
  "definitions": {
    "LocalizedMessageBlock": {
      "type": "object",
      "properties": {
        "blockStyle": {
          "$ref": "#/definitions/BlockStyle"
        },
        "text": {
          "type": "array",
          "items": {
            "oneOf": [
              {
                "$ref": "#/definitions/MessageSpan"
              },
              {
                "$ref": "#/definitions/VariableSpan"
              }
            ]
          }
        }
      },
      "required": [
        "blockStyle",
        "text"
      ],
      "additionalProperties": false
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
    "MessageSpan": {
      "allOf": [
        {
          "$ref": "#/definitions/SpanStyle"
        },
        {
          "$ref": "#/definitions/MessageText"
        }
      ]
    },
    "VariableSpan": {
      "allOf": [
        {
          "$ref": "#/definitions/SpanStyle"
        },
        {
          "$ref": "#/definitions/VariableText"
        }
      ]
    },
    "MessageText": {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "text"
          ]
        },
        "text": {
          "type": "string"
        }
      },
      "required": [
        "type",
        "text"
      ],
      "additionalProperties": false
    },
    "VariableText": {
      "type": "object",
      "properties": {
        "type": {
          "type": "string",
          "enum": [
            "var"
          ]
        },
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
            "oneOf": [
              {
                "$ref": "#/definitions/MessageText"
              },
              {
                "$ref": "#/definitions/VariableText"
              }
            ]
          }
        }
      },
      "required": [
        "type",
        "formatMarker",
        "template"
      ],
      "additionalProperties": false
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
      "additionalProperties": false
    }
  },
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
export const LOCALIZEDTEXT_VALIDATOR = new SchemaVerifier<LocalizedText>("localized-text", JSON_SCHEMA)
