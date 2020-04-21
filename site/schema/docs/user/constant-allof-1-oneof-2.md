# Untitled object in Constant Value Schema

```txt
https://groboclown.github.io/kota/site/schema/constant.schema.json#/allOf/1/oneOf/2
```

Reference to a localized message.


| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                     |
| :------------------ | ---------- | -------------- | ------------ | :---------------- | --------------------- | ------------------- | ---------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [constant.schema.json\*](../../../../docs/bin/out/constant.schema.json "open original schema") |

## 2 Type

`object` ([Details](constant-allof-1-oneof-2.md))

# undefined Properties

| Property          | Type     | Required | Nullable       | Defined by                                                                                                                                                                   |
| :---------------- | -------- | -------- | -------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [type](#type)     | `string` | Required | cannot be null | [Constant Value](constant-allof-1-oneof-2-properties-type.md "https&#x3A;//groboclown.github.io/kota/site/schema/constant.schema.json#/allOf/1/oneOf/2/properties/type")     |
| [domain](#domain) | `string` | Required | cannot be null | [Constant Value](constant-allof-1-oneof-2-properties-domain.md "https&#x3A;//groboclown.github.io/kota/site/schema/constant.schema.json#/allOf/1/oneOf/2/properties/domain") |
| [msgid](#msgid)   | `string` | Required | cannot be null | [Constant Value](constant-allof-1-oneof-2-properties-msgid.md "https&#x3A;//groboclown.github.io/kota/site/schema/constant.schema.json#/allOf/1/oneOf/2/properties/msgid")   |

## type




`type`

-   is required
-   Type: `string`
-   cannot be null
-   defined in: [Constant Value](constant-allof-1-oneof-2-properties-type.md "https&#x3A;//groboclown.github.io/kota/site/schema/constant.schema.json#/allOf/1/oneOf/2/properties/type")

### type Type

`string`

### type Constraints

**enum**: the value of this property must be equal to one of the following values:

| Value    | Explanation |
| :------- | ----------- |
| `"l10n"` |             |

## domain




`domain`

-   is required
-   Type: `string`
-   cannot be null
-   defined in: [Constant Value](constant-allof-1-oneof-2-properties-domain.md "https&#x3A;//groboclown.github.io/kota/site/schema/constant.schema.json#/allOf/1/oneOf/2/properties/domain")

### domain Type

`string`

### domain Constraints

**maximum length**: the maximum number of characters for this string is: `200`

**minimum length**: the minimum number of characters for this string is: `1`

## msgid




`msgid`

-   is required
-   Type: `string`
-   cannot be null
-   defined in: [Constant Value](constant-allof-1-oneof-2-properties-msgid.md "https&#x3A;//groboclown.github.io/kota/site/schema/constant.schema.json#/allOf/1/oneOf/2/properties/msgid")

### msgid Type

`string`

### msgid Constraints

**maximum length**: the maximum number of characters for this string is: `200`

**minimum length**: the minimum number of characters for this string is: `1`
