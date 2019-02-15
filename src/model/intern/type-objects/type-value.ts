
import {
  Internal, Context
} from '../base'
import * as tn from '../type-names'
import * as ta from './type-attribute'
import { GroupValue, isGroupDefinitionInternal, GroupDefinitionInternal } from './type-group'
import { HasErrorValue, coreError } from '../../../lib/error';

// -------------------------------------------------------------------------
// All non-static values must be a Calculated type, so that the values can
// be correctly memoized.  On update, the `lastCalculatedTick` must be updated too.

/**
 * "V" is the internal data type that the calculated expressess itself as.
 */
export class CalculatedInternal<V> implements Internal {

  /** indicates that this is a calculated value */
  readonly calculated: boolean = true


  /** the last internal "tick" when the calculated value was updated. */
  lastCalculatedTick: number = -1

  constructor(
    /** data type of the value */
    public readonly type: tn.DATA_TYPE,

    /**
     * Context path to the defining attribute.  This is so restrictions on the value,
     * or other references, can be applied on top of changes.
     */
    public readonly source: string
  ) { }
}


export function isCalculatedInternal(v: any): v is CalculatedInternal<any> {
  return v.calculated
}

export type getCalculatedInternal<T extends CalculatedInternal<V>, V> = (t: T, ctx: Context) => V | HasErrorValue
export type setCalculatedInternal<T extends CalculatedInternal<V>, V> = (
  v: T, value: V, ctx: Context, tick: number
) => undefined | HasErrorValue


// -------------------------------------------------------------------------
// Date internal, to be serializable, stores the explicit month, day, year.
// However, the getter and setter reference a Date object.

// Huuuuuge note:
//  JavaScript months and day-of-week are 0 indexed, so January is month 0.
//  However, for DateInternal, month is 1 indexed

export class DateInternal extends CalculatedInternal<Date> {
  day: number
  month: number
  year: number

  constructor(attributePath: string, date: Date)
  constructor(attributePath: string, day: number, month: number, year: number)
  constructor(attributePath: string, day: number | Date, month?: number, year?: number) {
    super(tn.VALUE_DATE, attributePath)
    if (typeof day === 'number') {
      this.day = day
      this.month = month || 0
      this.year = year || 0
    } else {
      // Note: "date" is day of the month, "day" is day of the week.
      this.day = day.getDate()
      this.month = day.getMonth() + 1
      this.year = day.getUTCFullYear()
    }
  }
}

export function isDateInternal(v: Internal): v is DateInternal {
  return v.type === tn.VALUE_DATE
}

export function getDateValue(v: DateInternal): Date {
  return new Date(v.year, v.month - 1, v.day)
}

export function setDateValue(intern: DateInternal, v: Date, tick: number): void {
  intern.lastCalculatedTick = tick
  intern.month = v.getMonth() + 1
  intern.day = v.getDay()
  intern.year = v.getUTCFullYear()
}

export const GetDateValueFunc: getCalculatedInternal<DateInternal, Date>
  = (v: DateInternal, ctx: Context): Date => getDateValue(v)

export const SetDateValueFunc: setCalculatedInternal<DateInternal, Date>
  = (v: DateInternal, value: Date, ctx: Context, tick: number): undefined | HasErrorValue => {
    setDateValue(v, value, tick); return undefined
  }


// ----------------------------------------------------------------------------
// All numbers are generally handled the same in terms of internal storage.
// Numbers, though, are bound by their owning attribute, so set functions are different.


abstract class AbstractNumberValueInternal extends CalculatedInternal<number> {
  constructor(
    type: tn.VALUE_FUZZ | tn.VALUE_DATE_DELTA | tn.VALUE_NUMBER | tn.VALUE_NAME_LIST_ITEM,
    attributePath: string,
    /** The numeric value of this attribute.  Note that it is NOT read only! */
    public value: number
  ) {
    super(type, attributePath)
  }
}


// ---------------

export class NumberInternal extends AbstractNumberValueInternal {
  constructor(
    attributePath: string,
    value: number
  ) {
    // Make sure numbers are only integers.
    super(tn.VALUE_NUMBER, attributePath, value | 0)
  }
}

