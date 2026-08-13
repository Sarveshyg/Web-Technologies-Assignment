export type ID = string

export interface Serializable {
  id: ID
}

export type Nullable<T> = T | null

export type ValueOf<T> = T[keyof T]
