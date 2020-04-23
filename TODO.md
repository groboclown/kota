# List of To Do Items


## Restructuring

These are notes about the current implementation, in terms of how the code should be updated based on better coding practices or redesign of the architecture.


### Data Validation

The data validation needs to be setup to use json schema files.  These could be stored as `yaml` files, but they will need to be transformed into json format for efficient usage.

* **core-game**
    * the `compiler/schema` tree is not necessary.
    * the `model/module` path needs to change to use the json schema.
* **module**
    * the module package uses compiled schema (`src/model/schema`) from `data/file-schema`, which is the correct approach.  Some of the invoking API should be further examined for automated generation.
    * Note: This package is for the user-constructed files.  The compiled versions must be broken into a separate package for the compiler to be able to import both, and the core-game to import just the compiled format.


### Translations

The translation information is fine as-is for raw module stuff.  However, for the core game, this needs to be integrated into the tree structure.  This means translatable strings are a container for translations.  The data definitions need to redefine the concept of "static string" to match this.


### Timer Data Type

A new data type should be a "timer" that counts up based on the world time (turn based, real-time seconds, or whatever the game uses as the world time).  Under the covers, these are simply an integer that defines when the timer value was created, and the timer value is really the delta between the current world time and the when-initialized value.


### Compiler

The core game should use as tightly parsed data format as possible.  It can be verbose and difficult to read, but in the effort to make in-game parsing minimal.  These data structures should be as close to the in-memory structures as possible.

* Split the `module` package into `module-user` and `module-compiled`.  The compiler will use both, and the core-game will use just the `module-compiled`.

Compiled files need to include trace information so that errors can be linked back to the original sources.


## Format Strings

The format strings are super hard to write and get right.  They make the text obtuse and tricky to read.  This needs to be seriously cleaned up.

For one, more of the format string text can be pushed into the attribute itself.  In general, most attributes have a set way to show the data.  Things like capitalization, grammatical form, and so on would be different categories of attribute text formats.  The categories should optionally include a default category, because some may require a choice.  Some attributes would require a "count" or some other optional attribute.  This may be included in the attribute tree?  This requires additional investigation.


## Design

These are notes about the current design, and how it needs to change.  Each note requires deeper thought and integration into the rest of the design.

* **story** - This construction needs to be well thought out.
* **computed values** - In order to support linear programming to solve possible values for a category, the mathematical operations can only be in the form `sum(a[j] * x[j])`, where `a[j]` are constant values at the time of the computation (and so can be complex expressions on constant values) and `x[j]` are values-to-solve-for.


## Optimizations

* `base-libs/src/log` - cache log objects for faster log changes.  This prevents the continual lookup overhead.


## Documentation

Have a tool to convert the schema to documentation.  The existing tool is bad, seriously bad.
