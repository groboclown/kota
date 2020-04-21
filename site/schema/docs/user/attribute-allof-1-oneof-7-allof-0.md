# Untitled object in Attribute Module File Entry Schema

```txt
https://groboclown.github.io/kota/site/schema/attribute.schema.json#/allOf/1/oneOf/7/allOf/0
```




| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                       |
| :------------------ | ---------- | -------------- | ------------ | :---------------- | --------------------- | ------------------- | ------------------------------------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [attribute.schema.json\*](../../../../docs/bin/out/attribute.schema.json "open original schema") |

## 0 Type

`object` ([Details](attribute-allof-1-oneof-7-allof-0.md))

# undefined Properties

| Property      | Type     | Required | Nullable       | Defined by                                                                                                                                                                                              |
| :------------ | -------- | -------- | -------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [type](#type) | `string` | Required | cannot be null | [Attribute Module File Entry](attribute-allof-1-oneof-7-allof-0-properties-type.md "https&#x3A;//groboclown.github.io/kota/site/schema/attribute.schema.json#/allOf/1/oneOf/7/allOf/0/properties/type") |
| [for](#for)   | `string` | Required | cannot be null | [Attribute Module File Entry](attribute-allof-1-oneof-7-allof-0-properties-for.md "https&#x3A;//groboclown.github.io/kota/site/schema/attribute.schema.json#/allOf/1/oneOf/7/allOf/0/properties/for")   |
| [ramp](#ramp) | `number` | Optional | cannot be null | [Attribute Module File Entry](attribute-allof-1-oneof-7-allof-0-properties-ramp.md "https&#x3A;//groboclown.github.io/kota/site/schema/attribute.schema.json#/allOf/1/oneOf/7/allOf/0/properties/ramp") |

## type




`type`

-   is required
-   Type: `string`
-   cannot be null
-   defined in: [Attribute Module File Entry](attribute-allof-1-oneof-7-allof-0-properties-type.md "https&#x3A;//groboclown.github.io/kota/site/schema/attribute.schema.json#/allOf/1/oneOf/7/allOf/0/properties/type")

### type Type

`string`

### type Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value               | Explanation |
| :------------------ | ----------- |
| `"calculated-near"` |             |

## for

the attribute in the context that the function uses.


`for`

-   is required
-   Type: `string`
-   cannot be null
-   defined in: [Attribute Module File Entry](attribute-allof-1-oneof-7-allof-0-properties-for.md "https&#x3A;//groboclown.github.io/kota/site/schema/attribute.schema.json#/allOf/1/oneOf/7/allOf/0/properties/for")

### for Type

`string`

### for Constraints

**pattern**: the string must match the following regular expression: 

```regexp
^[^\s/]+$
```

[try pattern](https://regexr.com/?expression=%5E%5B%5E%5Cs%2F%5D%2B%24 "try regular expression with regexr.com")

## ramp

linear ramp distance from 0 to 1


`ramp`

-   is optional
-   Type: `number`
-   cannot be null
-   defined in: [Attribute Module File Entry](attribute-allof-1-oneof-7-allof-0-properties-ramp.md "https&#x3A;//groboclown.github.io/kota/site/schema/attribute.schema.json#/allOf/1/oneOf/7/allOf/0/properties/ramp")

### ramp Type

`number`
