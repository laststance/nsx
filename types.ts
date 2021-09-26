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
  id: number
  title: string
  body: string
  createdAt: string
  updatedAt: string
}

export type Posts = Post[]

/**
 * =====================================
 * API Reqest/Response body types
 * =====================================
 */
// POST /api/create
export interface createPostRequest {
  title: Post['title']
  body: Post['body']
}

// Deletre /api/:id
export interface deletePostResponse {
  message: 'Delete Successful!'
}

// POST: /api/update
export interface updatePostRequest {
  id: Post['id']
  title: Post['title']
  body: Post['body']
}
export interface updatePostResponse {
  message: 'Post Updated!'
}

// POST: /api/is_login
export interface isLoginRequest {
  author: Author
}
export interface isLoginResponse {
  login: boolean
}

// POST: /api/logout
export interface LogoutResponse {
  message: 'Logout Successful'
}

/**
 * =====================================
 * Frontend internal
 * =====================================
 */
export interface SnackBarMessage {
  message: string
  color: 'red' | 'green'
}
