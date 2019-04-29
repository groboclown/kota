
import * as yaml from 'js-yaml'
import { coreError, HasErrorValue } from '../error'

export interface LoadedStructure {
  data: any[]
}

export function isLoadedStructure(v: LoadedStructure | HasErrorValue): v is LoadedStructure {
  return ((<any>v).data) instanceof Array
}

/**
 * Load a structured (yaml) module file.  Should be read in UTF-8 format.
 */
export function loadStructuredFileContents(filename: string, data: string): LoadedStructure | HasErrorValue {
  // Required format check.
  if (!data.startsWith('---\n') && !data.startsWith('---\r')) {
    return { error: coreError('bad yaml format first line', { path: filename }) }
  }
  try {
    const raw: any[] = yaml.safeLoadAll(data)
    return { data: raw }
  } catch (e) {
    return { error: coreError('bad yaml format', { msg: e.toString(), path: filename }) }
  }
}

const ESCAPE_SEQUENCES: { [key: string]: string } = {
  '\\': '\\',
  'r': '\r',
  't': '\t',
  'n': '\n',
}
const HEX_NUMBER: { [key: string]: number } = {
  '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  'a': 10, 'A': 10, 'b': 11, 'B': 11, 'c': 12, 'C': 12, 'd': 13, 'D': 13,
  'e': 14, 'E': 14, 'f': 15, 'F': 15
}

export interface LoadedList {
  data: string[]
}

export function isLoadedList(v: LoadedList | HasErrorValue): v is LoadedList {
  return (<any>v).data instanceof Array
}

/**
 * Load a "list" module file.  Should be read in UTF-8 format.
 */
export function loadListFile(data: string, strict: boolean): LoadedList | HasErrorValue {
  var buff = ''
  var esc = 0
  var escStr = ''
  var ret: string[] = []
  var state = 0
  var lastNonWhitespace = 0
  for (var i = 0; i < data.length; i++) {
    const c = data[i]
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
          // console.log(`Converting [\\${escStr}] as ${esc} to [${String.fromCharCode(esc)}]`)
          buff += String.fromCharCode(esc)
          lastNonWhitespace = buff.length
          state = 10
        }
        break
      default:
        throw new Error(`internal error: ${state}`)
    }
  }
  if (state === 13) {
    buff += String.fromCharCode(esc)
  }
  if (state === 12) {
    buff += escStr
  }
  // State == 11: ignore escape.
  if (state >= 10) {
    ret.push(buff.substring(0, lastNonWhitespace))
  }
  return { data: ret }
}
