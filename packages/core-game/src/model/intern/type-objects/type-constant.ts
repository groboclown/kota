
import {
  Internal
} from '../base'
import * as tn from '../type-names'

// Static values which are usually part of the module.  They are never generated.
// Other modules may override their value, though.

export class LocalizedMessageInternal implements Internal {
  readonly type = tn.CONSTANT_LOCALIZED

  constructor(
    public readonly domain: string,
    public readonly msgid: string
  ) { }
}

export function isLocalizedMessageInternal(v: Internal): v is LocalizedMessageInternal {
  return v.type === tn.CONSTANT_LOCALIZED
}


export class ConstantNumberInternal implements Internal {
  readonly type = tn.CONSTANT_NUMBER

  constructor(
    public readonly value: number
  ) { }
}

export function isConstantNumberInternal(v: Internal): v is ConstantNumberInternal {
  return v.type === tn.CONSTANT_NUMBER
}

