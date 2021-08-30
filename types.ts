/**
 * =====================================
 * Domain Data
 * =====================================
 */
export interface Author {
  id: number
  name: string
  password: string
  createdAt: string
  updatedAt: string
}

export interface Post {
  message: string // @TODO separete as a Respose layer type
  id: number
  title: string
  body: string
  createdAt: string
  updatedAt: string
}

export type Posts = Post[]

/**
 * =====================================
 * Frontend internal
 * =====================================
 */
export interface SnackBarMessage {
  message: string
  color: 'red' | 'green'
}
