# About

Modules define in their context tree files general definitions that the engine uses to create the world, characters in that world, and stories.  The modules do not define values, but rather define how the values should be shaped.

Throughout this document notes will be made as to how the engine uses the module information to construct values for the world.

Each section describes a top-level data type that can be defined in the module.

<!--
Need to manually maintain this TOC for the moment.
-->

* Text Services
  * [translation](#translation)
  * [localization](#localization)
* Module Lifecycle
  * [install](#install)
* Data Type Definitions
  * [group](#group)
  * [group-value](#group-value)
  * [object-constraints](#object-constraints)
  * [attribute](#attribute)
  * [match](#match)
* Story Building Blocks
  * [base-story](#base-story)
  * [story](#story)
  * [side-story](#side-story)
  * [threat](#threat)



## General Notes

The comment about describing the shape of the data is mostly true.  However, some data must exist just once, and the module marks it by assigning the value an `id` field.


## `translation`

Translations define a collection of locale-specific translation files which use a combination of a *domain* (the context path to the translation) and a *message id* (the key in the translation file).  The engine uses a collection of parameters to fully construct the translated text.

Example:

```(yaml)
translation:
    id: names
    file; name-list
```

Because translations are created just once, they are created with an `id` and inserted into the context tree under `(module path)/(id)`, which creates the domain for the messages.

The messages are stored in files in the same directory as the translation definition `yaml` file, with a name in the format `(file).(locale).json`, where the locale is all lowercase.  In the example above, if the yaml file defining the `name` translation is located in `/modules/23-skidoo/text`, then the domain is `/modules/23-skidoo/text/name`, and the translation files would be like `/modules/23-skidoo/text/name-list.en_uk.json`.

The translation json files have a very simple format.  They are a simple JSON object with the message ID as the key, and the translation as the value.  To handle plural formats, such as "coin" versus "coins",
the message ID is assigned to another object, with each count value
as the key; the default plural number, for any count, is 'plural'.  For things such as name lists, the value is an array of translated text.

```(json)
{
    "simple greeting", "Hello, {name}",
    "formal greeting", "Good {time}, {name}.",
    "male first name", [
        "John", "Ben", "Chuck", "Max"
    ],
    "female first name", [
        "Jane", "Bonnie", "Christy", "Margret"
    ],
    "money": {
        0: "pocket lint",
        1: "a dollar",
        2: "a couple of bucks",
        5: "a five spot",
        10: "a hammy",
        20: "a lunch coupon",
        "plural": "{c:count;,} dollars"
    }
}
```


## `localization`

Localizations describe how to generally work with translated text.  They define which [translations](#translation) can be used, how to map from a specific user's locale to the translations, and how to format numbers and dates.

All localizations should be stored in the `overrides/common/l10n` directory of a module.

Localizations define 3 primary values to help the engine decide which localization to apply for a specific locale.  Because of limited resources, we should assume that not all locales are supported, so the engine will make a best initial guess as to the right locale, while allowing the user to choose their preferred one.

* **parent** - if a parent is set, then the localization is a subset of the parent.  All the parent values are inherited where not defined in this locale.
* **locale** - the formal locale identifier (xx_YY) conforming to standards.  Non-standard locales (such as Klingon) should use the format `x-language` (e.g. `x-klingon`).
* **alternatives** - a list, in less-specific order, of alternative user locales that this one can match.

Additionally, the locale must provide a **name** for the end-user to select.

Locale matching uses the **locale** for an exact match, then checks the alternatives for an exact match; if two locales have the same one, then the one where it appears closer to the start of the list is used.  Then, the matching is done again, but for the language-only aspect.

Localization supports 2 primary sections, **number** and **date-markers**.

### `localization.number`

The number section defines how numbers are shown to the user.  Number formatting for different locales can be tricky.

* **decimal**: text that defines the decimal separator.  Some locales represent ¼ as 0.25 (`decimal: .`), others as 0,25 (`decimal: ,`).
* **grouping**: text that defines how to separate group of digits.  Some locales represent 1000 as 1,000 (`grouping: ,`) and others as 1.000 (`grouping: .`).
* **grouping-count**: the number of digits to put into a group also differs between locales.  This value is an array of number of digits to group in reverse order, with the last number repeated.  Some represent 123456789 as "12,34,56,789" (`grouping-count: [ 3, 2 ]`), and others "123,456,789" (`grouping-count: [ 3 ]`).
* **negative**: symbol to represent negative numbers.  (`negative: "-"`)
* **positive**: symbol to represent positive numbers, if they are explicitly enabled in the formatting (`positive: "+"`)
* **digitsUpper**: symbols to use for the representation of all the digits, for all the different radix (binary, decimal, hexadecimal, etc.).  This implicitly embeds the zero digit.  These must be 1 UTF-8 character per digit.  All locales MUST support EXACTLY 16 digits.
* **digitsLower**: the same as `digitsUpper`, but with lower-case characters.

### `localization.date-markers`

Representing dates is very locale specific.  However, the way the date is shown to the user is a combination of the intention of the text ("Jan 29" vs "Monday, January 29, 2019") and the words for the locale.  The [translation](#translation) should contain date formatting as the language dictates, but the transformation of the Gregarian calendar values to that language is handled by the localization date markers.

Only the Gregarian calendar is supported.  The engine uses native date libraries to handle the nitty gritty details.

A localization can have as many kinds of date markers as desired.  For example, the day of the week can be terse ("M", "Tu"), short ("Mon", "Tue"), or verbose ("Monday", "Tuesday"), and each of these has its own date marker.

The `date-markers` section defines an array of date markers.  Each one must have these fields set:

* **marker**: a single, case-sensitive character used in the date formatting of the translation.  It must be distinct from all other date markers in the locale.
* **from**: the date field to reference; valid values are one of `day`, `month`, `yr` (2 digit year), `year` (4 digit year), and `week` (day of the week).
* And one of these two:
  * **direct-mapping**: set to `true` to indicate the numerical value of the `from` portion of the date is directly inserted into the text.  This is most practical for `yr` and `year`.  For `month` and `day`, this will not be a zero-padded value (so January would just be "1").
  * **mapping**: maps a numeric value to a text value.  For day and month, the value starts at 1 and goes to the end (day is 1 to 31, month is 1 to 12).  For week, the value range is 0 (Sunday) to 6 (Saturday).


## `install`

The module can have "hooks" into the lifecycle of the module in the world.  The "install" hook defines how to add the module into a generated world.

The install defines action groups, and the list of those actions to run.

The install hook runs after the module definitions are loaded into the engine.

You may notice an absense of object creation.  This is due to one of the tenants of the engine - explicit object creation is only done by the engine, not by the modules.  This allows modules to have extreme influence over the consructed stories without being declarative.


### `install.attach-value`

Creates a specific value in a location in the tree.  This is usually used to initialize global state values, like "current date".  These values are allowed to be mutable after install.

Each entry has the following attributes:

* **name**: name of the attribute to create.  By convention, these start with a '@' character.
* **parent**: the location in the global context tree to add.  If it is not an absolute path (i.e. starts with a '/' character), then it is relative to the module's root.
* **type**: type of value to create.  The type may require additional properties to set the value.  Because of the limitations to object creation, the types of values can only be limited.

### `install.update`

Instructs the engine to modify existing values.

*TODO describe what can be put here.*

### `install.start`

Declares a base-story reference (either absolute or relative path) that the player can choose as the starting point for a new game.


## `group`

A "group" is a generic set of strings with a well defined set of possible values.  This can lead to bad modules that abuse this, because matching is sorely limited.  However, there are really good reasons to have a group of unique values.  One way to help extend this concept so it doesn't lead to brittle values is the group value - it must declare what values it contains.  So when a module references 'boat', that value can mean the 'boat' or 'ship' values.

The group-assigned values can change according to whatever other modules desire.  However, the values are staticly defined by modules, and are not changable through game state changes.

Group definitions only define one attribute.

* **name**: name of the group.  This will be inserted into the global context tree according to the standard module name conventions.

```(yaml)
group:
  name: '@container'
```


## `group-value`

A group value is a unique entry inside a [group](#group).  Each group value can have 1 or more "matches" that defines how well it matches to other members in the group, so that if something requests a group value of "boat", it can also possibly match "ship".

Note that a group-value has an implicit match to itself of 100%.

If there are multiple definitions of a group-value name inside the same group, then the engine joins them together into a single entry.  The "matches" values are put into the value, using the maximum of the two.

* **group**: reference to the owning group definition path.
* **name**: name of this group value.
* **matches**: a dictionary of alternate group values (which do not have to exist in the group) mapped to a fuzz value of how well it matches that alternate group value.

```(yaml)
group-value:
  group: /common/roles/@occupation
  name: blacksmith
  matches:
    smith: 100
    craftsman: 100
    tinkerer: 50
    trade: 100
    merchant: 60
    artist: 80
    unskilled: 5
    mason: 10
    manual-labor: 100
```


## `object-constraints`

Defines attributes and the restrictions on those attributes for created objects.

A constraint defines the role that it creates for, but all the attributes generated for the object are defined in child attributes.

A constraint can use other constraints to define the restrictions.  Attributes defined by the constraint itself override any definitions of what it uses.  Likewise, constraints used override previous constraints.

The standard method for constraints is to create a heirarchy of values.  The first constraint is the most generic, and defines all the attributes for that role.

* **name**: the name of the constraint.  Does not need to be unique for the role.
* **includes**: list of other constraints to base this one off of.  Keep in mind the priority for overriding values.

```(yaml)
object-constraints:
    name: blacksmith
    includes:
        - /common/roles/@person/person
        - /common/roles/@person/laborer
        - /common/roles/@person/craftsman
```

The standard usage is to create a yaml file named after the generator, then a directory with that generator name containing all the attribute files, located in the same place as the yaml generator file.  For example:

* `/module/my-module/roles/person/blacksmith/_.yaml` defines the blacksmith generator
* `/module/my-module/roles/person/blacksmith/attributes.yaml` defines attributes created by the generator.

By having them separated in the tree like this, modules can add to the attributes of other modules.

Constraints can define a whole archetype, like "person", or they can define one aspect, such as "old".


## `attribute`

An attribute defines the kind of value that is suitable for a position in the context tree.  These are used by [object-generators](#object-generator) to create values within the bounds of the attribute.

(TODO expand on attributes of the attribute)


## `match`

A match is a description of attribute names (sub-paths under an object) and fuzzy set inclusion rules.  Each data type has different ways of being included in a match.

Matches are defined as nodes in the tree, so that they can be enhanced by multiple modules.

*TODO DEFINE*


## `narrative`

Thw "narrative" is the narrative glue that ties the various stories together.  For the most part, the narrative flow can't be changed.  Defining this merely allows the definition of the details.

The narrative can define requirements, which leads to initial world creation.

The details around the narrative definition are highly dependent upon the implementation of the final game.

*TODO DEFINE*


## `story`

(Nebulous idea.  Still in the works.)

A story is a long form adventure for a "character" to explore.  It has an end goal, main character, and location.  The engine can insert `side-story` and `event-chain` instances into the execution, in order to add extra flavor to the over-arching story.

The events within the story are constrained within the location.  However, events may take the main character to sub-locations.

In order to allow interesting descisions from the player, the story should have pre-defined [threats](#threat) that can be prepared against.

*TODO DEFINE*


## `side-story`

(Nebulous idea.  Still in the works.)

A side story is a series of events that take place within the scope of a [story](#story), and must be resolved before other side-stories or the story can continue.  Think of this as a *stack* of side-stories.

*TODO DEFINE*



## `event-chain`

(Nebulous idea.  Still in the works.)

An event chain takes place within a story, but can happen in parallel - they do not interrupt the side-quest or story, and can live outside the side-story (but must remain contained within the story).  Event chains include characters and events, and may include objects, some of which may even be requirements to other event-chains or side-stories.

An event chain describes a kind of series of events.  The engine will create an instance of the event chain.

Event chains need to have:

* Requirement matchers that describe what is necessary in the story for it to run.  Some matchers can indicate something that may need to be generated (say, an artifact), while others indicate something that can preclude it from running (say, an event chain that is in the desert but the current location is a frigid mountain).
    * All requirements are clearly labeled for use in the event chain.  So, if it needs an object which is a person who is a sailor, then that object can be referenced by itself in the story.
* Events - things that happen.  Events can have:
    * Descriptive media - text, art, sound.  All must be from the main character's point of view.  If there is no media, then it is a silent event, a marker that something happened without the main character's knowledge.
    * Change to context tree data.  The event can set or adjust a value in the context tree.  It cannot change calculated data or mappings; only group members and numeric values.
    * Stop event chain.  The event can cause the owning event chain to stop.  It should not have control over other event chains directly, but it can change data that other events can do.
    * Decision.  The event can require the character to perform a decision - either immediate or some future action - that determines the next event to run.  The list of available decisions can be based on a map (some things just aren't available to certain people).
    * Map to the next event.  The next event to run can also be determined by a mapping.  The engine will make a weighted decision based on the fuzzy containment amount for each mapping.
* A starting event - the first event to run in the chain.


*TODO DEFINE*


## `threat`

(Nebulous idea.  Still in the works.)

Threats are attached to in-game generated objects, and represent a category of obstacle to the primary character.  Some threats can be on the primary character (e.g. alchoholic).  These should be some of the expected obstacles that the character may need to overcome, and gives the player an opportunity to prepare against it.  Threats are used in event-chain construction.  Threats are things the characters are expected to be able to find out within story.

How do we link a threat to a story concept?

Some ideas:

* *Categorical threats*
    * A location can have threats specific to it, that dictate how objects are created.
        * A location can be renoun for how the general population acts.  This would mean that natives to the location tend to side with these categories of threats.  Xenophobic, agressive, shy, etc.  They represent general cultural and societal norms that most people conform to.
        * Threats could also be in the form of cultural taboos and other expectations of behavior that an unprepared person could easily break, which could lead to inferred insults or shunning or religious concequences.  Things like entering a house without shoes, eating the wrong way, using a sacred rock as a lunch table.  These would be things that would require a careful traveler to prepare for and/or hire a friendly local to aid them in the cultural navigation.
        * Locations can also have natural threats - things in the natural world specific to them.  Harsh cold, bears, landslides, poisonous plants, mosquitos, disease, brackish water, black mold.
    * Organizations can have rules that the members are expected to follow, which can themselves be threats.  In this case, the organization itself is not a threat (it's an organization, which is made up of people), but which makes the people in it follow certain behaviors and thus be inclined to general categories of threats.
    * Categorical threats to not mean "may or may not have threat X", but should mean instead "how much of threats similar to X", because people can have different degrees of association with that idea, and it can manifest behaviors in different ways.
    * Categorical threats should probably be made more abstract.  It's essentially a match on individual threats.
        * Yes!  There are two angles to this, that need more thought.  Categories are attached to some objects upon generation, such as locations.  The story uses these + other categories that might be interesting for the story to create the player-viewed threat list.
        * Categories are also used by the precise threats themselves to act as a match.
* *Threat*
    * A threat type would fall into one or more categories, described by the [matching](#match).
    * Threats are their own small-scale stories, on the event level.  This is an immediate hurdle the main character must pass, or at least presents the main character with interesting choices.  Very few should present a hard failure state.
    * Threats can be chained by requirements to meet the next element; for example, if a character manages to contract malaria, then after some time passes, the second half of malaria takes effect (or perhaps malaria is its own threat, and the chance for contracting it was its own).  That's a good one - the character can have its own threats it brings with it. For another example, the character could enter an area prone to avalanches.  If the character then performs a kind of action (say, discharges a firearm), then that can trigger the avalanche; the trigger can also be deactivated, such as by leaving the area which is prone to have avalanches.

So, threat category is a set of mappings that define which threats can be in the category, and the media (text/images/etc) used to describe the threat category to the player.

The threat is an event chain along with mappings that indicate what will trigger it.

The threat category mapping doesn't need special handling for the threat mapping; the two should coincide to work together without any explicit code to handle them.
