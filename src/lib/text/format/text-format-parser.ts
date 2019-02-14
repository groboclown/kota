
import { HasErrorValue, hasErrorValue, coreError } from '../../error'
import { ArgumentMapping, ArgumentReference } from './format'
import { ParseSrcKey } from 'model/module/parse-info';
import { string } from 'prop-types';

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

// This code is used constantly, so it must be highly performant.  However, we don't
// want to over optimize to make it difficult to update in case we want to enhance
// its functionality.  To that end, don't put any conditions inside the case statements
// other than error checking or current character checking.

/**
 * Parses out the text formatting instructions from a string.  Text formatting
 * is in the form `some text {code:value;template} more text`.  Esacpe a
 * `{` and `}` character with a backslash.  The template part can itself have embedded
 * parsing.
 */
export function parseTextFormat(format: string): TextFormat[] | HasErrorValue {
  // Stack of the
  let current: ParseState = mkParseState(null)
  current.state = CTX_TEMPLATE_START

  for (var i = 0; i < format.length; i++) {
    const c = format[i]
    switch (current.state) {
      case CTX_TEMPLATE_START:
        // Plain text at the very start of the template.
        // Write to the textBuff storage.
        if (c === '\\') {
          // Start an escape sequence.  Exiting this will put us into the template state.
          current.contents += c
          current.state = CTX_ESC_TEMPLATE
        } else if (c === '{') {
          // Start a child.
          // Keep the current (outside the parent) state the same; when it
          // is re-entered, the current state will be resumed.

          // No text at the start, so no need to add in to the parsed list.

          // The state creation puts the child in the right (marker) state.
          const child = mkParseState(current)
          current = child
          // Note that we don't add this character to the parent, but to the child.
          current.contents += c
        } else if (c === '}') {
          // This character is in the current, not parent, contents.
          current.contents += c
          if (current.parent === null) {
            // Special case: outer parse state.
            // It's a dangling '}'.
            return { error: coreError('template danging }', { format }) }
          }

          // Close out the current value, adding it to the parent.
          // Note that this cannot happen in the top-level, so that means we
          // are guaranteed to be in a context with a marker and values.
          // Additionally, because this is in the template part, we know the
          // variable declarations are parsed.

          const textFormat: TextFormatReplace = {
            formatTypeMarker: current.marker.markerTrimBuff,
            valueKeyNames: current.values,
            template: current.parsed
          }

          current = current.parent
          current.parsed.push(textFormat)
          // Parent should be in the right state.
        } else {
          // Normal template character, which can include leading whitespace.
          current.textBuff += c
          current.state = CTX_TEMPLATE
        }
        break
      case CTX_TEMPLATE:
        // Plain text
        // Write to the textBuff storage.
        if (c === '\\') {
          // Start an escape sequence
          current.contents += c
          current.state = CTX_ESC_TEMPLATE
        } else if (c === '{') {
          // Start a child.
          // Keep the current (outside the parent) state the same; when it
          // is re-entered, the current state will be resumed.

          // We know there is text in the buffer.  Add it to the parsed list
          // as plain text, and clear it out.
          current.parsed.push(<TextFormatPlain>{ text: current.textBuff })
          current.textBuff = ''

          // The state creation puts the child in the right (marker) state.
          const child = mkParseState(current)
          current = child
          // Note that we don't add this character to the parent, but to the child.
          current.contents += c
        } else if (c === '}') {
          // This character is in the current, not parent, contents.
          current.contents += c
          if (current.parent === null) {
            // Special case: outer parse state.
            // It's a dangling '}'.
            return { error: coreError('template danging }', { format }) }
          }

          // Close out the current value, adding it to the parent.
          // Note that this cannot happen in the top-level, so that means we
          // are guaranteed to be in a context with a marker and values.
          // Additionally, because this is in the template part, we know the
          // variable declarations are parsed.

          // We know that there's text in the text buffer because of the state.
          current.parsed.push(<TextFormatPlain>{ text: current.textBuff })

          const textFormat: TextFormatReplace = {
            formatTypeMarker: current.marker.markerTrimBuff,
            valueKeyNames: current.values,
            template: current.parsed
          }

          current = current.parent
          current.parsed.push(textFormat)
          // Parent should be in the right state.
        } else {
          // Normal template character
          current.textBuff += c
        }
        break
      case CTX_ESC_TEMPLATE:
        // Nothing fancy.  This is an escape character in the template part.
        // in the textBuff storage.
        current.contents += c
        if (c === 'r' || c === 'n') {
          current.textBuff += '\n'
        } else if (c === 't') {
          current.textBuff += '\t'
        } else {
          // Otherwise just inline the special character.
          current.textBuff += c
        }
        current.state = CTX_TEMPLATE
        break
      case CTX_MARKER_START:
        // Just saw a "{".  Scan for marker character.
        current.contents += c
        if (c === '}' || c === '{') {
          return { error: coreError('embedded format no value', { format }) }
        }
        if (c === ':') {
          return { error: coreError('bad format no format name', { format }) }
        }
        if (c !== ' ' && c !== '\t') {
          // Switch to the marker.  This is part of the marker buff.
          // Note that markers don't have escape handling, because it's not needed.
          current.marker.markerBuff = c
          current.marker.markerTrimBuff = c
          current.state = CTX_MARKER
        }
        // Else keep scanning for a starting character.
        // Note that we didn't add the space character to the markerBuff, becuse
        // that needs to be leading space trimmed, but not trailing spae trimmed.
        break
      case CTX_MARKER:
        // inside a format block, in the format marker text
        current.contents += c
        if (c === '}' || c === '{') {
          return { error: coreError('embedded format no value', { format }) }
        }
        if (c === ':') {
          // The trimmed marker text is now the real marker name, fully trimmed.
          current.state = CTX_FIRST_VALUE_START
        } else {
          // Add to the marker buffers, and keep in this state.
          // Note that if there are invalid characters (such as ; and \), they will be handled
          // when the marker name is matched against known markers.
          current.marker.markerBuff += c
          if (c !== ' ' && c !== '\t') {
            // Don't append the whitespace, because that would be a bug where
            // whitespace is ignored.
            current.marker.markerTrimBuff = current.marker.markerBuff
          }
        }
        break
      case CTX_FIRST_VALUE_START:
        // At the beginning of a new value.  This could be a named value or
        // pointer references to a value or just a value.  For now, we're checking
        // for a non-space character.
        current.contents += c
        if (c === '}' || c === ';' || c === '>' || c === ',' || c === '=' || c === '{') {
          // We're at the start, so that means there was a dangling ',' or no values
          // given.
          // The ">" and "," and "=" and '{' is a bit of a cop-out, to keep from writing
          // whole other error messages for those very specific conditions.
          if (current.value.index <= 0) {
            // no value
            return { error: coreError('embedded format no value', { format }) }
          } else {
            // danging ','
            return { error: coreError('dangling , in value list', { format }) }
          }
        }
        if (c === '\\') {
          // Easy escaping
          current.value.valueBuff = ''
          current.value.valueTrimmedBuff = ''
          current.state = CTX_ESC_FIRST_VALUE
        } else if (c !== ' ' && c !== '\t') {
          // Found the start of the variable text.
          current.value.valueBuff = c
          current.value.valueTrimmedBuff = c
          current.state = CTX_FIRST_VALUE
        }
        // Otherwise, keep searching for the variable name.
        // Note that valueBuff must be start-trimmed.
        break
      case CTX_FIRST_VALUE:
        // inside a format block, at the value with no name.
        // It could potentially be a pointer.
        // Write to current.value

        current.contents += c

        if (c === '{') {
          // No embedded context inside the value part.
          // TODO better error message.
          return { error: coreError('embedded format no value', { format }) }
        }
        if (c === '\\') {
          // Easy peasy handling.
          current.state = CTX_ESC_FIRST_VALUE
        } else if (c === '}') {
          // No template.  End the child context.  Note that we *must* have a parent
          // in the current at this point due to the state.
          if (current.parent === null) {
            throw new Error(`No parent inside CTX_VALUE; format "${format}"`)
          }
          // Variable has no name, and no more arguments, so set to default key "value"
          current.value.pointers.push(current.value.valueTrimmedBuff)
          current.values[String(current.value.index)] = current.value.pointers
          current.values.value = current.value.pointers

          const textFormat: TextFormatReplace = {
            formatTypeMarker: current.marker.markerTrimBuff,
            valueKeyNames: current.values,
            template: current.parsed
          }

          current = current.parent
          current.parsed.push(textFormat)
          // Parent should be in the right state.
        } else if (c === ';') {
          // End of the variables, start of the template.
          // Variable has no name, and no more arguments, so set to default key "value"
          current.value.pointers.push(current.value.valueTrimmedBuff)
          current.values[String(current.value.index)] = current.value.pointers
          current.values.value = current.value.pointers

          current.state = CTX_TEMPLATE_START
        } else if (c === '>') {
          // Variable has no name, but it is now a pointer reference.
          current.value.pointers.push(current.value.valueTrimmedBuff)
          // Reset the current search
          // Don't need to clear the value buffers, because they will be cleared
          // in the value start search.
          current.state = CTX_FIRST_VALUE_START
        } else if (c === ',') {
          // Variable has no name, but there will now be more arguments, so it doesn't use "value" default.
          current.value.pointers.push(current.value.valueTrimmedBuff)
          current.values[String(current.value.index)] = current.value.pointers
          current.value.index++
          // Don't need to clear the value buffers, because they will be cleared
          // in the start search.
          current.state = CTX_VALUE_OR_NAME_START
        } else if (c === '=') {
          // found the name for the value
          current.value.key = current.value.valueTrimmedBuff
          // Don't need to clear the value buffers, because they will be cleared
          // in the named value start search.
          current.state = CTX_NAMED_VALUE_START
        } else {
          current.value.valueBuff += c
          if (c !== ' ' && c !== '\t') {
            // See note above about marker buff and trimming.
            current.value.valueTrimmedBuff = current.value.valueBuff
          }
          // Stay in the same state.
        }
        break
      case CTX_ESC_FIRST_VALUE:
        // Just insert the character.  No special handling.
        current.contents += c
        current.value.valueBuff += c
        if (c !== ' ' && c !== '\t') {
          // See note above about marker buff and trimming.
          current.value.valueTrimmedBuff = current.value.valueBuff
        }
        current.state = CTX_FIRST_VALUE
        break
      case CTX_VALUE_OR_NAME_START:
        // At the beginning of a new value.  This could be a named value or
        // pointer references to a value or just a value.  For now, we're checking
        // for a non-space character.
        current.contents += c
        if (c === '}' || c === ';' || c === '>' || c === ',' || c === '=' || c === '{') {
          // We're at the start, so that means there was a dangling ',' or no values
          // given.
          // The ">" and "," and "=" and '{' is a bit of a cop-out, to keep from writing
          // whole other error messages for those very specific conditions.
          if (current.value.index <= 0) {
            // no value
            return { error: coreError('embedded format no value', { format }) }
          } else {
            // danging ','
            return { error: coreError('dangling , in value list', { format }) }
          }
        }
        if (c !== ' ' && c !== '\t') {
          // Found the start of the variable text.
          current.value.valueBuff = c
          current.value.valueTrimmedBuff = c
          current.state = CTX_VALUE_OR_NAME
        }
        // Otherwise, keep searching for the variable name.
        // Note that valueBuff must be start-trimmed.
        break
      case CTX_VALUE_OR_NAME:
        // inside a format block, at the value with no name.
        // It could potentially be a pointer.
        // Write to current.value

        current.contents += c

        if (c === '{') {
          // No embedded context inside the value part.
          // TODO better error message.
          return { error: coreError('embedded format no value', { format }) }
        }
        if (c === '\\') {
          // Easy peasy handling.
          current.state = CTX_ESC_VALUE_OR_NAME
        } else if (c === '}') {
          // No template.  End the child context.  Note that we *must* have a parent
          // in the current at this point due to the state.
          if (current.parent === null) {
            throw new Error(`No parent inside CTX_VALUE; format "${format}"`)
          }
          // Variable has no name and no pointer, so it will only be the index.
          current.values[String(current.value.index)] = [current.value.valueTrimmedBuff]

          const textFormat: TextFormatReplace = {
            formatTypeMarker: current.marker.markerTrimBuff,
            valueKeyNames: current.values,
            template: current.parsed
          }

          current = current.parent
          current.parsed.push(textFormat)
          // Parent should be in the right state.
        } else if (c === ';') {
          // End of the variables, start of the template.
          // Variable has no name and no pointers, so it will only be the index.
          current.values[String(current.value.index)] = [current.value.valueTrimmedBuff]
          current.state = CTX_TEMPLATE_START
        } else if (c === '>') {
          // Variable has no name, but it is now a pointer reference.
          current.value.pointers.push(current.value.valueTrimmedBuff)
          // Reset the current search
          // Don't need to clear the value buffers, because they will be cleared
          // in the value start search.
          current.state = CTX_ONLY_VALUE_START
        } else if (c === ',') {
          // no-named value with no pointer.
          current.values[String(current.value.index)] = [current.value.valueTrimmedBuff]
          current.value.index++
          // Don't need to clear the value buffers, because they will be cleared
          // in the start search.
          current.state = CTX_VALUE_OR_NAME_START
        } else if (c === '=') {
          // found the name for the value
          current.value.key = current.value.valueTrimmedBuff
          // Don't need to clear the value buffers, because they will be cleared
          // in the named value start search.
          current.state = CTX_NAMED_VALUE_START
        } else {
          current.value.valueBuff += c
          if (c !== ' ' && c !== '\t') {
            // See note above about marker buff and trimming.
            current.value.valueTrimmedBuff = current.value.valueBuff
          }
          // Stay in the same state.
        }
        break
      case CTX_ESC_VALUE_OR_NAME:
        // Just insert the character.  No special handling.
        current.contents += c
        current.value.valueBuff += c
        if (c !== ' ' && c !== '\t') {
          // See note above about marker buff and trimming.
          current.value.valueTrimmedBuff = current.value.valueBuff
        }
        current.state = CTX_VALUE_OR_NAME
        break
      case CTX_NAMED_VALUE_START:
        // We are in the value parsing, we have found a key name,
        // and have either just found a pointer ('>') or are starting
        // the value location.
        current.contents += c

        if (c === '}' || c === ';' || c === '>' || c === ',' || c === '=' || c === '{') {
          // The format requires some valid value here.
          return { error: coreError('embedded format no value', { format }) }
        }

        if (c !== ' ' && c !== '\t') {
          // start the new value.
          current.value.valueBuff = c
          current.value.valueTrimmedBuff = c
          current.state = CTX_NAMED_VALUE
        }
        // else we keep looking for that start.
        break
      case CTX_NAMED_VALUE:
        // We have a name for the value and some text in the value buffer.

        current.contents += c

        if (c === '=' || c === '{') {
          // Already found a name.
          // TODO return a better error message
          return { error: coreError('embedded format no value', { format }) }
        }
        if (c === '\\') {
          // easy peasy parsing.
          current.state = CTX_ESC_NAMED_VALUE
        } else if (c === '}') {
          // No template

          // End the child context.  Note that we *must* have a parent
          // in the current at this point due to the state.
          if (current.parent === null) {
            throw new Error(`No parent inside CTX_NAMED_VALUE; format "${format}"`)
          }
          if (!current.value.key) {
            throw new Error(`CTX_NAMED_VALUE has no key value: "${format}"`)
          }

          current.value.pointers.push(current.value.valueTrimmedBuff)
          // Both a named and numbered value
          current.values[String(current.value.index)] = current.value.pointers
          current.values[current.value.key] = current.value.pointers

          const textFormat: TextFormatReplace = {
            formatTypeMarker: current.marker.markerTrimBuff,
            valueKeyNames: current.values,
            template: current.parsed
          }

          current = current.parent
          current.parsed.push(textFormat)
          // Parent should be in the right state.
        } else if (c === '>') {
          // Start a pointer.
          current.value.pointers.push(current.value.valueTrimmedBuff)
          // No need to set the value buffers, because they will be reset
          current.state = CTX_NAMED_VALUE_START
        } else if (c === ',') {
          // Start a new value
          current.value.pointers.push(current.value.valueTrimmedBuff)
          // Both a named and numbered value
          current.values[String(current.value.index)] = current.value.pointers
          if (!current.value.key) {
            throw new Error(`CTX_NAMED_VALUE has no key value: "${format}"`)
          }
          current.values[current.value.key] = current.value.pointers

          // Reset all but the buffers.
          current.value.pointers = []
          current.value.index++
          current.state = CTX_VALUE_OR_NAME_START
        } else if (c === ';') {
          // Start the template
          current.value.pointers.push(current.value.valueTrimmedBuff)
          // Both a named and numbered value
          current.values[String(current.value.index)] = current.value.pointers
          if (!current.value.key) {
            throw new Error(`CTX_NAMED_VALUE has no key value: "${format}"`)
          }
          current.values[current.value.key] = current.value.pointers
          // No need to clear out the value data, because it won't be used again for
          // this current stack position.
          current.state = CTX_TEMPLATE_START
        } else {
          current.value.valueBuff += c
          if (c !== ' ' && c !== '\t') {
            // See the trim logic notes above.
            current.value.valueTrimmedBuff = current.value.valueBuff
          }
        }
        break
      case CTX_ESC_NAMED_VALUE:
        // No special character handling.  Just embed the next character.
        current.contents += c
        current.value.valueBuff += c
        if (c !== ' ' && c !== '\t') {
          // See the trim logic notes above.
          current.value.valueTrimmedBuff = current.value.valueBuff
        }
        current.state = CTX_NAMED_VALUE
        break
      case CTX_ONLY_VALUE_START:
        // Start of a only-value, no key.  We have a pointer already, and we just found a '>' character
        current.contents += c

        if (c === '}' || c === ';' || c === '>' || c === ',' || c === '=' || c === '{') {
          // The format requires some valid value here.
          return { error: coreError('embedded format no value', { format }) }
        }

        if (c !== ' ' && c !== '\t') {
          // start the new value.
          current.value.valueBuff = c
          current.value.valueTrimmedBuff = c
          current.state = CTX_ONLY_VALUE
        }
        // else we keep looking for that start.
        break
      case CTX_ONLY_VALUE:
        // Inside a only-value with some text, no key.  We have a pointer already.

        current.contents += c

        if (c === '=' || c === '{') {
          // Already found a name.
          // TODO return a better error message
          return { error: coreError('embedded format no value', { format }) }
        }
        if (c === '\\') {
          // easy peasy parsing.
          current.state = CTX_ESC_ONLY_VALUE
        } else if (c === '}') {
          // No template

          // End the child context.  Note that we *must* have a parent
          // in the current at this point due to the state.
          if (current.parent === null) {
            throw new Error(`No parent inside CTX_ESC_ONLY_VALUE; format "${format}"`)
          }

          current.value.pointers.push(current.value.valueTrimmedBuff)
          // Both only a numbered value
          current.values[String(current.value.index)] = current.value.pointers

          const textFormat: TextFormatReplace = {
            formatTypeMarker: current.marker.markerTrimBuff,
            valueKeyNames: current.values,
            template: current.parsed
          }

          current = current.parent
          current.parsed.push(textFormat)
          // Parent should be in the right state.
        } else if (c === '>') {
          // Start a pointer.
          current.value.pointers.push(current.value.valueTrimmedBuff)
          // No need to set the value buffers, because they will be reset
          current.state = CTX_ONLY_VALUE_START
        } else if (c === ',') {
          // Start a new value
          current.value.pointers.push(current.value.valueTrimmedBuff)
          // Only a numbered value
          current.values[String(current.value.index)] = current.value.pointers

          // Reset all but the buffers.
          current.value.pointers = []
          current.value.index++
          current.state = CTX_VALUE_OR_NAME_START
        } else if (c === ';') {
          // Start the template
          current.value.pointers.push(current.value.valueTrimmedBuff)
          // Only a numbered value
          current.values[String(current.value.index)] = current.value.pointers
          // No need to clear out the value data, because it won't be used again for
          // this current stack position.
          current.state = CTX_TEMPLATE_START
        } else {
          current.value.valueBuff += c
          if (c !== ' ' && c !== '\t') {
            // See the trim logic notes above.
            current.value.valueTrimmedBuff = current.value.valueBuff
          }
        }
        break
      case CTX_ESC_ONLY_VALUE:
        // No special character handling.  Just embed the next character.
        current.contents += c
        current.value.valueBuff += c
        if (c !== ' ' && c !== '\t') {
          // See the trim logic notes above.
          current.value.valueTrimmedBuff = current.value.valueBuff
        }
        current.state = CTX_ONLY_VALUE
        break
      default:
        throw new Error(`Illegal state ${current.state}, column ${i + 1} (character "${c}") in "${format}"`)
    }
  }

  if (current.parent) {
    return { error: coreError('bad format missing }', { format: format }) }
  }
  // The only valid states here, for not having a parent, is CTX_TEMPLATE and
  // CTX_TEMPLATE_START.  If we are in CTX_TEMPLATE, then we have a plain-text buffer
  // that needs to be added to our parse list.
  if (current.state === CTX_TEMPLATE) {
    current.parsed.push(<TextFormatPlain>{ text: current.textBuff })
  }

  return current.parsed
}