export function isNumberInternal(v: Internal): v is NumberInternal {
  return v.type === tn.VALUE_NUMBER
}

export function getNumberValue(v: NumberInternal): number {
  return v.value
}

export function setNumberValue(v: NumberInternal, value: number, ctx: Context, tick: number): undefined | HasErrorValue {
  // Make sure numbers are only integers.
  var av = value | 0
  const src = ctx.getInternal(v.source)
  if (!src) {
    return { error: coreError('undefined attribute definition for value', { valueType: v.type, path: v.source }) }
  }
  if (!ta.isNumberAttribute(src)) {
    return {
      error: coreError(
        'invalid attribute definition for value', { valueType: v.type, attributeType: src.type }
      )
    }
  }
  av = Math.min(src.max, Math.max(src.min, av))
  if (v.value !== av) {
    v.lastCalculatedTick = tick
    v.value = av
  }
}

export const GetNumberValueFunc: getCalculatedInternal<NumberInternal, number>
  = (v: NumberInternal, ctx: Context) => getNumberValue(v)

export const SetNumberValueFunc: setCalculatedInternal<NumberInternal, number>
  = (v: NumberInternal, value: number, ctx: Context, tick: number): undefined | HasErrorValue => setNumberValue(v, value, ctx, tick)


// ---------------

export class FuzzInternal extends AbstractNumberValueInternal {
  constructor(
    attributePath: string,
    value: number
  ) {
    super(tn.VALUE_FUZZ, attributePath, value)
  }
}

export function isFuzzInternal(v: Internal): v is FuzzInternal {
  return v.type === tn.VALUE_FUZZ
}

export function getFuzzValue(v: FuzzInternal): number {
  return v.value
}

export function setFuzzValue(v: FuzzInternal, value: number, tick: number): undefined | HasErrorValue {
  // Fuzz numbers must be between 0 and 1.  No need to search up the owning attribute for that.
  const av = Math.min(1.0, Math.max(0.0, value))
  if (v.value !== av) {
    v.lastCalculatedTick = tick
    v.value = av
  }
  return undefined
}

export const GetFuzzValueFunc: getCalculatedInternal<FuzzInternal, number>
  = (v: FuzzInternal, ctx: Context) => getFuzzValue(v)

export const SetFuzzValueFunc: setCalculatedInternal<FuzzInternal, number>
  = (v: FuzzInternal, value: number, ctx: Context, tick: number): undefined | HasErrorValue => setFuzzValue(v, value, tick)


// ---------------

/** Number of days after the epoch (negative means before) */
export class DateDeltaInternal extends AbstractNumberValueInternal {
  constructor(
    attributePath: string,
    value: number
  ) {
    super(tn.VALUE_DATE_DELTA, attributePath, value)
  }
}

export function isDateDeltaInternal(v: Internal): v is DateDeltaInternal {
  return v.type === tn.VALUE_DATE_DELTA
}

export function getDateDeltaValue(v: DateDeltaInternal): number {
  return v.value
}

export function getDateFromEpoch(v: DateDeltaInternal, epoch: DateInternal): Date {
  // Should be able to avoid the duplicate date creation because it is already created
  // by calling getDateValue(), but this is to be absolutely sure that it's a different
  // value, and we aren't modifying the epoch.
  const date = new Date(getDateValue(epoch))
  date.setDate(date.getDate() + v.value)
  return date
}

export function setDateDeltaValue(v: DateDeltaInternal, value: number, tick: number): void {
  if (v.value !== value) {
    v.lastCalculatedTick = tick
    v.value = value
  }
}

export const GetDateDeltaValueFunc: getCalculatedInternal<DateDeltaInternal, number>
  = (v: DateDeltaInternal, ctx: Context) => getDateDeltaValue(v)

export const SetDateDeltaValueFunc: setCalculatedInternal<DateDeltaInternal, number>
  = (v: DateDeltaInternal, value: number, ctx: Context, tick: number): undefined | HasErrorValue => {
    setDateDeltaValue(v, value, tick)
    return undefined
  }


// ---------------

export interface NameListValue {
  readonly domain: string
  readonly msgid: string
  listIndex: number
}

