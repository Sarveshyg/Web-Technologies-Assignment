import { nanoid } from 'nanoid'

export function generateId(): string {
  return nanoid()
}

export function generatePrefixedId(prefix: string): string {
  return `${prefix}_${nanoid()}`
}
