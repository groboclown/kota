---
title: Design Principles
layout: default
---

The KotA engine is being built with these principles in mind.


### Generative Not Declarative

The game stories define the shape of what's necessary to fulfill the story, while the game world data defines acceptable parameters for creating different kinds of things.

This allows new elements, whatever they may be, to easily integrate into the generated stories.  The kinds of stories can grow, the landscapes can expand, and the worlds can be wealthier with unique objects.

This shows itself in the data by using the concept of "kind-of" - a story requires a *kind of* person, and a *kind of* item in a *kind of* location.  That "kind-of" idea can't be limited by things like strict tree structures.  Instead, it describes different desired traits, and the things define how much of a trait they have.


### Extensible

The system must allow for as much add-ons and changes to the story generation as possible without needing to get into the code.

In order to make older add-ons work with newer add-ons, we don't want hard-and-fast rules, like "only sailors can have this job," when the earlier add-ons had no concept of sailors.  Additionally, if an add-on requires a new concept to be integrated into the world, like finances, then the add-on needs to describe how that is brought into the world.

A non-goal is describing how to remove add-ons from existing worlds.


### Choice over Random

Choices are generally represented as a single value from a collection of values.  In many places, the player has no control over which value is chosen.  However, in order to maximize player choice, look where these are determined by the player, rather than by the roll of a die.  Dice rolls should be reserved for determination of *choice outcomes*.
