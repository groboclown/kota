
import * as cp from '../../lib/core-paths'
import * as loc from '../../lib/text/localization'
import * as fmt from '../../lib/text/format'
import * as itn from '../../model/intern'
import { hasErrorValue } from '../../lib/error'

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
      // 'r': reflexive
      'pronoun-male:S': { 1: 'He', plural: 'They' },
      'pronoun-male': { 1: 'he', plural: 'they' },
      'pronoun-male:So': { 1: 'Him', plural: 'Them' },
      'pronoun-male:o': { 1: 'him', plural: 'them' },
      'pronoun-male:Sr': { 1: 'Himself', plural: 'Themselves' },
      'pronoun-male:r': { 1: 'himself', plural: 'themselves' },
      'pronoun-male:Sg': { 1: 'His', plural: 'Their' },
      'pronoun-male:g': { 1: 'his', plural: 'their' },

      'pronoun-female:S': { 1: 'She', plural: 'They' },
      'pronoun-female': { 1: 'she', plural: 'they' },
      'pronoun-female:So': { 1: 'Her', plural: 'Them' },
      'pronoun-female:o': { 1: 'her', plural: 'them' },
      'pronoun-female:Sr': { 1: 'Herself', plural: 'Themselves' },
      'pronoun-female:r': { 1: 'herself', plural: 'themselves' },
      'pronoun-female:Sg': { 1: 'Her', plural: 'Their' },
      'pronoun-female:g': { 1: 'her', plural: 'their' },

      'pronoun-fluid:S': 'They',
      'pronoun-fluid': 'they',
      'pronoun-fluid:So': 'Them',
      'pronoun-fluid:o': 'them',
      'pronoun-fluid:Sr': 'Themselves',
      'pronoun-fluid:r': 'themselves',
      'pronoun-fluid:Sg': 'Their',
      'pronoun-fluid:g': 'their',

      'pronoun-neuter:S': { 1: 'It', plural: 'They' },
      'pronoun-neuter': { 1: 'it', plural: 'they' },
      'pronoun-neuter:So': { 1: 'It', plural: 'Them' },
      'pronoun-neuter:o': { 1: 'it', plural: 'them' },
      'pronoun-neuter:Sr': { 1: 'Itself', plural: 'Themselves' },
      'pronoun-neuter:r': { 1: 'itself', plural: 'themselves' },
      'pronoun-neuter:Sg': { 1: 'Its', plural: 'Their' },
      'pronoun-neuter:g': { 1: 'its', plural: 'their' },

      'pronoun-self:S': { 1: 'I', plural: 'We' },
      'pronoun-self': { 1: 'I', plural: 'we' },
      'pronoun-self:So': { 1: 'Me', plural: 'Us' },
      'pronoun-self:o': { 1: 'me', plural: 'us' },
      'pronoun-self:Sr': { 1: 'Myself', plural: 'Ourselves' },
      'pronoun-self:r': { 1: 'myself', plural: 'ourselves' },
      'pronoun-self:Sg': { 1: 'My', plural: 'Our' },
      'pronoun-self:g': { 1: 'my', plural: 'our' },
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
      ],
      'home-name-list:S': [
        '"Home"',
      ],
      'home-name-list': [
        '"home"',
      ],
      'store-name-list': [
        "Bob's Groceries",
        'Korner Krap',
        'The Generic Store',
      ],
      'marble-name': {
        1: 'a marble',
        2: 'a pair of marbles',
        3: 'some marbles',
        plural: '{c:/current/function/arguments/@count;,} glass marbles',
      }
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
  const CORE_CONTEXT = new itn.SplitContext({
    [cp.APPLICATION_STATE_PATH + '/']: new itn.StorageContext({}),
    [cp.MODULE_PATH + '/']: new itn.SplitContext({
      '/0000-core/': new itn.StorageContext({
        // A generic count for nouns for use in grammar syntax.
        '/noun/count': new itn.NumberAttribute(1, 100000),

        '/preferences/language-set': new GroupDefBuilder()
          .addGroup({
            name: 'en_US',
            matches: { 'en': 1.0, 'en_UK': 0.8 },
            referencePath: '???'
          })
          .build(),
        '/preferences/language': new itn.GroupSetAttribute(
          itn.joinPaths(cp.MODULE_PATH, '0000-core', 'preferences/language-set')),

        // TODO gender should instead be a group.
        //'/person/gender': new itn.FuzzAttribute(),
        //'/person/gender/pronoun': new itn.NameListAttribute('/core', 'pronoun'),
        '/person/gender': new itn.GroupSetAttribute(
          itn.joinPaths(cp.MODULE_PATH, '0000-core', 'person', 'gender-def')
        ),
        '/person/gender-def': new GroupDefBuilder()
          .addGroup({
            name: 'male',
            matches: {},
            referencePath: itn.joinPaths(cp.MODULE_PATH, '0000-core', 'person', 'gender', 'male')
          })
          .addGroup({
            name: 'female',
            matches: {},
            referencePath: itn.joinPaths(cp.MODULE_PATH, '0000-core', 'person', 'gender', 'female')
          })
          .addGroup({
            name: 'fluid',
            matches: {},
            referencePath: itn.joinPaths(cp.MODULE_PATH, '0000-core', 'person', 'gender', 'fluid')
          })
          .build(),
        '/person/gender/male/@pronoun': new itn.LocalizedMessageInternal('/core', 'pronoun-male'),
        '/person/gender/female/@pronoun': new itn.LocalizedMessageInternal('/core', 'pronoun-female'),
        '/person/gender/fluid/@pronoun': new itn.LocalizedMessageInternal('/core', 'pronoun-fluid'),
        '/person/gender/neuter/@pronoun': new itn.LocalizedMessageInternal('/core', 'pronoun-neuter'),


        '/person/possessions/transportation': new itn.GroupSetAttribute(
          itn.joinPaths(cp.MODULE_PATH, '0000-core', 'transportation')),
        '/transportation': new GroupDefBuilder()
          .addGroup({
            name: 'foot',
            matches: {},
            referencePath: itn.joinPaths(cp.MODULE_PATH, '0000-core', 'transportation', 'foot')
          })
          .build(),

        '/transportation/foot/@v-travel': new itn.LocalizedMessageInternal(
          '/module/0000-core/text', 'transportation/foot/v-travel')
      }),
      '/0001-addon/': new itn.StorageContext({
        '/player-name-list': new itn.NameListAttribute('/module/0001-addon/text', 'player-name-list'),

        '/location/home/name-list': new itn.NameListAttribute('/module/0001-addon/text', 'home-name-list'),
        '/location/store/name-list': new itn.NameListAttribute('/module/0001-addon/text', 'store-name-list'),
        // TODO location should probably allow for a topology to encode distances and other concepts like things-on-the-way.
        // Either that, or it is part of the generation and encoded as distance-to-place.  That will need
        // name pointer in context arguments to allow for the pointer to be a variable name.
        '/location/store/distance': new itn.NumberAttribute(0, 100000),

        '/location/store/player-goal': new itn.GroupSetAttribute(
          itn.joinPaths(cp.MODULE_PATH, '0001-addon', 'location/store/player-goals-def')),
        '/location/store/player-goal-count': new itn.NumberAttribute(1, 1000),
        '/location/store/player-goals-def': new GroupDefBuilder()
          .addGroup({
            name: 'marbles',
            matches: { toy: 0.8 },
            referencePath: itn.joinPaths(cp.MODULE_PATH, '0001-addon', 'toys', 'marble')
          })
          .build(),

        '/toys/marble/@name': new itn.LocalizedMessageInternal('/module/0001-addon/text', 'marble-name'),
      }),
    }),
    [cp.APPLICATION_STATE_PATH + '/']: new itn.StorageContext({
      '/users/bobbyj/preferences/language': new itn.GroupSetInternal(
        itn.joinPaths(cp.MODULE_PATH, '0000-core', 'preferences/language'),
        { 'en': 1.0 }),
    }),
    [cp.WORLD_STATE_PATH + '/']: new itn.StorageContext({
      // Rather than define the generation, this is only concerned with the rendering of
      // text.  It is assumed that the values here were generated from other patterns.

      // "/users/bobbyj": this is the current player's login name.  It allows for multiple people to
      // play the same game together with different characters.
      '/users/bobbyj/+adventurer1/@count': new itn.NumberInternal(
        itn.joinPaths(cp.MODULE_PATH, '0000-core', 'noun/count'), 1),
      '/users/bobbyj/+adventurer1/@name': new itn.NameListInternal(
        itn.joinPaths(cp.MODULE_PATH, '0001-addon', 'player-name-list'), 0),

      '/users/bobbyj/+adventurer1/@gender': new itn.GroupSetInternal(
        itn.joinPaths(cp.MODULE_PATH, '0000-core', 'person/gender'),
        { 'male': 1 }),
      '/users/bobbyj/+adventurer1/gender/@pronoun': new itn.NameListInternal(
        itn.joinPaths(cp.MODULE_PATH, '0000-core', 'person/pronoun'), 0),

      '/users/bobbyj/+adventurer1/possessions/@transportation': new itn.GroupSetInternal(
        itn.joinPaths(cp.MODULE_PATH, '0000-core', 'person/possessions/transportation'),
        { 'foot': 1 }),
      // TODO should this ContextReference be here?  We need to reference the real location,
      // but the lookup won't happen this deep (story -> this goal, but not deeper).
      '/users/bobbyj/+adventurer1/location-store-goal/+location': new itn.ContextReference(
        itn.joinPaths(cp.WORLD_STATE_PATH, 'locations/+store')),
      '/users/bobbyj/+adventurer1/location-store-goal/@item': new itn.GroupSetInternal(
        itn.joinPaths(cp.MODULE_PATH, '0001-addon', 'location/store/player-goal'), { 'marbles': 1 }),
      '/users/bobbyj/+adventurer1/location-store-goal/@count': new itn.NumberInternal(
        itn.joinPaths(cp.MODULE_PATH, '0001-addon', 'location/store/player-goal-count'), 1040),
      '/users/bobbyj/+adventurer1/location-store-goal/@distance': new itn.NumberInternal(
        itn.joinPaths(cp.MODULE_PATH, '0001-addon', 'location/store/distance'), 16),

      '/locations/+home/@name': new itn.NameListInternal(
        itn.joinPaths(cp.MODULE_PATH, '0001-addon', 'location/home/name-list'), 91),

      '/locations/+store/@name': new itn.NameListInternal(
        itn.joinPaths(cp.MODULE_PATH, '0001-addon', 'location/store/name-list'), 5),

      '/stories/+s001/+adventurer': new itn.ContextReference(
        // TODO will this be the real path, or a pointer path?  Real path makes more sense.
        itn.joinPaths(cp.WORLD_STATE_PATH, 'users/bobbyj/+adventurer1')),
      '/stories/+s001/+location': new itn.ContextReference(
        itn.joinPaths(cp.WORLD_STATE_PATH, 'locations/+home')),
      '/stories/+s001/+goal': new itn.ContextReference(
        itn.joinPaths(cp.WORLD_STATE_PATH, 'users/bobbyj/+adventurer1/location-store-goal')),

    })
  })
  const CONTEXT = new itn.StackContext([
    // Pointers are created based on the currently executing story fragment.
    itn.createContextReferences(CORE_CONTEXT, '/world/stories/+s001/', cp.CURRENT_CONTEXT_PATH),

    // There are some "static" pointers
    new itn.PointerContext(
      CORE_CONTEXT
    )
      .addPointer(
        // From
        itn.joinPaths(cp.WORLD_STATE_PATH, 'users/bobbyj'),
        // To
        itn.joinPaths(cp.CURRENT_CONTEXT_PATH, '+player'))
      .addPointer(
        // From
        itn.joinPaths(cp.APPLICATION_STATE_PATH, 'users/bobbyj/preferences'),
        // To
        cp.CURRENT_USER_PREFERENCES_PATH),

    // And finally the core values it's all based on.
    CORE_CONTEXT
  ])

  it('basic sentance', () => {
    const formatter = fmt.getTextContextFormatter()
    // The group + count lookup needs to be SEVERELY re-examined.
    const res = formatter(CONTEXT,
      '{l:/current/context/+adventurer/@name} {l:/current/context/+adventurer/possessions/@transportation/@v-travel} ' +
      // Look into getting rid of the pointer.  The first "@" helps to identify the need for it.
      '{c:/current/context/+goal/@distance} kilometers to {l:/current/context/+goal/+location/@name} ' +
      'to buy {l:/current/context/+goal/@item/@name,@count=/current/context/+goal/@count} ' +
      'for {l:/current/context/+adventurer/@gender/@pronoun,@count=/current/context/+adventurer/@count;r}.', LOCALE)
    console.log(res)
    if (hasErrorValue(res)) {
      throw new Error(`generated error ${JSON.stringify(res)}`)
    }
    expect(res.text).toBe('Chris walked 16 kilometers to The Generic Store to buy 1,040 glass marbles for himself.')
  })

  // TODO add a test regarding mis-matched types or not-found values.
  // Unwinding errors is extremely important to helping people make these files.
})
