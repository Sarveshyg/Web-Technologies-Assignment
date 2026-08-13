export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as T
  if (Array.isArray(obj)) return obj.map(deepClone) as T
  const cloned: Record<string, unknown> = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloned[key] = deepClone((obj as Record<string, unknown>)[key])
    }
  }
  return cloned as T
}

export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> {
  const result = {} as Pick<T, K>
  for (const key of keys) {
    if (key in obj) result[key] = obj[key]
  }
  return result
}

export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  const result = { ...obj } as Record<string, unknown>
  for (const key of keys) {
    delete result[key as string]
  }
  return result as Omit<T, K>
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === '[object Object]'
}

export function mergeDeep<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>,
): T {
  const output = { ...target }
  for (const key in source) {
    if (isPlainObject(source[key]) && isPlainObject(target[key])) {
      output[key] = mergeDeep(
        target[key] as Record<string, unknown>,
        source[key] as Record<string, unknown>,
      ) as T[typeof key]
    } else if (source[key] !== undefined) {
      output[key] = source[key] as T[typeof key]
    }
  }
  return output
}
