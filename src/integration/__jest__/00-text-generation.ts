
import * as cx from '../../lib/context'
import * as itn from '../../model/intern'
import * as loc from '../../lib/text/localization'
import * as cp from '../../lib/core-paths'

describe('text generation integration', () => {
  // Try out different text generation messages.
  // This requires translations, localizations, and a context tree.

  // TODO look into how to put the translations and locale into the
  // context tree for correct extraction of that information.
  const TRANSLATIONS: { [domain: string]: loc.SimpleTranslation } = {
    '/module/test/text': {

    }
  }
  class SimpleLoc implements loc.Localization {
    getText(domain: string, msgid: string, count?: number, grammar?: string): string | null {
      const lated = TRANSLATIONS[domain]
      return lated ? loc.simpleTranslationLookup(msgid, count, grammar, lated) : null
    }
    getMediaResourcePath(basePath: string): string {
      return basePath
    }
    number: loc.LocalizationNumberType = {
      // en_US
      decimal: '.',
      grouping: ',',
      'grouping-count': [3],
      negative: '-',
      positive: '+',
      digitsUpper: '0123456789ABCDEF',
      digitsLower: '0123456789abcdef',
    }
    dateMarkers: loc.LocalizationDateMarkerType[] = []
  }
  const LOCALE = new SimpleLoc()

  // Setup the context tree to be similar to the real one.
  const CONTEXT = new cx.BaseContext(
    new itn.PointerContext(
      new itn.SplitContext({
        [cp.APPLICATION_STATE_PATH]: new itn.StorageContext({}),
        [cp.MODULE_PATH]: new itn.SplitContext({
          '/0000-core': new itn.StorageContext({

          }),
          '/0001-addon': new itn.StorageContext({

          })
        }),
        [cp.WORLD_STATE_PATH]: new itn.StorageContext({
          // Rather than define the generation, this is only concerned with the rendering of
          // text.

          // FIXME this indicates that we need a path to the name in the translation,
          // a domain and message ID.  It also means that translation text needs to support
          // name lists, which MUST be additive.

          // Maybe name lists are a union of several properties?  If someone lives in
          // Argentina with Iraqi parents, the range of possibilities for names is even
          // bigger.  Because the name list index is a number, it means the generated name
          // list MUST be determanistic.

          // Because of that, the game must be aware of the destructive nature of adding
          // modules to an existing game.  Doing so MUST create a copy of the existing
          // game UNLESS the user explicitly declares that they don't want to keep the original.
          // Even still, the modules will be added to a new save, and that explicit
          // declaration means that the new file will replace the old one, so that errors
          // don't destroy the file altogether.
          'player/name': new itn.NumberInternal(itn.VALUE_NAME_LIST_ITEM, 0),

        })
      })
    )
      // Example, not real...
      .addPointer(
        // From
        itn.joinPaths(cp.MODULE_PATH, '0000-core'),
        // To
        itn.joinPaths(cp.CURRENT_CONTEXT_PATH))
  )

})
