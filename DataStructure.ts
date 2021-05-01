export interface Author {
  id: number
  name: string
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

export interface APIErrorMessage {
  code: number
  message: string
}
