
import {
  Internal
} from '../base'
import * as tn from '../type-names'
import * as m from '../../module/attribute'

// -------------------------------------------------------------------------
// All attribute types describe the attribute, and do not store mutable information.
// Thus, they have no get/set value functions.

export abstract class AttributeInternal implements Internal {
  constructor(
    public readonly type: tn.ATTRIBUTE_DATA_TYPE
  ) { }
}

export function isAttributeInternal(v: Internal): v is AttributeInternal {
  return tn.ATTRIBUTE_DATA_TYPE_SET.indexOf(v.type) >= 0
}


// ---------------
export class NumberAttribute extends AttributeInternal {
  constructor(public readonly min: number, public readonly max: number) {
    super(m.ATTRIBUTE_NUMBER_TYPE)
  }
}

export function isNumberAttribute(v: Internal): v is NumberAttribute {
  return v.type === m.ATTRIBUTE_NUMBER_TYPE
}


// ---------------
export class FuzzAttribute extends AttributeInternal {
  public readonly min: number = 0
  public readonly max: number = 1
  constructor() {
    super(m.ATTRIBUTE_FUZZ_TYPE)
  }
}

export function isFuzzAttribute(v: Internal): v is FuzzAttribute {
  return v.type === m.ATTRIBUTE_FUZZ_TYPE
}


// ---------------
export class DateDeltaAttribute extends AttributeInternal {
  constructor() {
    super(m.ATTRIBUTE_DATE_DELTA_TYPE)
  }
}

export function isDateDeltaAttribute(v: Internal): v is DateDeltaAttribute {
  return v.type === m.ATTRIBUTE_DATE_DELTA_TYPE
}


// ---------------
export class NameListAttribute extends AttributeInternal {
  constructor(
    public readonly domain: string,
    public readonly msgid: string
  ) {
    super(m.ATTRIBUTE_NUMBER_TYPE)
  }
}

export function isNameListAttribute(v: Internal): v is NameListAttribute {
  return v.type === m.ATTRIBUTE_NAME_LIST_TYPE
}


// ---------------
export class DateAttribute extends AttributeInternal {
  constructor() {
    super(m.ATTRIBUTE_DATE_TYPE)
  }
}

export function isDateAttribute(v: Internal): v is DateAttribute {
  return v.type === m.ATTRIBUTE_DATE_TYPE
}


// ---------------

/**
 * A group set attribute is the definition of the group, as well as
 * the back-reference for defining what
 */
export class GroupSetAttribute extends AttributeInternal {
  constructor(
    public readonly groupDefinitionPath: string
  ) {
    super(m.ATTRIBUTE_GROUP_SET_TYPE)
  }
}

export function isGroupSetAttribute(v: Internal): v is DateAttribute {
  return v.type === m.ATTRIBUTE_GROUP_SET_TYPE
}
