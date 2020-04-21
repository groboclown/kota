# Untitled object in Top-Level Module File Schema Schema

```txt
https://groboclown.github.io/kota/site/schema/module.schema.json#/properties/hooks/properties/upgrade/items
```




| Abstract            | Extensible | Status         | Identifiable | Custom Properties | Additional Properties | Access Restrictions | Defined In                                                                                 |
| :------------------ | ---------- | -------------- | ------------ | :---------------- | --------------------- | ------------------- | ------------------------------------------------------------------------------------------ |
| Can be instantiated | No         | Unknown status | No           | Forbidden         | Forbidden             | none                | [module.schema.json\*](../../../../docs/bin/out/module.schema.json "open original schema") |

## items Type

`object` ([Details](module-properties-hooks-properties-upgrade-items.md))

# undefined Properties

| Property                    | Type     | Required | Nullable       | Defined by                                                                                                                                                                                                                                           |
| :-------------------------- | -------- | -------- | -------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [fromVersion](#fromVersion) | `string` | Optional | cannot be null | [Top-Level Module File Schema](module-properties-hooks-properties-upgrade-items-properties-fromversion.md "https&#x3A;//groboclown.github.io/kota/site/schema/module.schema.json#/properties/hooks/properties/upgrade/items/properties/fromVersion") |
| [script](#script)           | `string` | Optional | cannot be null | [Top-Level Module File Schema](module-properties-hooks-properties-upgrade-items-properties-script.md "https&#x3A;//groboclown.github.io/kota/site/schema/module.schema.json#/properties/hooks/properties/upgrade/items/properties/script")           |

## fromVersion




`fromVersion`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Top-Level Module File Schema](module-properties-hooks-properties-upgrade-items-properties-fromversion.md "https&#x3A;//groboclown.github.io/kota/site/schema/module.schema.json#/properties/hooks/properties/upgrade/items/properties/fromVersion")

### fromVersion Type

`string`

### fromVersion Constraints

**pattern**: the string must match the following regular expression: 

```regexp
^[0-9]+(\.[0-9]+)*$
```

[try pattern](https://regexr.com/?expression=%5E%5B0-9%5D%2B(%5C.%5B0-9%5D%2B)*%24 "try regular expression with regexr.com")

## script




`script`

-   is optional
-   Type: `string`
-   cannot be null
-   defined in: [Top-Level Module File Schema](module-properties-hooks-properties-upgrade-items-properties-script.md "https&#x3A;//groboclown.github.io/kota/site/schema/module.schema.json#/properties/hooks/properties/upgrade/items/properties/script")

### script Type

`string`
