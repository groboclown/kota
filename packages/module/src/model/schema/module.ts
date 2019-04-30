/* AUTO GENERATED FILE.  DO NOT MODIFY. */
/* tslint:disable */
import { SchemaVerifier } from '../validator'

/**
 * The module.json file contents must conform to this standard.
 *
 */
export interface Module {
  id: string
  name: string
  description: string
  version: string
  authors?: string[]
  /**
   * List of licenses.  If your module requires a special license validation for Piracy Protection, then you will need to include a license validator in the load module call.
   *
   */
  license?: string[]
  source?: string[]
  /**
   * A list of module ID and version number that this module depends upon being loaded first.
   *
   */
  requires?: string[]
  [k: string]: any
}

const JSON_SCHEMA = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://groboclown.github.io/kota/site/schema/compiled/module.schema.json",
  "title": "Module",
  "description": "The module.json file contents must conform to this standard.\n",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^[a-zA-Z][-a-zA-Z0-9]+$",
      "minLength": 4
    },
    "name": {
      "type": "string",
      "minLength": 4,
      "maxLength": 60
    },
    "description": {
      "type": "string",
      "minLength": 4,
      "maxLength": 2000
    },
    "version": {
      "type": "string",
      "pattern": "^[0-9]+(\\.[0-9]+)*$"
    },
    "authors": {
      "type": "array",
      "items": {
        "type": "string",
        "minLength": 2,
        "maxLength": 60
      },
      "uniqueItems": true
    },
    "license": {
      "description": "List of licenses.  If your module requires a special license validation for Piracy Protection, then you will need to include a license validator in the load module call.\n",
      "type": "array",
      "items": {
        "type": "string",
        "minLength": 2,
        "maxLength": 60
      },
      "uniqueItems": true
    },
    "source": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "uniqueItems": true
    },
    "requires": {
      "description": "A list of module ID and version number that this module depends upon being loaded first.\n",
      "type": "array",
      "items": {
        "type": "string",
        "pattern": "^[a-zA-Z][-a-zA-Z0-9]+\\s+[0-9]+(\\.[0-9]+)*$"
      }
    }
  },
  "additionalPropeties": false,
  "required": [
    "id",
    "name",
    "description",
    "version"
  ]
}
export const VALIDATOR = new SchemaVerifier<Module>("module", JSON_SCHEMA)
