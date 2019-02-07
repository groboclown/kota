# About

The most basic module.  It defines all the low-level, most basic information
necessary to use the system.  So much of the internal engine is generic that
this kind of data is necessary to bootstrap what is used.

Some of the "shorthand" data structures supported in the yaml files rely upon
this module being loaded, because it hard-codes some of the values here.
