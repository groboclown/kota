# About

General text formatting functions.

The software must support localizations, including translations, number, and date specific formatting.
Additionally, the text must allow for display specifications.

## How To Format Data

One of the big things the program must accomplish is embedding dynamic information inside static
text.  This is done through the [context format](context-format.ts).  Embed text inside `{}` marks
using the given format:

```
There are {p:coin_count;{z:/modules/kota//}} in {z:/current/actor/@sex} bag.
```

