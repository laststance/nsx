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
// eslint-disable-next-line @typescript-eslint/no-namespace

// POST /is_login
export interface IsLoginRequest {
  author: Author
}
export interface IsLoginResponse {
  login: boolean
}

// POST /logout
export interface LogoutResponse {
  message: string
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
