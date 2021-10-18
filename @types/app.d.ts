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

/**
 * API Reqest/Response body types
 */
declare interface ErrorResponse {
  error: string
}

/**
 * GET /api/post_list
 */
declare interface PostListRequestQuery {
  page: number
  per_page: number
}

declare interface PostListResponce {
  total: number
  postList: Post[]
}

/**
 * POST /api/create
 */
declare interface createPostRequest {
  title: Post['title']
  body: Post['body']
}

/**
 * Deletre /api/:id
 */
declare interface deletePostResponse {
  message: 'Delete Successful!'
}

/**
 * POST: /api/update
 */
declare interface updatePostRequest {
  id: Post['id']
  title: Post['title']
  body: Post['body']
}
declare interface updatePostResponse {
  message: 'Post Updated!'
}

/**
 * POST: /api/is_login
 */
declare interface isLoginRequest {
  author: IndexSignature<Author>
}
declare interface isLoginResponse {
  login: boolean
}

/**
 * POST: /api/signup
 */
declare interface signUpRequest {
  name: Author['name']
  password: Author['password']
}
declare type signUpResponse = Author | ErrorResponse

// POST: /api/logout
declare interface LogoutResponse {
  message: 'Logout Successful'
}

/**
 * Authentication
 */
declare type JWTtoken = string

declare type JWTpayload = Author
