# World Gen

When a new world is generated, the basics for all the blanks in the stories
are created.

## When It Is Generated

The world is generated the very first time the game is loaded.  The player is
given a single random seed that they always have.  New games continue where
the last game left off (in terms of the "discovery" of new things in the game).

## What Is Created

* Current language
    * Name
* Current people
    * Name
    * Current Culture
    * Current language
    * Architecture style
    * Technology level
* General Regions
    * Climate
    * Names
    * Locations relative to each other
    * Possibility: this is fixed (mostly), to better give the illusion that the
      world is all the same for everyone.
    * Current people - should be in roughly neighbor regions.
        Can have multiple people in a region.
    * Relations with other regions (war, peace, etc)
* Core religions
    * At world gen, several core religions are created.  These represent the
      basic ideas that the earliest peoples had.  The core religions aren't
      restricted to any one place, because they are so old that their ideas
      spread through the ancient world.
    * Deities
        * names
        * roles.  Roles may overlap
        * personality attributes
        * heritage
    * Monster names and roles.
    * Ideas of afterlife, magic, soul, and places "beyond".
    * Basic stories for the deities.
* Derived Religions
    * To represent time, layers of derived religions are created.
    * These are combinations of mutations and derivations of other religions.
      * Names can change
      * deities can merge together
      * deities can split apart
      * roles can merge
      * stories are generally the same, but they can merge or have different
        details change.
    * Should be given a general timeline for when they were created, so that
      it aligns with the ancient peoples.
* Ancient Languages
    * Name
    * Heritage
* Ancient Cultures
    * Ancient Religion (just 1)
    * Architecture
    * Technology level
    * Ancient Language
    * General time frame.
* Ancient Peoples
    * Name
    * Region (only 1)
    * Important people
        * names
        * personality attributes
    * Relations to other ancient peoples.
    * Heritage (were they from 1 or more other peoples?)
    * Ancient Culture (just 1)
    * Stories
    * General time frame.
* Current Locations
    * Individual small cities.
    * Region / place on the map
    * Current people (just 1 for simplicity)
    * Military level


If needed, new parts of the world can be created. (Think about if this is right or not)

- General locations should be easy to create when needed.
