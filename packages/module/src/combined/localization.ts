
import {
  Localization,
  LocaleName,
  MediaImage,
  L10NNumberFormat,
  DateMarkerDirectMapping,
  DateMarkerValueMapping,
} from '../model'

export interface LocaleSet {
  [locale: string]: CombinedLocalization
}

export interface CombinedLocalization {
  locale: LocaleName
  name: string
  icon: MediaImage
  translationSearchOrder: LocaleName[]
  number: L10NNumberFormat
  dateMarkers: { [marker: string]: (DateMarkerDirectMapping | DateMarkerValueMapping) }
  missingParents: LocaleName[]
}


export class CombinedLocalizationVisitor {
  // List of each locale's IDs in visited order, so that the first visited one is at
  // the start of the list.
  private readonly locales: { [id: string]: LocaleOrderedTree } = {}
  private built: boolean = false

  /**
   * Visits a single localization block from a module's file structure.
   * 
   * Note that the defined search order is a depth-first search:
   *   1. The last node added.
   *   2. For each parent of the node, recurse at step 1.
   *   3. For the previous node, recurse at step 1.
   * 
   * @param modulePath the base module path that was used as input to the
   *    `readModuleContents` call.
   * @param lz the module's localization block.
   */
  addLocale(modulePath: string, lz: Localization): this {
    const previous: LocaleOrderedTree | null = this.locales[lz.locale] || null
    const current: LocaleOrderedTree = {
      id: `${lz.locale}@${modulePath}`,
      modulePath,
      lz,
      previous,
      parentTrees: [],
      missingParents: [],
      translationSearchOrder: [lz.locale],
      dateMarkers: {},
      visitState: 'added',

      // don't make a copy of the parent list.
      parents: lz.parents,
    }
    this.locales[current.id] = current

    return this
  }


  build(): LocaleSet {
    if (this.built) {
      throw new Error('already built')
    }
    this.built = true

    const ret: LocaleSet = {}

    // Iterative depth-first search, looking at parents before the previous.
    // First, we'll initialize the parentTrees by assigning it to the
    // current root of the parent locales.  This is a simple stack loop.
    Object.keys(this.locales).forEach((locale) => {
      let node: LocaleOrderedTree | null = this.locales[locale]
      while (node) {
        node.parents.forEach((p) => {
          // Practically speaking, we don't need this extra "if node" check,
          // but from a typescript perspective, it's necessary because it
          // doesn't know the lifecycle of this function inside the forEach call.
          if (node) {
            const pc = this.locales[p]
            if (pc) {
              node.parentTrees.push(pc)
            } else {
              node.missingParents.push(p)
            }
          }
        })
        // Move to the previously declared version of this locale.
        node = node.previous
      }
    })

    // Now that we've initialized the list, we can compress them together.
    Object.keys(this.locales).forEach((locale) => {
      ret[locale] = combineTree(this.locales[locale])
    })

    return ret
  }
}


/**
 * A single module's single locale definition.
 * The root (first entry) is a non-defined modulePath and lz value.
 * "modulePath" here means the path to the module, which is the
 * basis for finding all the relative paths within the locale.
 */
interface LocaleOrderedTree {
  id: string
  modulePath: string
  lz: Localization
  parents: string[]
  parentTrees: LocaleOrderedTree[]
  previous: LocaleOrderedTree | null
  missingParents: string[]
  visitState: 'added' | 'visiting' | 'complete'

  // For reuse of loaded values.
  translationSearchOrder: LocaleName[]
  dateMarkers: { [marker: string]: (DateMarkerDirectMapping | DateMarkerValueMapping) }
}


function combineTree(root: LocaleOrderedTree): CombinedLocalization {
  if (!root.lz || !root.modulePath) {
    throw new Error(`invalid state`)
  }
  const ret: CombinedLocalization = {
    locale: root.lz.locale,
    name: root.lz.name,
    icon: root.lz.icon,
    number: root.lz.number,

    // These will be populated by searching the tree nodes.
    translationSearchOrder: [],
    missingParents: [],
    dateMarkers: {},
  }

  const stack: LocaleOrderedTree[] = [root]
  while (true) {
    // Careful with the stack order...
    const node = stack.pop()
    if (!node) {
      break
    }

    if (node.visitState === 'added') {
      // This is a brand new node which needs to have its parents
      // added into the list.
      node.visitState = 'visiting'
      if (node.parentTrees.length > 0) {
        // insert the parents in the stack and the current node
        // after them, because they should be loaded by now.
        // Be careful with ordering, remembering that we pop (take off
        // from the end).  So add the current node again and its
        // parents after it, so that the parents all are handled
        // before the node.
        // HOWEVER if any node is already in the stack, then that means
        // there might be a cycle, so skip it and handle it further down
        // the stack, where its dependencies have been populated.
        if (stack.indexOf(node) < 0) {
          stack.push(node)
        }
        node.parentTrees
          .filter((p) => stack.indexOf(p) < 0)
          .forEach((p) => stack.push(p))

        // Loop to the next item in the stack.
        continue
      }

      // Else, there are no parents, so skip to the visiting check.
    }
    if (node.visitState === 'visiting') {
      // All the parents have handled themselves by now.
      // There might be a case where a parent wasn't fully populated, which would
      // mean that there was a cycle.
      // In either case, we can merge together here.
      node.parentTrees.forEach((p) => {
        if (node.translationSearchOrder.indexOf(p.lz.locale) < 0) {
          node.translationSearchOrder.push(p.lz.locale)
        }
        p.lz.dateMarkers.forEach((dm) => {
          if (!node.dateMarkers[dm.marker]) {
            node.dateMarkers[dm.marker] = dm.map
          }
        })
        p.missingParents.forEach((z) => node.missingParents.push(z))
      })
      node.visitState = 'complete'
    }
    // Skip if it's already completed.
  }

  // Root should now be populated.
  // So copy those over to the returned object
  ret.missingParents = root.missingParents.concat([])
  ret.translationSearchOrder = root.translationSearchOrder.concat([])
  ret.dateMarkers = { ...root.dateMarkers }
  return ret
}
