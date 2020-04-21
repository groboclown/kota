# Top-Level Module File Schema Schema

```txt
https://groboclown.github.io/kota/site/schema/module.schema.json
```

The module.yaml file contents must conform to this standard.


| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                               |
| :------------------ | ---------- | -------------- | ------------ | :---------------- | --------------------- | ------------------- | ---------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [module.schema.json](../../../../docs/bin/out/module.schema.json "open original schema") |

## Top-Level Module File Schema Type

`object` ([Top-Level Module File Schema](module.md))

# Top-Level Module File Schema Properties

| Property                    | Type     | Required | Nullable       | Defined by                                                                                                                                                       |
| :-------------------------- | -------- | -------- | -------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [id](#id)                   | `string` | Required | cannot be null | [Top-Level Module File Schema](module-properties-id.md "https&#x3A;//groboclown.github.io/kota/site/schema/module.schema.json#/properties/id")                   |
| [name](#name)               | `string` | Required | cannot be null | [Top-Level Module File Schema](module-properties-name.md "https&#x3A;//groboclown.github.io/kota/site/schema/module.schema.json#/properties/name")               |
| [description](#description) | `string` | Required | cannot be null | [Top-Level Module File Schema](module-properties-description.md "https&#x3A;//groboclown.github.io/kota/site/schema/module.schema.json#/properties/description") |
| [version](#version)         | `string` | Required | cannot be null | [Top-Level Module File Schema](module-properties-version.md "https&#x3A;//groboclown.github.io/kota/site/schema/module.schema.json#/properties/version")         |
| [authors](#authors)         | `array`  | Optional | cannot be null | [Top-Level Module File Schema](module-properties-authors.md "https&#x3A;//groboclown.github.io/kota/site/schema/module.schema.json#/properties/authors")         |
| [license](#license)         | `array`  | Optional | cannot be null | [Top-Level Module File Schema](module-properties-license.md "https&#x3A;//groboclown.github.io/kota/site/schema/module.schema.json#/properties/license")         |
| [source](#source)           | `array`  | Optional | cannot be null | [Top-Level Module File Schema](module-properties-source.md "https&#x3A;//groboclown.github.io/kota/site/schema/module.schema.json#/properties/source")           |
| [requires](#requires)       | `array`  | Optional | cannot be null | [Top-Level Module File Schema](module-properties-requires.md "https&#x3A;//groboclown.github.io/kota/site/schema/module.schema.json#/properties/requires")       |
| [hooks](#hooks)             | `object` | Optional | cannot be null | [Top-Level Module File Schema](module-properties-hooks.md "https&#x3A;//groboclown.github.io/kota/site/schema/module.schema.json#/properties/hooks")             |

## id




`id`

-   is required
-   Type: `string`
-   cannot be null
-   defined in: [Top-Level Module File Schema](module-properties-id.md "https&#x3A;//groboclown.github.io/kota/site/schema/module.schema.json#/properties/id")

### id Type

`string`

### id Constraints

**minimum length**: the minimum number of characters for this string is: `4`

**pattern**: the string must match the following regular expression: 

```regexp
^[a-zA-Z][-a-zA-Z0-9]+$
```

[try pattern](https://regexr.com/?expression=%5E%5Ba-zA-Z%5D%5B-a-zA-Z0-9%5D%2B%24 "try regular expression with regexr.com")

## name




`name`

-   is required
-   Type: `string`
-   cannot be null
-   defined in: [Top-Level Module File Schema](module-properties-name.md "https&#x3A;//groboclown.github.io/kota/site/schema/module.schema.json#/properties/name")

### name Type

`string`

### name Constraints

**maximum length**: the maximum number of characters for this string is: `60`

**minimum length**: the minimum number of characters for this string is: `4`

## description




`description`

-   is required
-   Type: `string`
-   cannot be null
-   defined in: [Top-Level Module File Schema](module-properties-description.md "https&#x3A;//groboclown.github.io/kota/site/schema/module.schema.json#/properties/description")

### description Type

`string`

### description Constraints

**maximum length**: the maximum number of characters for this string is: `2000`

**minimum length**: the minimum number of characters for this string is: `4`

## version




`version`

-   is required
-   Type: `string`
-   cannot be null
-   defined in: [Top-Level Module File Schema](module-properties-version.md "https&#x3A;//groboclown.github.io/kota/site/schema/module.schema.json#/properties/version")

### version Type

`string`

### version Constraints

**pattern**: the string must match the following regular expression: 

```regexp
^[0-9]+(\.[0-9]+)*$
```

[try pattern](https://regexr.com/?expression=%5E%5B0-9%5D%2B(%5C.%5B0-9%5D%2B)*%24 "try regular expression with regexr.com")

## authors




`authors`

-   is optional
-   Type: `string[]`
-   cannot be null
-   defined in: [Top-Level Module File Schema](module-properties-authors.md "https&#x3A;//groboclown.github.io/kota/site/schema/module.schema.json#/properties/authors")

### authors Type

`string[]`

### authors Constraints

**unique items**: all items in this array must be unique. Duplicates are not allowed.

## license

List of licenses.  If your module requires a special license validation for Piracy Protection, then you will need to include a license validator in the load module call.


`license`

-   is optional
-   Type: `string[]`
-   cannot be null
-   defined in: [Top-Level Module File Schema](module-properties-license.md "https&#x3A;//groboclown.github.io/kota/site/schema/module.schema.json#/properties/license")

### license Type

`string[]`

### license Constraints

**unique items**: all items in this array must be unique. Duplicates are not allowed.

## source




`source`

-   is optional
-   Type: `uri[]`
-   cannot be null
-   defined in: [Top-Level Module File Schema](module-properties-source.md "https&#x3A;//groboclown.github.io/kota/site/schema/module.schema.json#/properties/source")

### source Type

`uri[]`

### source Constraints

**unique items**: all items in this array must be unique. Duplicates are not allowed.

## requires

A list of module ID and version number that this module depends upon being loaded first.


`requires`

-   is optional
-   Type: `string[]`
-   cannot be null
-   defined in: [Top-Level Module File Schema](module-properties-requires.md "https&#x3A;//groboclown.github.io/kota/site/schema/module.schema.json#/properties/requires")

### requires Type

`string[]`

## hooks




`hooks`

-   is optional
-   Type: `object` ([Details](module-properties-hooks.md))
-   cannot be null
-   defined in: [Top-Level Module File Schema](module-properties-hooks.md "https&#x3A;//groboclown.github.io/kota/site/schema/module.schema.json#/properties/hooks")

### hooks Type

`object` ([Details](module-properties-hooks.md))
