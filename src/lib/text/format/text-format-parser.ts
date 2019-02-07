
import { HasErrorValue, hasErrorValue, coreError } from '../../error'
import { ArgumentMapping } from './format'

export interface TextFormatPlain {
  text: string
}

export interface TextFormatReplace {
  formatTypeMarker: string
  // mapping between a key and the assigned value name.
  // all values are assigned position keys (0-9), and
  // if there is only one value name and it doesn't have a
  // key, it is assigned to the key "value".
  valueKeyNames: ArgumentMapping
  template: TextFormat[]
}

export type TextFormat = TextFormatPlain | TextFormatReplace

export function isTextFormatPlain(t: TextFormat): t is TextFormatPlain {
  return typeof (<any>t).text === 'string'
}

export function isTextFormatReplace(t: TextFormat): t is TextFormatReplace {
  return typeof (<any>t).formatTypeMarker === 'string'
}

/**
 * Parses out the text formatting instructions from a string.  Text formatting
 * is in the form `some text {code:value;template} more text`.  Esacpe a
 * `{` and `}` character with a backslash.  The template part can itself have embedded
 * parsing.
 */
export function parseTextFormat(format: string): TextFormat[] | HasErrorValue {
  const parseStack: ParseCtx[] = [{
    parsed: [], state: CTX_PLAIN, markerBuff: '', valueBuff: '', keyBuff: '',
    keyValues: []
  }]

  /** CLose off the state object based on its current state, and returned
   * the parsed value. */
  function closeState(st: ParseCtx): TextFormat[] | HasErrorValue {
    switch (st.state) {
      case CTX_PLAIN:
        if (st.markerBuff.length > 0) {
          st.parsed.push({ text: st.markerBuff })
        }
        break
      case CTX_ESC:
        // in the middle of an escape code.  Just embed the whole escape code.
        st.parsed.push({ text: st.markerBuff + st.valueBuff })
        break
      case CTX_MARKER:
      // at a format marker.  Report as an error.
      // fall through
      case CTX_VALUE:
        // at a value name.  Report this as an error.
        return { error: coreError('incomplete format string', { format: format }) }
      case CTX_TEMPLATE:
        // nothing more to do.
        break
      default:
        throw new Error(`Illegal state ${st.state}`)
    }
    return st.parsed
  }

  for (var i = 0; i < format.length; i++) {
    const c = format[i]
    const pstate = parseStack[parseStack.length - 1]
    switch (pstate.state) {
      case CTX_PLAIN:
        // plain text - markerBuff is the store
        if (c === '\\') {
          pstate.state = CTX_ESC
          pstate.valueBuff = c
        } else if (c === '{') {
          pstate.state = CTX_MARKER
          if (pstate.markerBuff.length > 0) {
            pstate.parsed.push({ text: pstate.markerBuff })
            pstate.markerBuff = ''
          }
        } else if (c === '}') {
          // Potentially completed the template part of the previous
          // item.
          if (parseStack.length > 1) {
            // This completes the parsing of the current frame.  The current
            // entry contains the stack values.
            parseStack.pop()
            const prev = parseStack[parseStack.length - 1]
            const prevTemplate = closeState(pstate)
            if (hasErrorValue(prevTemplate)) {
              return prevTemplate
            }
            prev.parsed.push({
              formatTypeMarker: prev.markerBuff.trim(),
              valueKeyNames: getValuesFor(prev),
              template: prevTemplate
            })
            // The previous state is now outside the template, so it's back to plain mode.
            prev.state = CTX_PLAIN
            prev.valueBuff = ''
            prev.markerBuff = ''
          } else {
            // Otherwise, it's a dangling '}'.
            return { error: coreError('template danging }', { format: format }) }
          }
        } else {
          pstate.markerBuff += c
        }
        break
      case CTX_ESC:
        // Nothing fancy.
        pstate.markerBuff += c
        pstate.state = CTX_PLAIN
        break
      case CTX_MARKER:
        // inside a format block, at the format marker
        if (c === '}') {
          return { error: coreError('embedded format no value', { format: format }) }
        } else if (c === ':') {
          pstate.state = CTX_VALUE
          pstate.valueBuff = ''
        } else {
          pstate.markerBuff += c
        }
        break
      case CTX_VALUE:
        // inside a format block, at the value
        if (c === '}') {
          // no template
          pstate.parsed.push({
            formatTypeMarker: pstate.markerBuff.trim(),
            valueKeyNames: getValuesFor(pstate),
            template: []
          })
          pstate.markerBuff = ''
          pstate.state = CTX_PLAIN
          // console.log(`DEBUG after parse template, new state = ${JSON.stringify(pstate)}`)
          break
        }
        if (c === ';') {
          // start of template
          // The final key/value, if present, will be finished off later.
          pstate.state = CTX_TEMPLATE
          const child: ParseCtx = {
            parsed: [], state: CTX_PLAIN, markerBuff: '',
            valueBuff: '', keyBuff: '', keyValues: []
          }
          parseStack.push(child)
          break
        }
        if (c === '=') {
          // the value is a value name.
          if (pstate.keyBuff.length > 0) {
            // double equal; not allowed
            return { error: coreError('two equals for key pair', { format: format }) }
          }
          pstate.keyBuff = pstate.valueBuff
          pstate.valueBuff = ''
          break
        }
        if (c === ',') {
          // completed the value
          pstate.keyValues.push([pstate.keyBuff, pstate.valueBuff])
          pstate.keyBuff = ''
          pstate.valueBuff = ''
          break
        }
        if (c === '{') {
          return { error: coreError('no embedded template in value', { format: format }) }
        }
        pstate.valueBuff += c
        break
      default:
        throw new Error(`Illegal state ${pstate.state} in stack ${JSON.stringify(parseStack)}, column ${i + 1} (character "${c}") in "${format}"`)
    }
  }

  if (parseStack.length !== 1) {
    return { error: coreError('bad format missing }', { format: format }) }
  }
  return closeState(parseStack[0])
}

const CTX_PLAIN = 0
const CTX_ESC = 1
const CTX_MARKER = 2
const CTX_VALUE = 3
const CTX_NAMED_VALUE = 4
const CTX_TEMPLATE = 5
type KeyValue = [string, string]
interface ParseCtx {
  parsed: TextFormat[]
  state: number
  markerBuff: string
  keyValues: KeyValue[]
  valueBuff: string
  keyBuff: string
}

function getValuesFor(ctx: ParseCtx): ArgumentMapping {
  const ret: ArgumentMapping = {}
  ctx.keyValues.forEach((kv, i) => {
    const key = kv[0].trim()
    const value = kv[1].trim()
    if (value.length > 0) {
      if (key.length > 0) {
        ret[key] = value
      }
      ret[String(i)] = value
    }
  })
  const k = ctx.keyBuff.trim()
  const n = ctx.valueBuff.trim()
  if (n.length > 0) {
    if (k.length > 0) {
      ret[k] = n
    } else if (ctx.keyValues.length <= 0) {
      ret['value'] = n
    }
    ret[String(ctx.keyValues.length)] = n

  }
  return ret
}
