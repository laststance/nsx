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
// POST /update
export interface updatePostRequest {
  id: Post['id']
  title: Post['title']
  body: Post['body']
}
export interface updatePostResponse {
  message: 'Post Updated!'
}

// POST /is_login
export interface isLoginRequest {
  author: Author
}
export interface isLoginResponse {
  login: boolean
}

// POST /logout
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