// There are two general states for the parser.  One is
// in a template, scanning for child text pieces (plain text
// or child variables).  The other is parsing the start of
// the variable.  At the start of the parser, it is in the
// template scan, even though it's not inside a variable
// template proper.

// The mode ALWAYS goes:
//   1. marker
//   2. values
//   3. template
// But it starts at stage 3.

const CTX_MARKER_START = 100
const CTX_MARKER = 101
const CTX_FIRST_VALUE_START = 230
const CTX_FIRST_VALUE = 231
const CTX_ESC_FIRST_VALUE = 232
const CTX_VALUE_OR_NAME_START = 200
const CTX_VALUE_OR_NAME = 201
const CTX_ESC_VALUE_OR_NAME = 202
const CTX_ONLY_VALUE_START = 210
const CTX_ONLY_VALUE = 211
const CTX_ESC_ONLY_VALUE = 212
const CTX_NAMED_VALUE_START = 220
const CTX_NAMED_VALUE = 221
const CTX_ESC_NAMED_VALUE = 222
const CTX_TEMPLATE_START = 300
const CTX_TEMPLATE = 301
const CTX_ESC_TEMPLATE = 302

// "Buff" indicates it's a running buffer.
interface ParserMarkerState {
  markerBuff: string
  markerTrimBuff: string
}

