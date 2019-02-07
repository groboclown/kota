
import * as loc from '../../localization'

export function mkMonthMap(marker: string, prefix: string): loc.LocalizationDateMarkerMappingType {
  return mkDateMap(marker, 'month', prefix, 13)
}
export function mkWeekMap(marker: string, prefix: string): loc.LocalizationDateMarkerMappingType {
  return mkDateMap(marker, 'week', prefix, 7)
}
export function mkDirectMap(marker: string, from: 'day' | 'month' | 'year' | 'yr' | 'week'): loc.LocalizationDateMarkerDirectMappingType {
  return {
    marker: marker,
    from: from,
    'direct-map': true
  }
}
export function mkDateMap(marker: string, from: 'day' | 'month' | 'year' | 'yr' | 'week', prefix: string, count: number): loc.LocalizationDateMarkerMappingType {
  const ret: loc.LocalizationDateMarkerMappingType = {
    marker: marker,
    from: from,
    mapping: {}
  }
  for (var i = 0; i < count; i++) {
    ret.mapping[i] = prefix + i
  }
  return ret
}

// This test class helps to protect our feet.
// Yes, it's punny.
export class MockLoc implements loc.Localization {
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
  constructor(public dateMarkers: loc.LocalizationDateMarkerType[],
    nb?: Partial<loc.LocalizationNumberType>) {
    if (nb) {
      this.number.decimal = nb.decimal ? nb.decimal : this.number.decimal
      this.number.grouping = nb.grouping ? nb.grouping : this.number.grouping
      this.number['grouping-count'] = nb['grouping-count'] ? nb['grouping-count'] : this.number['grouping-count']
      this.number.negative = nb.negative ? nb.negative : this.number.negative
      this.number.positive = nb.positive ? nb.positive : this.number.positive
      this.number.digitsUpper = nb.digitsUpper ? nb.digitsUpper : this.number.digitsUpper
      this.number.digitsLower = nb.digitsLower ? nb.digitsLower : this.number.digitsLower
    }
  }
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
}


describe('mkDateMap', () => {
  it('expected', () => {
    const v = mkDateMap('m', 'day', 'xx', 4)
    expect(v).toEqual({
      marker: 'm', from: 'day', mapping: {
        0: 'xx0', 1: 'xx1', 2: 'xx2', 3: 'xx3'
      }
    })
  })
})
