
import * as loc from '../localization'
import { HasErrorValue, hasErrorValue, coreError } from '../../error'
import {
  LocalizedText,
  FormatVariable,
  getContextValuesFor,
  VALUE_DATA_CONTEXT_TYPE
} from './format'
import { Context } from '../../context'
import * as tx from './text-format-parser'
import * as registry from './registry'


// This is the default text parser, but it can be embedded inside itself.
export const CONTEXT_FORMAT = 'x'

/**
 * Generic text formatting for the standard pattern "blah {s:rel/context-path;format} blah".
 * If used outside standard template formatting, then pass the pattern in as the template.
 * The "object" is the current context.
 */
export class FormatContext implements FormatVariable {
  readonly formatName = CONTEXT_FORMAT

  format(context: Context, template: string, l10n: loc.Localization): LocalizedText | HasErrorValue {
    const format = tx.parseTextFormat(template)
    if (hasErrorValue(format)) {
      return format
    }

    // This could potentially blow up the stack.  Changing this
    // around means complex array structure that might be needed,
    // but is skipped for now for the sake of simplicity.
    function evaluate(values: Context, formatList: tx.TextFormat[]): string | HasErrorValue {
      // console.log(`DEBUG: evaluating <<${JSON.stringify(value)}>> using <<${JSON.stringify(formatList)}>> size ${formatList.length}`)
      var ret = ''
      for (let fmt of formatList) {
        // console.log(`DEBUG: -- fmt <<${JSON.stringify(fmt)}>>`)
        if (tx.isTextFormatPlain(fmt)) {
          // we walk the tree backwards, so the text is added backwards.
          // console.log(`DEBUG -- plain text`)
          ret += fmt.text
        } else {
          // console.log(`DEBUG: -- format type ${fmt.formatTypeMarker}`)
          const formatter = registry.getDataFormatFor(fmt.formatTypeMarker)
          if (!formatter) {
            // console.log(`DEBUG: -- unknown marker`)
            return { error: coreError('unknown format marker', { marker: fmt.formatTypeMarker }) }
          }
          console.log(`DEBUG: -- formatter ${formatter.formatName}`)
          var stackValues = getContextValuesFor(values, formatter, fmt.valueKeyNames)

          // NOTE: we're evaluating the template section relative to this
          // expression's values, not the parent.
          const template = evaluate(stackValues, fmt.template)
          console.log(`DEBUG: -- template => <<${template}>>`)
          if (hasErrorValue(template)) {
            return template
          }
          const ev = formatter.format(stackValues, template, l10n)
          if (hasErrorValue(ev)) {
            return ev
          }
          console.log(`DEBUG: -- evaluated => <<${ev.text}>>`)
          ret += ev.text
        }
      }
      return ret
    }

    const ret = evaluate(context, format)
    if (hasErrorValue(ret)) {
      return ret
    } else {
      return { text: ret }
    }
  }
}

registry.registerDataFormat(new FormatContext())

// Declared as a common export, just so that it's something that can mark that the registry was loaded.
export const CONTEXT_FORMAT_LOADED = true

function fmtValue(valueName: string, value: any): any {
  if (value === undefined) {
    return `??<${valueName}>??`
  } else {
    return value
  }
}
