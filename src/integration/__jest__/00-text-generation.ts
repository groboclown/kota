
import * as cp from '../../lib/core-paths'
import * as loc from '../../lib/text/localization'
import * as fmt from '../../lib/text/format'
import * as itn from '../../model/intern'
import { HasErrorValue, hasErrorValue } from '../../lib/error'

/** Helper to create a GroupDefinition in-line */
class GroupDefBuilder {
  gd = new itn.GroupDefinitionInternal()
  addGroup(gv: itn.GroupValue): GroupDefBuilder {
    this.gd.values[gv.name] = gv
    return this
  }
  build(): itn.GroupDefinitionInternal {
    return this.gd
  }
}


describe('text generation integration', () => {
  // Try out different text generation messages.
  // This requires translations, localizations, and a context tree.

  // TODO look into how to put the translations and locale into the
  // context tree for correct extraction of that information.
  const TRANSLATIONS: { [domain: string]: loc.SimpleTranslation } = {
    '/core': {
      // Noun Grammar flags (well ordered)
      // 'S': start of a sentance
      // 'n': subject (default)
      // 'o': object
      // 'g': possessive
      'pronoun:S': { 0: 'He', 1: 'She', 2: 'They', 3: 'We' },
      'pronoun': { 0: 'he', 1: 'she', 2: 'they', 3: 'we' },
      'pronoun:So': { 0: 'Him', 1: 'Her', 2: 'Them', 3: 'Us' },
      'pronoun:o': { 0: 'him', 1: 'her', 2: 'them', 3: 'us' },
      'pronoun:Sg': { 0: 'His', 1: 'Her', 2: 'Their', 3: 'Our' },
      'pronoun:g': { 0: 'his', 1: 'her', 2: 'their', 3: 'our' },
    },
    '/module/0000-core/text': {
      // Verb grammar flags:
      // 'S': start of a sentance
      // 'p': past (default)
      // 'r': present
      // 'f': future
      'transportation/foot/v-travel:S': 'Walked',
      'transportation/foot/v-travel': 'walked',
      'transportation/foot/v-travel:r': { 1: 'walks', plural: 'walk' },
    },
    '/module/0001-addon/text': {
      'player-name-list': [
        // Androgenous names
        'Chris',
        'Sam',
        'Alex',
        'Ashley',
        'Tay',
      ]
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
  const CONTEXT =
    new itn.PointerContext(
      new itn.SplitContext({
        [cp.APPLICATION_STATE_PATH]: new itn.StorageContext({}),
        [cp.MODULE_PATH]: new itn.SplitContext({
          '/0000-core': new itn.StorageContext({
            'noun/count': new itn.NumberAttribute(1, 100000),

            // TODO gender should instead be a group.
            'person/gender': new itn.FuzzAttribute(),
            'person/gender/pronoun': new itn.NameListAttribute('/core', 'pronoun'),
            'person/possessions/transportation': new itn.GroupSetAttribute(
              itn.joinPaths(cp.MODULE_PATH, '0000-core', 'transportation')
            ),
            'transportation': new GroupDefBuilder()
              .addGroup({
                name: 'foot',
                matches: {},
                referencePath: itn.joinPaths(cp.MODULE_PATH, '0000-core', 'transportation', 'foot')
              })
              .build(),

            'transportation/foot/v-travel': new itn.NameListAttribute('/module/0000-core/text', 'transportation/foot/v-travel')
          }),
          '/0001-addon': new itn.StorageContext({
            'player-name-list': new itn.NameListAttribute('/module/0001-addon/text', 'player-name-list')
          }),
        }),
        [cp.WORLD_STATE_PATH]: new itn.StorageContext({
          // Rather than define the generation, this is only concerned with the rendering of
          // text.  It is assumed that the values here were generated from other patterns.
          '+player/count': new itn.NumberInternal(
            itn.joinPaths(cp.MODULE_PATH, '0000-core', 'noun/count'), 1),
          '+player/@name': new itn.NameListInternal(
            itn.joinPaths(cp.MODULE_PATH, '0001-addon', 'player-name-list'), 0),
          '+player/@gender': new itn.FuzzInternal(
            itn.joinPaths(cp.MODULE_PATH, '0000-core', 'person/gender'), 0.0),
          '+player/gender/@pronoun': new itn.NameListInternal(
            itn.joinPaths(cp.MODULE_PATH, '0000-core', 'person/pronoun'), 0),
          '+player/possessions/transportation': new itn.GroupSetInternal(
            itn.joinPaths(cp.MODULE_PATH, '0000-core', 'person//possessions/transportation'),
            ['foot']
          ),
        })
      })
    )
      // Example, not real...
      .addPointer(
        // From
        itn.joinPaths(cp.MODULE_PATH, '0000-core'),
        // To
        itn.joinPaths(cp.CURRENT_CONTEXT_PATH))

  it('basic sentance', () => {
    const formatter = fmt.getTextContextFormatter()
    // The group + count lookup needs to be SEVERELY re-examined.
    const res = formatter(CONTEXT, '{t:/world/+player/@name} {x:/world/+player/posessions/transportation;{t:/current/0/v-travel}} to the store.', LOCALE)
    console.log(res)
    if (hasErrorValue(res)) {
      throw new Error(`generated error ${JSON.stringify(res)}`)
    }
    expect(res.text).toBe('Chris walked to the store.')
  })
})