export class NameListInternal extends CalculatedInternal<NameListValue> {
  constructor(
    attributePath: string,
    /** Index into the attribute's name list translation text. */
    public value: number
  ) {
    super(tn.VALUE_NAME_LIST_ITEM, attributePath)
  }
}

export function isNameListInternal(v: Internal): v is NameListInternal {
  return v.type === tn.VALUE_NAME_LIST_ITEM
}

export function getNameListValue(v: NameListInternal, ctx: Context): NameListValue | HasErrorValue {
  const src = ctx.getInternal(v.source)
  if (!src) {
    return { error: coreError('undefined attribute definition for value', { valueType: v.type, path: v.source }) }
  }
  if (!ta.isNameListAttribute(src)) {
    return {
      error: coreError(
        'invalid attribute definition for value', { valueType: v.type, attributeType: src.type }
      )
    }
  }
  return { listIndex: v.value, domain: src.domain, msgid: src.msgid }
}

export function setNameListValue(v: NameListInternal, value: NameListValue, tick: number): void {
  // Make sure numbers are only integers.
  var av = value.listIndex | 0
  if (v.value !== av) {
    v.lastCalculatedTick = tick
    v.value = av
  }
}

export const GetNameListValueFunc: getCalculatedInternal<NameListInternal, NameListValue>
  = (v: NameListInternal, ctx: Context): NameListValue | HasErrorValue => getNameListValue(v, ctx)

export const SetNameListValueFunc: setCalculatedInternal<NameListInternal, NameListValue>
  = (v: NameListInternal, value: NameListValue, ctx: Context, tick: number): undefined | HasErrorValue => {
    setNameListValue(v, value, tick)
    return undefined
  }


// ---------------

export interface GroupSetValue {
  values: GroupValue[]
  readonly definition: GroupDefinitionInternal
}

export class GroupSetInternal extends CalculatedInternal<GroupSetValue> {
  constructor(
    attributePath: string,
    /**
     * Mutable list of groups.  Note that the ordering here is important, and each internal
     * item must be distinct.
     */
    public groups: string[]
  ) {
    super(tn.VALUE_GROUP_SET_FOR, attributePath)
  }
}

export function isGroupSetInternal(v: Internal): v is GroupSetInternal {
  return v.type === tn.VALUE_GROUP_SET_FOR
}

export function getGroupSetValue(v: GroupSetInternal, ctx: Context): GroupSetValue | HasErrorValue {
  const attributeDef = ctx.getInternal(v.source)
  if (!attributeDef) {
    return { error: coreError('undefined attribute definition for value', { valueType: v.type, path: v.source }) }
  }
  if (!ta.isGroupSetAttribute(attributeDef)) {
    return {
      error: coreError(
        'invalid attribute definition for value', { valueType: v.type, attributeType: attributeDef.type }
      )
    }
  }
  const definition = ctx.getInternal(attributeDef.groupDefinitionPath)
  if (!definition) {
    return { error: coreError('undefined attribute definition for value', { valueType: v.type, path: attributeDef.groupDefinitionPath }) }
  }
  if (!isGroupDefinitionInternal(definition)) {
    return {
      error: coreError(
        'invalid attribute definition for value', { valueType: attributeDef.type, attributeType: definition.type }
      )
    }
  }
  const ret: GroupSetValue = { values: [], definition }
  for (let name of v.groups) {
    const val = definition.values[name]
    if (!val) {
      return { error: coreError('undefined group value', { value: name, group: v.source }) }
    }
    ret.values.push(val)
  }
  return ret
}

export function setGroupSetValue(v: GroupSetInternal, value: GroupSetValue, tick: number): undefined | HasErrorValue {
  const nameSet: { [name: string]: boolean } = {}
  for (let gv of value.values) {
    const n = gv.name
    if (!value.definition.values[n]) {
      return { error: coreError('undefined group value', { value: n, group: v.source }) }
    }
    nameSet[n] = true
  }
  const names: string[] = Object.keys(nameSet)
  names.sort()
  if (names !== v.groups) {
    v.lastCalculatedTick = tick
    v.groups = names
  }
  return
}
