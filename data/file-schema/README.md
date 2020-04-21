# About

This is the formal [schema](http://json-schema.org/) defining the supported non-media file types.

This is broken into two groups - the user-constructed files, and the compiled files.

For the user-constructed files, KotA has additional restrictions, such as the file must be in `yaml` format and start with `---(EOL)`.

Each file represents a single object type.  The union of these files is the allowable contents.  The exception is the [`module.yaml`](module.schema.yaml) format; it must exist by itself in its own file.
