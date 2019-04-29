# About

Every formula used in a role needs a reverse operation.  The general logic goes:

* Story declares that it needs an object that fulfills 1 or more roles.
* It also puts constraints on the role, which are either numeric ranges
  (age > 30) or keywords (age is older) which have implicit ranges.
  These can also have "priority" (a value of 0-100, where 100 means it must
  be satisfied).
* That defines the set of values that need to be matched (for existing objects)
  or set (for created objects).
  * For matching, this can be straight-forward.
  * For creating, the computations must now be run backwards.
    * For single value operations with constants, this is really simple.
    * For multi-value operations (a + b), this becomes complicated.
      We need to put restrictions on this so the possibilities don't explode.
      * For Fuzz numbers, multiplication is fine because of principles of
        multiplying values between 0 and 1.  Lower bound means all values must
        be >= lower bound, and higher bound means at least one is <= higher`
        bound.
      * For bound numbers, addition should be the limit (+ constant operations),
        so that some form of linear programming can be used.
