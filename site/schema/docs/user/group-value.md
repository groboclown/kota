# Group Value Module File Entry Schema

```txt
https://groboclown.github.io/kota/site/schema/group-value.schema.json
```

A group value is a single, disctinct name in a group.  For each group, there can exist at most 1 group value with that name.  Group values can include a mapping of "how much" this group value maps onto other group values within the same owning group.  Additionally, each group value has a path reference, which refers to the owning value (one specific example is in roles, where a role references a collection of child attributes).


| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                         |
| :------------------ | ---------- | -------------- | ------------ | :---------------- | --------------------- | ------------------- | -------------------------------------------------------------------------------------------------- |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Allowed               | none                | [group-value.schema.json](../../../../docs/bin/out/group-value.schema.json "open original schema") |

## Group Value Module File Entry Type

`object` ([Group Value Module File Entry](group-value.md))

# Group Value Module File Entry Properties

| Property        | Type     | Required | Nullable       | Defined by                                                                                                                                                      |
| :-------------- | -------- | -------- | -------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [group](#group) | `string` | Optional | cannot be null | [Group Value Module File Entry](group-value-properties-group.md "https&#x3A;//groboclown.github.io/kota/site/schema/group-value.schema.json#/properties/group") |
| [name](#name)   | `string` | Optional | cannot be null | [Group Value Module File Entry](group-value-properties-name.md "https&#x3A;//groboclown.github.io/kota/site/schema/group-value.schema.json#/properties/name")   |

## group




`group`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Group Value Module File Entry](group-value-properties-group.md "https&#x3A;//groboclown.github.io/kota/site/schema/group-value.schema.json#/properties/group")

### group Type

`string`

### group Constraints

**maximum length**: the maximum number of characters for this string is: `2000`

**minimum length**: the minimum number of characters for this string is: `2`

## name




`name`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Group Value Module File Entry](group-value-properties-name.md "https&#x3A;//groboclown.github.io/kota/site/schema/group-value.schema.json#/properties/name")

### name Type

`string`

### name Constraints

**maximum length**: the maximum number of characters for this string is: `200`

**minimum length**: the minimum number of characters for this string is: `1`
