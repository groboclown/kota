# About

Modules consist of a collection of files written in a very specific format.  We've made an effort to make these easier to use than other file formats, but you still need to be careful about how you write them.

Note that these files will be processed to generate simplified versions of the data for use by the engine.


## General Formats

There are several file formats used by the system.  We've attempted to make them standards-compliant.

### Files whose name end in `.list`

These are simple text files that use one line of text per item in the list.  They allow for empty lines, arbitrary spacing before and after the text, and for comments.

As an example:

```
single line which has some whitespace and text.
# This is a comment line - we can tell that because it has a '#' at the start.
  # Comment lines can even have whitespace at the start.
  Lines, like this, will have their leading and trailing whitepsace ignored.

You can escape some text, such as \t to represent a tab character.
You can continue a line with a trailing backslash \
if you want multi-line text.
You can also embed UTF-8 character codes directly, like \U+00A5 (a Yen symbol).
```

A full list of UTF-8 character codes can be found [here](https://www.fileformat.info/info/charset/UTF-8/list.htm).

Files are read with UTF-8 encoding, so if you encode your file in UTF-8, you don't need to worry about character codes.

### Files whose name end in `.yaml`

See [the official YAML file specification documentation](https://yaml.org/spec/1.2/spec.html) for detailed information on how to format your files.

The game adds an additional constraint on `yaml` files so that they must start with a single line containing only three dashes (`---`) and no additional white space.

Each file contains highly specific structured information which depends upon what the data represents.

Files are read with UTF-8 encoding.

### Image Files

Different image formats are supported: `.svg` and `.png`

### Movie Files

Currently, no movie files are supported.

### Sound Files

Different sound file formats are supported: `.ogg`, `.m4a`, and `.mp3`.

### Translation Files

In order to support multiple languages, `.po` files are used.  See
[the gettext documentation](https://www.gnu.org/software/gettext/manual/gettext.html) for in-depth discussions on the file format.


## Very Specific Files

Files that must have a specific name in order for their functionality to be used.


### `manifest.list`

The manifest list is a required file for all modules.  It MUST:

* be in the root of the module folder.
* be named `manifest.list`
* be in the [`.list` format](#files-whose-name-ends-in-list)

This file contains all the meta-data information that the module adds to the system.  This tells the system what files to inspect that aren't directly referenced through the `module.yaml` file.

This file is located outside the `module.yaml` file so that it can be easily created by tools.  If you'd rather load the files through the module file you can, but that seems like a lot of extra effort.

Each line in the file denotes the relative path to a `yaml` file to load into the context tree.  The files must all end with the `.yaml` extension.  This must not include the `module.yaml` file.


### `module.yaml`

The `module.yaml` is the entry point into the module.  It defines basic
information about the module, and how it connects to the high level events of the engine.

The file must contain only one element - the "module" definition:

```yaml
---
module:
  id: my-module
  name: My Special Module
  description: The Super Special Module
  version: 1.9.22
  authors:
    - Myself
    - Someone Else
  license:
    - Commercial
  source:
    - http://my-special-module.website/
  requirements:
    - core 0
    - kota 1
  hooks:
    install: install.yaml
```

Module supports the following attributes:

* **id**: The unique identifier for the module.
* **name**: Human readable name.
* **description**: A detailed description about what the module does, and why someone might want to install it.
* **version**: A chain of numbers separated by a period ('.') to create a Dewey Decimal version number.  Used primarily to detect if newer versions are available, and whether a required module is at a sufficient version (see "requirements" attribute below).
* **authors**: List of authors of the module.
* **license**: One or more licenses dictating how the module can be used.
* **source**: Where the module comes from.  Usually a URL.
* **requirements**: List of dependent modules and their version number that must be installed in order for this module to be able to be installed.
* **hooks**: a dictionary of module "lifecycle" hooks, and the module file where that hook is located.


## Context Tree Files

For every file in the `manifest.list` file, it is loaded into the game's context under `/modules(module Unique ID)/(relative file directory)/(file contents)`.

Note that the file name is *not* part of the context path, but the directory name is.  However, files named `_.yaml` will be loaded as part of the parent directory's context.  This is to allow for more natural parent/child descriptions.

Files in the `overrides` directory will be mapped to the root of the context.  This is particularly handy for creating new translations as add-on modules, or providing a high-def graphics pack.
