

export function option<T>(value: T | null | undefined, defaultValue: T): T {
  if (value !== null && value !== undefined) {
    return value
  }
  return defaultValue
}

export function firstOption<T>(values: Array<T | null | undefined>, defaultValue: T): T {
  for (const value of values) {
    if (value !== null && value !== undefined) {
      return value
    }
  }
  return defaultValue
}
