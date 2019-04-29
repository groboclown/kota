/**
 * Utility to parse "a:b;" flags out of the template text.
 */
export function getNumberFlags(template: string, defaults?: { [key: string]: number } ): { [key: string]: number } {
  const ret: { [key: string]: number } = {}
  if (defaults) {
    Object.keys(defaults).forEach(k => ret[k] = defaults[k])
  }

  template.split(/;/g).forEach(v => {
    const pos = v.indexOf(':')
    if (pos > 0) {
      const key = v.substring(0, pos).trim()
      const val = v.substring(pos + 1).trim()
      if (key.length > 0) {
        if (val.length > 0) {
          const valN = Number(val)
          if (!Number.isNaN(valN)) {
            ret[key] = valN
          }
        } else {
          ret[key] = 1
        }
      }
    } else if (pos < 0) {
      const key = v.trim()
      if (key.length > 0) {
        ret[key] = 1
      }
    }
  })

  return ret
}
