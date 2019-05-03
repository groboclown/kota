/* AUTO GENERATED FILE.  DO NOT MODIFY. */
/* tslint:disable */
import { SchemaVerifier } from '../validator'

/**
 * The module.json file contents must conform to this standard.
 *
 */
export interface ModuleHeader {
  id: string
  name: string
  description: string
  version: number[]
  authors: string[]
  /**
   * List of licenses.  If your module requires a special license validation for Piracy Protection, then you will need to include a license validator in the load module call.
   *
   */
  license: string[]
  source: string[]
  /**
   * A list of module ID and version number that this module depends upon being loaded first.
   *
   */
  requires: string[]
}

const JSON_SCHEMA = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://groboclown.github.io/kota/site/schema/compiled/module.schema.json",
  "title": "ModuleHeader",
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
      "type": "array",
      "items": {
        "type": "number",
        "min": 0
      },
      "minLength": 1
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
  "additionalProperties": false,
  "required": [
    "id",
    "name",
    "description",
    "version",
    "authors",
    "license",
    "source",
    "requires"
  ]
}
export const MODULEHEADER_BASIC_VALIDATOR = new SchemaVerifier<ModuleHeader>("module", JSON_SCHEMA)
