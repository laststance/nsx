/**
 * =====================================
 * From Database(fetch from MySQL by RestAPI)
 * =====================================
 */
export interface Author {
  id: number
  name: string
  password: string
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
 * RestAPI specific
 * =====================================
 */
export interface APIErrorMessage {
  code: number
  message: string
}

/**
 * =====================================
 * Frontend internal
 * =====================================
 */
export type SnackBarMessage = string