interface ParserVariableState {
  // The variable index position.
  index: number

  // For reading the current value; at this point,
  // it's indetermanite whether it's a key or a value.
  // The leading spaces are skipped.
  valueBuff: string

  // If a space is found, it is ommitted out of this
  // value.  If one is found later before a special
  // character, the valueBuff is copied over to this.
  valueTrimmedBuff: string

  // If a key is found, this is set.  It is never a buffer.
  key: string | null

  // If a pointer key is found, it is added into this
  // list.  This is the already parsed out pointers.
  pointers: ArgumentReference
}

interface ParseState {
  // All states
  state: number
  contents: string

  // Stage 1
  marker: ParserMarkerState

  // Stage 2
  value: ParserVariableState
  values: ArgumentMapping

  // Stage 3
  // Parsed template.  "Recursion" adds new values into this.
  // Note that this is spelled out here because of the
  // recursive structure.
  textBuff: string
  parent: ParseState | null
  parsed: TextFormat[]
}

function mkParseState(parent: ParseState | null): ParseState {
  return {
    // Default initial state of a parse state is marker start
    state: CTX_MARKER_START,
    contents: '',
    marker: {
      markerBuff: '',
      markerTrimBuff: ''
    },
    value: {
      index: 0,
      valueBuff: '',
      valueTrimmedBuff: '',
      key: null,
      pointers: []
    },
    values: {},
    textBuff: '',
    parent: parent,
    parsed: []
  }
}
