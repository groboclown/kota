
/**
 * Searches for '%X' style text, where "X" is a key in the store (must be 1
 * character).  Automatically performs "%%" escaping.
 */
export function replacePercentText(template: string, store: { [key: string]: string }): string {
  var ret = ''
  var enc = false
  for (var i = 0; i < template.length; i++) {
    const c = template[i]
    if (enc) {
      if (c === '%') {
        ret += '%'
      } else {
        const r = store[c]
        if (r === undefined) {
          ret += '%' + c
        } else {
          ret += r
        }
      }
      enc = false
    } else {
      if (c === '%') {
        enc = true
      } else {
        ret += c
      }
    }
  }
  if (enc) {
    ret += '%'
  }
  return ret
}
