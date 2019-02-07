
import * as loc from '../../lib/text/localization'

describe('text generation integration', () => {
  // Try out different text generation messages.
  // This requires translations, localizations, and a context tree.

  class SimpleLoc implements loc.Localization {
    getText(domain: string, msgid: string, count?: number): string | null {
      const lated = this.tlate[`${domain}:${msgid}`]
      if (typeof lated === 'string') {
        // console.log(`tlated <<${domain}:${msgid}>> to <<${lated}>>`)
        return lated
      } else if (count !== undefined && lated !== undefined && lated[count]) {
        // console.log(`tlated <<${domain}:${msgid}:${count}>> to <<${lated[count]}>>`)
        return lated[count]
      } else {
        // console.log(`no tlate; returning raw ${domain} ${msgid} ${count}`)
        return `${domain}@${msgid}@${count}`
      }
    }
    getMediaResourcePath(basePath: string): string {
      return basePath + '.png'
    }
    number: loc.LocalizationNumberType = {
      decimal: '!',
      grouping: '?',
      'grouping-count': [4, 3, 2],
      negative: '@',
      positive: '^',
      digitsUpper: 'abcdefghijklmnopqrstuvwxyz',
      digitsLower: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    }
    tlate: { [key: string]: string | { [key: number]: string } } = {}

  }


})
