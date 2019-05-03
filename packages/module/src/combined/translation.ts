
import {
  CombinedLocalization,
} from './localization'
import {
  Translation,
  LocaleName,
} from '../model'
import {
  ModuleContents,
} from './module'

export interface ModuleTranslation extends Translation {
  // for traceability and debugging...
  moduleId: string
  modulePath: string
}

/**
 * Message catalogs for a specific locale.
 */
export interface DomainTranslations {
  /**
   * The order of translations is highly important.  Items
   * with a lower index override translation messages in the higher
   * index.
   */
  [domain: string]: ModuleTranslation[]
}


/**
 * Constructs the correctly sorted translations.  The ordering is based
 * upon the priority of:
 *   1. The module load order.
 *   2. The translation order of the localization
 * We would anticipate that later modules have their own set of reasons to
 * override the message, but it may not be as wide in its translations.
 * The user may have additional restrictions on this (say, only show
 * Cherokee messages) that can be applied on top of the lists as a filter.
 * 
 * @param locale the locale to use to assemble the domain translations
 * @param modules list of modules in load order (lower index means loaded first).  Later
 *    loaded modules override earlier ones.  It is the order returned by
 *    `ModuleCollector`
 */
export function createCatalogs(locale: CombinedLocalization, modules: ModuleContents[]): DomainTranslations {
  // Quick lookup for the ordering of each language.
  const sortOrder: { [locale: string]: number } = {}
  locale.translationSearchOrder.forEach((localeName, index) => {
    sortOrder[localeName] = index
  })

  const ret: DomainTranslations = {}
  modules.forEach((mod) => {
    // Within this module, create a sorted list.
    const modTx: DomainTranslations = {}
    mod.contents.translations.forEach((tn) => {
      const order = sortOrder[tn.locale]
      if (order !== undefined) {
        // supported translation.
        const domain = modTx[tn.domain] || []
        modTx[tn.domain] = domain
        domain.push({
          modulePath: mod.path,
          moduleId: mod.header.id,
          ...tn,
        })
      }
    })
    // Sort those translations by the index
    Object.keys(modTx).forEach((domain) => {
      ret[domain] = (ret[domain] || []).concat(
        modTx[domain].sort((x, y) => (sortOrder[x.locale] - sortOrder[y.locale]))
      )
    })
  })
  return ret
}


/**
 * 
 * @param domain 
 * @param tx 
 * @param filter an optional filter to omit translation locales that the user may not want.
 */
export function getLocalizedDomainTranslations(
  domain: string, tx: DomainTranslations, filter?: (locale: LocaleName) => boolean
): ModuleTranslation[] {
  const ret = tx[domain]
  if (!ret) {
    return []
  }
  if (!filter) {
    return ret
  }
  return ret.filter((t) => filter(t.locale))
}
