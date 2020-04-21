# Untitled object in Attribute Module File Entry Schema

```txt
https://groboclown.github.io/kota/site/schema/attribute.schema.json#/allOf/1/oneOf/8
```




| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                       |
| :------------------ | ---------- | -------------- | ------------ | :---------------- | --------------------- | ------------------- | ------------------------------------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [attribute.schema.json\*](../../../../docs/bin/out/attribute.schema.json "open original schema") |

## 8 Type

`object` ([Details](attribute-allof-1-oneof-8.md))

# undefined Properties

| Property                  | Type     | Required | Nullable       | Defined by                                                                                                                                                                                          |
| :------------------------ | -------- | -------- | -------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [type](#type)             | `string` | Optional | cannot be null | [Attribute Module File Entry](attribute-allof-1-oneof-8-properties-type.md "https&#x3A;//groboclown.github.io/kota/site/schema/attribute.schema.json#/allOf/1/oneOf/8/properties/type")             |
| [expression](#expression) | `string` | Optional | cannot be null | [Attribute Module File Entry](attribute-allof-1-oneof-8-properties-expression.md "https&#x3A;//groboclown.github.io/kota/site/schema/attribute.schema.json#/allOf/1/oneOf/8/properties/expression") |
| [requires](#requires)     | `object` | Optional | cannot be null | [Attribute Module File Entry](attribute-allof-1-oneof-8-properties-requires.md "https&#x3A;//groboclown.github.io/kota/site/schema/attribute.schema.json#/allOf/1/oneOf/8/properties/requires")     |
| [bound](#bound)           | `object` | Optional | cannot be null | [Attribute Module File Entry](attribute-allof-1-oneof-8-properties-bound.md "https&#x3A;//groboclown.github.io/kota/site/schema/attribute.schema.json#/allOf/1/oneOf/8/properties/bound")           |
| [round](#round)           | `string` | Optional | cannot be null | [Attribute Module File Entry](attribute-allof-1-oneof-8-properties-round.md "https&#x3A;//groboclown.github.io/kota/site/schema/attribute.schema.json#/allOf/1/oneOf/8/properties/round")           |

## type




`type`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Attribute Module File Entry](attribute-allof-1-oneof-8-properties-type.md "https&#x3A;//groboclown.github.io/kota/site/schema/attribute.schema.json#/allOf/1/oneOf/8/properties/type")

### type Type

`string`

### type Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value                 | Explanation |
| :-------------------- | ----------- |
| `"calculated-number"` |             |

## expression

computation string expression


`expression`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Attribute Module File Entry](attribute-allof-1-oneof-8-properties-expression.md "https&#x3A;//groboclown.github.io/kota/site/schema/attribute.schema.json#/allOf/1/oneOf/8/properties/expression")

### expression Type

`string`

### expression Constraints

**maximum length**: the maximum number of characters for this string is: `200`

**minimum length**: the minimum number of characters for this string is: `3`

## requires

map of expression variable names to context attribute name


`requires`

-   is optional
-   Type: `object` ([Details](attribute-allof-1-oneof-8-properties-requires.md))
-   cannot be null
-   defined in: [Attribute Module File Entry](attribute-allof-1-oneof-8-properties-requires.md "https&#x3A;//groboclown.github.io/kota/site/schema/attribute.schema.json#/allOf/1/oneOf/8/properties/requires")

### requires Type

`object` ([Details](attribute-allof-1-oneof-8-properties-requires.md))

## bound

boundary conditions


`bound`

-   is optional
-   Type: `object` ([Details](attribute-allof-1-oneof-8-properties-bound.md))
-   cannot be null
-   defined in: [Attribute Module File Entry](attribute-allof-1-oneof-8-properties-bound.md "https&#x3A;//groboclown.github.io/kota/site/schema/attribute.schema.json#/allOf/1/oneOf/8/properties/bound")

### bound Type

`object` ([Details](attribute-allof-1-oneof-8-properties-bound.md))

## round




`round`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Attribute Module File Entry](attribute-allof-1-oneof-8-properties-round.md "https&#x3A;//groboclown.github.io/kota/site/schema/attribute.schema.json#/allOf/1/oneOf/8/properties/round")

### round Type

`string`

### round Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value       | Explanation |
| :---------- | ----------- |
| `"floor"`   |             |
| `"ceiling"` |             |
| `"closest"` |             |
