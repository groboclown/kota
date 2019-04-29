
import * as loc from '../localization'
import { HasErrorValue, hasErrorValue, coreError } from '../../error'
import {
  LocalizedText,
  FormatVariable,
  getContextValuesFor,
} from './format'
import { Context } from '../../context'
import * as tx from './text-format-parser'
import * as registry from './registry'
import { createLogger } from '../../log'

const LOG = createLogger('lib.text.format.context-format')

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
      LOG.trace('evaluating', values, 'using', formatList, 'size', formatList.length)
      var ret = ''
      for (let fmt of formatList) {
        LOG.debug('fmt', fmt)
        if (tx.isTextFormatPlain(fmt)) {
          // we walk the tree backwards, so the text is added backwards.
          LOG.trace('-- plain text')
          ret += fmt.text
        } else {
          LOG.trace('-- format type', fmt.formatTypeMarker)
          const formatter = registry.getDataFormatFor(fmt.formatTypeMarker)
          if (!formatter) {
            LOG.trace('-- unknown marker')
            return { error: coreError('unknown format marker', { marker: fmt.formatTypeMarker }) }
          }
          LOG.debug('-- formatter', formatter.formatName)
          var stackValues = getContextValuesFor(values, fmt.valueKeyNames)

          // NOTE: we're evaluating the template section relative to this
          // expression's values, not the parent.
          const template = evaluate(stackValues, fmt.template)
          LOG.debug('-- template => <<', template, '>>')
          if (hasErrorValue(template)) {
            LOG.debug('-- sub-evaluate failed')
            return template
          }
          LOG.debug('-- starting formatter')
          const ev = formatter.format(stackValues, template, l10n)
          if (hasErrorValue(ev)) {
            LOG.debug('-- format failed')
            return ev
          }
          LOG.debug('-- evaluated => <<${ev.text}>>')
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
