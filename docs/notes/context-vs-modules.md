# Global Context and Modules

The Global Context is a simple namespace key mapping to values.  It follows
some conventions:

* '/' is called the "path separator".
* All entries start with a path separator.
* The value part is prefixed with a `@`.
* A path that designates an object, with leaf values being supporting values
  for that object, are prefixed with a `+`.

Different spaces in the name are reserved for different purposes:

* **/modules** - Each module file has its yaml files stored into
  `/modules/(module Unique ID)/(relative file directory)/(file contents)`.
  Note that the filename is *not* part of the context path, but the directory name is.
  Also note that only yaml files declared in the `module.list` file are loaded here.
* **/world** - all game state data is stored here.  This is the only part that
  is persisted as a "save game".
* **/world/users/(name)** - details for the player.  This allows potential
  expansion for multiplayer games.
* **/world/gen** - information used to generate the world.  Initial random
  seed, or world size, etc.
* **/current** - a carefully constructed local set of pointers based on
  configuration data.  This is considered "session" data, where its contents
  depend upon the current player settings, story, etc.
* **/current/preferences** - information about the current user's settings.
  This can be volume, language settings, etc.  This is mapped from "/application/"
* **/modules/(module id)/overrides** - Tree that allows a module to override
  values in other modules.  This is particularly handy for creating new
  translations as add-on modules, or providing a high-def graphics pack.
* **/common** - Values that are common to everything, such as roles.
* **/application/(user)** - a separate storage for this computer; it is not
  persisted as part of the game save.  Each user can have their own
  preferences, but some are generic.

Pointers should be used only in the **/current** path.

*This information is taken from the [core-paths](../src/lib/core-paths.ts) file.*

# Object Definition vs Object Constraints

One of the tenants of the system is that no part of the system explicitly describes what should be created.  Instead, it defines requirements.

For example, a story does not say that the antagonist is a sailor.  Instead, it requires that the antagonist conform to the sailor prototype.  This is a subtle but distinct difference.  The engine doesn't need to create an object.  It can reuse existing ones, or create one if it can't find an applicable candidate.

