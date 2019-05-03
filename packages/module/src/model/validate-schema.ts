
import {
  FileStructure,
  TreeItemEntry,
  FILESTRUCTURE_BASIC_VALIDATOR,

  MODULEHEADER_BASIC_VALIDATOR,

  LocalizedMessageCatalog,
  TextFragment,
  LOCALIZEDMESSAGECATALOG_BASIC_VALIDATOR,
} from './schema'
import {
  EnhancedVerifier,
  checkValidRange,
  isContextFormatMarker,
  isFlatFormatMarker,
} from './validator'
import {
  hasVariableTextData,
  hasContextVariableTextData,
} from './types-text'
import { ErrorValue, coreError } from '@kota/base-libs'

export const MODULEHEADER_VALIDATOR = MODULEHEADER_BASIC_VALIDATOR

// TODO This needs to be made public and splattered everywhere in the docs.
// That means this needs to be put in a much more prominent location.
export const MAXIMUM_CONTEXT_DEPTH = 20

export const FILESTRUCTURE_VALIDATOR = new EnhancedVerifier(FILESTRUCTURE_BASIC_VALIDATOR, [
  (fs: FileStructure) => {
    const ret: ErrorValue[] = []
    fs.overrideTree.forEach((item) => checkRangeError(item.path, item.entry, ret))
    fs.moduleTree.forEach((item) => checkRangeError(item.relpath, item.entry, ret))
    return ret
  },
])

export const LOCALIZEDTEXT_VALIDATOR = new EnhancedVerifier(LOCALIZEDMESSAGECATALOG_BASIC_VALIDATOR, [
  (lt: LocalizedMessageCatalog) => {
    const ret: ErrorValue[] = []
    Object.keys(lt.msgids).forEach((msgid) =>
      lt.msgids[msgid].forEach((block) =>
        block.text.forEach((text) =>
          checkTextDataMarker(text, ret))))
    return ret
  },
])


function checkRangeError(path: string, entry: TreeItemEntry, errors: ErrorValue[]): void {
  const range = getNumericRange(entry)
  if (range) {
    addIfError(errors, checkValidRange(path, range[0], range[1]))
  }
}


function getNumericRange(item: TreeItemEntry): [number, number] | null {
  const a: any = item
  if (a !== null && typeof a === 'object') {
    if (typeof a.min === 'number' && a.max === 'number') {
      return [a.min, a.max]
    }

    // special case for FunctionCalculatedNumberAttribute
    if (a.bound !== null && typeof a.bound === 'object' &&
      typeof a.bound.min === 'number' && typeof a.bound.max === 'number') {
      return [a.bound.min, a.bound.max]
    }
  }
  return null
}


function checkTextDataMarker(root: TextFragment, errors: ErrorValue[]): void {
  // Avoid stack overflow errors by not being directly recursive.
  const stack: TextFragment[] = [root]
  while (stack.length > 0) {
    const text = stack.pop()
    if (!text) {
      break
    }
    if (hasVariableTextData(text)) {
      if (!isFlatFormatMarker(text.formatMarker)) {
        errors.push(coreError('context format marker used with flat variable', { marker: text.formatMarker }))
      }
    } else if (hasContextVariableTextData(text)) {
      if (!isContextFormatMarker(text.formatMarker)) {
        errors.push(coreError('flat format marker used with context variable', { marker: text.formatMarker }))
      } else {
        // Format marker + data type line up.
        if (stack.length + text.template.length > MAXIMUM_CONTEXT_DEPTH) {
          errors.push(coreError('context format depth', { text: JSON.stringify(text) }))
        } else {
          text.template.forEach((t) => stack.push(t))
        }
      }
    }
  }
}


function addIfError(errors: ErrorValue[], error: ErrorValue | null): void {
  if (error) {
    errors.push(error)
  }
}
