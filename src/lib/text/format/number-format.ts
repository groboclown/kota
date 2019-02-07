
import * as loc from '../localization'
import { HasErrorValue, coreError } from '../../error'
import { LocalizedText, FormatVariable } from './format'
import { getNumberFlags } from './template-flags'
import * as registry from './registry'
import { Context, VALUE_NUMBER } from '../../context'
import { CURRENT_FUNCTION_ARGUMENT_0_PATH } from '../../core-paths'

export const NUMBER_FORMAT = 'c'

const FORMAT_DEFAULTS: { [key: string]: number } = {
  r: 10,
  R: 0,
  '0': 0,
  '+': 0,
  'b': 0,
  '-': 0,
  '(': 0,
  ',': 0,
}

/**
 * "Standard" integer formatting options.
 *
 * The format text is a bit like the Java String.format.
 *
 * "0:number; - pad the number with 0s to make it at least number length.
 * ",;" - requires grouping separator.
 * "+;" - force the + to show up if the number is positive.
 * "-;" - if the number is positive, leave a space at the start of the string
 #      to account for justifying with negative values.
 * "b:number;" - pad the number with a space "blank" character to make it at
 *      least number length.
 * "(;" - if the value is negative, wrap the number in '(' and ')'
 * "r:number;" - use "number" radix, with lower-case letters.
 * "R:number;" - use "number" radix, with upper-case letters.
 */
export class FormatNumber implements FormatVariable {
  readonly formatName = NUMBER_FORMAT

  format(args: Context, template: string, l10n: loc.Localization): LocalizedText | HasErrorValue {
    const flags = getNumberFlags(template, FORMAT_DEFAULTS)
    var reversed = []

    const countArg = args.get(CURRENT_FUNCTION_ARGUMENT_0_PATH, VALUE_NUMBER);
    if (typeof countArg !== 'number') {
      return { error: coreError('no argument for template', { name: NUMBER_FORMAT }) }
    }
    // We only deal with integers.
    let count = countArg | 0

    // Because we're inserting in reverse order, add the trailing ')' if that's
    // our negative expression.
    const isNeg = count < 0
    if (isNeg) {
      count = -count
      if (flags['('] > 0) {
        reversed.push(')')
        // This will throw off the zero padding.
        flags['0'] += 1
      }
    }
    const radixChars = flags.R > 0 ? l10n.number.digitsUpper : l10n.number.digitsLower
    const radix = flags.R > 0 ? flags.R : flags.r
    if (radix < 2 || radix > radixChars.length) {
      return { error: coreError('invalid radix', { radix: radix }) }
    }

    // Grouping: if grouping is requested, then we look into the grouping-count
    // list to see after which next digit number to insert the grouping character.
    // If grouping is not requested, then we set the position to -1 so that
    // it isn't ever inserted.
    const grouping = l10n.number.grouping
    var groupPos = 0
    var nextGroupIndex = flags[','] > 0 ? l10n.number['grouping-count'][0] : -1
    var numberIndex = 0
    while (count >= 1) {
      const digit = count % radix
      count = (count / radix) | 0
      // console.log(`Digit ${numberIndex}=${digit} => ${radixChars[digit]}`)
      reversed.push(radixChars[digit])
      numberIndex++
      if (numberIndex === nextGroupIndex) {
        reversed.push(grouping)
        groupPos++
        if (groupPos >= l10n.number['grouping-count'].length) {
          groupPos = l10n.number['grouping-count'].length - 1
        }
        nextGroupIndex += l10n.number['grouping-count'][groupPos]
      }
    }

    // Add in leading zeros before the sign.
    while (reversed.length < flags['0']) {
      reversed.push(radixChars[0])
    }

    // Add the negative / positive value.
    if (isNeg) {
      if (flags['('] > 0) {
        reversed.push('(')
      } else {
        reversed.push(l10n.number.negative)
      }
    } else if (flags['-']) {
      reversed.push(' ')
    } else if (flags['+']) {
      reversed.push(l10n.number.positive)
    }

    // Add in the leading blanks.
    while (reversed.length < flags.b) {
      reversed.push(' ')
    }

    // Reverse and join the string together.
    var val = ''
    for (var i = reversed.length; --i >= 0;) {
      val += reversed[i]
    }

    return { text: val }
  }
}

registry.registerDataFormat(new FormatNumber())

// Declared as a common export, just so that it's something that can mark that the registry was loaded.
export const NUMBER_FORMAT_LOADED = true
