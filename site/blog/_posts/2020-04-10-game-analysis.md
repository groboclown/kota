---
title: "Unrelated Game Analysis"
layout: post
excerpt_separator: <!--more-->
tags: [plans]
---

I've been analyzing some other games that are unrelated and even vastly different in scope than KotA to see if they can provide some insight or inspiration for KotA.

I put these games under the arbitrary category "system simulators", where the player makes choices that manipulate a system of values that affect the general outcome.  Two games in particular I've been looking at are *Princess Maker 2* and *Cultist Simulator*.

<!--more-->

## Princess Maker 2

Princess Maker 2 has the player choose among several somewhat static options each turn to affect characteristics of the main character, to explore different endgame outcomes.

Despite the very different genre of games, this style of game should be supported by the KotA engine.

The majority of the data interaction and RNG outcome is already directly supported by the engine (or is designed to be).  However, this showed some ideas for how to manage player options in the UI.

The concept of providing a "menu" with a list of player options, and the player option list can be changed out.  The player options themselves would have conditions that make them allowable to be chosen or displayed.  Menus would be related to story states.

The UI design also has a nice feature to have the most likely option to choose remain in the same UI area, so that the mouse doesn't need to move if the player wants to select it.


## Cultist Simulator

Cultist Simulator provides the player with a set of resources ("cards") and some basic rules around those cards, and actions ("verbs") which allow for exploring how those resources interact with each other by providing slots that can affect a card or have restrictions on the card type.  The player has a basic set of player-initiated actions, but as game play advances, some non-player initiated actions happen, which may or may not allow further interaction through resources.  All decisions are expressed through choosing resources.

The game introduces two ideas that could be used well in KotA.  The first is a "timer" data type.  For KotA, this could be a variable type that is always incremented or decremented, and has 1 or more triggers associated with it.

The second has much broader implications.  Cultist Simulator has a concept of a "deck", which starts out filled with cards.  Player actions can cause a card to be drawn from the deck.  When the deck is exhausted, the deck can automatically refill, or have a single "is empty" card drawn.

From the KotA perspective, this can replace the object generator and object concept.  Let's instead visualize a collection of "decks", which in this case means cards.  Each card has a generator that created it, and each deck has a generator (which uses card generators to create its contents).  Decks can have cards added or removed, and card properties can dictate stacking or uniqueness.  There can also be triggers on decks, for when cards are added or removed.

Decks would take the place of an "inventory" concept.
