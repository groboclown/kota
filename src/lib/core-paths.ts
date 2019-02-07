
/**
 * Hard-coded context paths that are required to exist by the
 * core module.  This implicitly defines the structure of the
 * global context.
 */

import {
  PATH_SEPARATOR, joinRelativePaths
} from './context'

// A path element that starts with this character indicates it's a leaf
// name.  This isn't a hard-and-fast rule, but more of a standard.
export const VALUE_PREFIX = '@'

// An "object", that is, a tree whose child values all build up to describe
// the object.  This is the character that prefixes the name for that element
// in the tree.
export const OBJECT_PREFIX = '+'

// The root tree
export const ROOT_PATH = PATH_SEPARATOR

// ============================================================================
// Top-level trees.

export const MODULE_DIRNAME = 'modules'
/**
 * Where all the modules are stored, each one loaded into a sub-path
 * named after the module ID
 */
export const MODULE_PATH = joinRelativePaths(ROOT_PATH, MODULE_DIRNAME)

export const WORLD_STATE_DIRNAME = 'world'
/**
 * State data.  This is where the world-state data is put, and can be
 * persisted.  Everything else is pulled from modules, and so is static.
 */
export const WORLD_STATE_PATH = joinRelativePaths(ROOT_PATH, WORLD_STATE_DIRNAME)

export const CURRENT_REFERENCES_DIRNAME = 'current'
/**
 * Pointers to other locations in the tree.  This is very session-based
 * in terms of what the pointers look at.  For example, the current user's
 * preferences, or the localization data.
 */
export const CURRENT_REFERENCES_PATH = joinRelativePaths(ROOT_PATH, CURRENT_REFERENCES_DIRNAME)

/**
 * Common values to everything.  For example, roles need to be common across
 * everything.
 */
export const COMMON_STATE_PATH = joinRelativePaths(ROOT_PATH, 'common')

export const APPLICATION_STATE_DIRNAME = 'application'
/**
 * Persistent data for the entire application.  Things like install location,
 * and per-user app-specific preferences (volume level, language).  This data
 * has nothing to do with an individual game, but does matter for certain
 * display options, like vulgarity level.
 */
export const APPLICATION_STATE_PATH = joinRelativePaths(ROOT_PATH, APPLICATION_STATE_DIRNAME)

// ============================================================================
// Module tree

/**
 * Files that a module puts into its root `overrides` folder will use that
 * as an implicit relative path for overriding other modules.  This can be
 * super handy for modules which are translations.
 *
 * This means, however, that extra care must be taken when constructing a
 * model of the data.  Any data that references the original file locations
 * must be based on the override file location, not the translated path.
 * Also, for debugging purposes, it is useful to maintain the source location.
 */
export const MODULE_OVERRIDE_SUBPATH = 'overrides'


// ---------------------
// The built-in `core` module
export const CORE_MODULE_ID = 'core'
export const CORE_MODULE_PATH = joinRelativePaths(MODULE_PATH, CORE_MODULE_ID)

export const CORE_ERROR_DOMAIN = joinRelativePaths(CORE_MODULE_PATH, 'system-text', 'errors')


// ============================================================================
// World data tree.

/**
 * Information about the user-provided data that generates the world.  Things
 * like world size, rumor frequency, and population anger level.
 */
export const WORLD_GEN_PARAMETER_PATH = joinRelativePaths(WORLD_STATE_PATH, 'gen')

/**
 * Each sub-path is the user ID's data.  This includes per-user preferences
 * specific to the game.
 */
export const ALL_USER_SETTINGS_PATH = joinRelativePaths(WORLD_STATE_PATH, 'users')


// ============================================================================
// Current pointer tree

/** pointer into the user's preferences, a mix of world state data and
 * application-wide data. */
export const CURRENT_USER_PREFERENCES_PATH = joinRelativePaths(CURRENT_REFERENCES_PATH, 'preferences')


// ============================================================================
// Template argument tree

export const CURRENT_FUNCTION_ARGUMENTS_PATH = joinRelativePaths(CURRENT_REFERENCES_PATH, 'function', 'arguments')
export const CURRENT_FUNCTION_ARGUMENT_0_PATH = joinRelativePaths(CURRENT_FUNCTION_ARGUMENTS_PATH, '0')


// ============================================================================
// Common values

export const COMMON_LOCALIZATIONS_PATH = joinRelativePaths(COMMON_STATE_PATH, 'function', 'l10n')
