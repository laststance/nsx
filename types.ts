/**
 * =====================================
 * From Database(fetch from MySQL by RestAPI)
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
  id: number
  title: string
  body: string
  author: Author
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
