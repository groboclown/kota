
import { coreError, HasErrorValue } from '../error'


const ESCAPE_SEQUENCES: { [key: string]: string } = {
  '\\': '\\',
  'r': '\r',
  't': '\t',
  'n': '\n',
}
const HEX_NUMBER: { [key: string]: number } = {
  0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8, 9: 9,
  a: 10, A: 10, b: 11, B: 11, c: 12, C: 12, d: 13, D: 13,
  e: 14, E: 14, f: 15, F: 15,
}

export interface ListFileData {
  data: string[]
}

export function isListFileData(v: ListFileData | HasErrorValue): v is ListFileData {
  const w: any = v
  if (!(w.data instanceof Array)) {
    return false
  }
  // Because of the early exit, we'll use a straight up for loop rather than a reduce.
  for (const x of w.data) {
    if (typeof x !== 'string') {
      return false
    }
  }
  return true
}

/**
 * Load a "list" module file.  Should be read in UTF-8 format.
 */
export function parseListFile(data: string, strict: boolean): ListFileData | HasErrorValue {
  let buff = ''
  let esc = 0
  let escStr = ''
  const ret: string[] = []
  let state = 0
  let lastNonWhitespace = 0
  for (const c of data) {
    switch (state) {
      case 0:
        // start of Line
        if (c === ' ' || c === '\t' || c === '\n' || c === '\r') {
          // ignore the character and continue in the current state.
          break
        }
        if (c === '#') {
          state = 1
          break
        }
        if (c === '\\') {
          state = 11
          break
        }
        buff += c
        lastNonWhitespace = buff.length
        state = 10
        break
      case 1:
        // in a line comment
        if (c === '\n' || c === '\r') {
          state = 0
        }
        break
      case 10:
        // inside a line
        if (c === '\n' || c === '\r') {
          ret.push(buff.substring(0, lastNonWhitespace))
          buff = ''
          state = 0
          break
        }
        if (c === '\\') {
          state = 11
          break
        }
        buff += c
        if (c !== ' ' && c !== '\t') {
          lastNonWhitespace = buff.length
        }
        break
      case 11:
        // start of escape sequence
        if (c === 'u' || c === 'U') {
          // unicode sequence
          esc = 0
          escStr = c
          state = 12
          break
        }
        if (c !== '\n' && c !== '\r') {
          if (ESCAPE_SEQUENCES[c] !== undefined) {
            buff += ESCAPE_SEQUENCES[c]
          } else {
            buff += c
          }
          lastNonWhitespace = buff.length
        } // else line continuation.  Ignore the 'c' and last non-whitepsace
        // is not advanced
        state = 10
        break
      case 12:
        if (c === '+') {
          state = 13
          escStr += c
        } else {
          state = 10
          buff += escStr
          lastNonWhitespace = buff.length
        }
        break
      case 13:
        // 4 character hex code.
        if (HEX_NUMBER[c] === undefined) {
          if (strict) {
            return { error: coreError('list file hex code', { value: escStr }) }
          }
          buff += escStr + c
          lastNonWhitespace = buff.length
          state = 10
          break
        }
        esc = (esc * 16) + HEX_NUMBER[c]
        escStr += c
        if (escStr.length >= 6) {
          buff += String.fromCharCode(esc)
          lastNonWhitespace = buff.length
          state = 10
        }
        break
      // These next two lines should never happen; they indicate a bug in the system.
      /* istanbul ignore next */
      default:
        /* istanbul ignore next */
        throw new Error(`internal error: ${state}`)
    }
  }
  if (state === 13) {
    buff += String.fromCharCode(esc)
    lastNonWhitespace = buff.length
  }
  if (state === 12) {
    buff += escStr
    lastNonWhitespace = buff.length
  }
  // State == 11: ignore escape.
  if (state >= 10) {
    ret.push(buff.substring(0, lastNonWhitespace))
  }
  return { data: ret }
}
