/**
 * Domain Data
 */
declare interface Author {
  id: number
  name: string
  password: string
  createdAt: string
  updatedAt: string
}

declare interface Post {
  id: number
  title: string
  body: string
  createdAt: string
  updatedAt: string
}

declare type Posts = Post[]

declare type JWTtoken = string

/**
 * API Reqest/Response body types
 */
// POST /api/create
declare interface createPostRequest {
  title: Post['title']
  body: Post['body']
}

// Deletre /api/:id
declare interface deletePostResponse {
  message: 'Delete Successful!'
}

// POST: /api/update
declare interface updatePostRequest {
  id: Post['id']
  title: Post['title']
  body: Post['body']
}
declare interface updatePostResponse {
  message: 'Post Updated!'
}

// POST: /api/is_login
declare interface isLoginRequest {
  author: IndexSignature<Author>
}
interface isLoginResponse {
  login: boolean
}

// POST: /api/logout
declare interface LogoutResponse {
  message: 'Logout Successful'
}
