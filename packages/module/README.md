# About

Handles the data models used by the core KotA engine.  End users should be assumed to use the pre-compiled versions of these files, as these ones are difficult to maintain.

The data model for the different files are stored in JSON Schema files, and this package converts those into TypeScript source files.  The module thus includes both the model declaration and the input validation for said model.
