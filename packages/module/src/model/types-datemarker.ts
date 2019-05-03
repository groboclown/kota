
import {
  DateMarkerDirectMapping,
  DateMarkerValueMapping,
} from './schema'


export function isDateMarkerDirectMapping(v: DateMarkerDirectMapping | DateMarkerValueMapping): v is DateMarkerDirectMapping {
  return v.type === 'direct'
}


export function isDateMarkerValueMapping(v: DateMarkerDirectMapping | DateMarkerValueMapping): v is DateMarkerValueMapping {
  return v.type === 'map'
}
