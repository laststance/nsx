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

declare interface Stock {
  id: number
  pageTitle: string
  url: string
  createdAt: string
  updatedAt: string
}

declare type StockList = Stock[]

// API Request Types
declare namespace Req {
  /**
   * POST /api/login
   */
  declare interface Login {
    name: Author['name']
    password: Author['password']
  }

  /**
   * GET /api/post_list
   */
  declare interface PostList {
    page: number
    perPage: number
  }
}

// API Response Types
declare namespace Res {
  declare type Login = Author | Res.failedMessage
  /**
   * GET /api/user_count
   */
  declare interface GetUserCount {
    userCount: number
  }

  /**
   * API Reqest/Response body types
   */
  declare type ErrorResponse = {
    error: string
  }
  // Use to when user failed something within intended aplication behavior e.g. failed login by miss type password
  declare type failedMessage = { failed: string }
}

declare interface PostListRequestParamServer {
  page: Override<number, string>
  perPage: Override<number, string>
}

declare interface PostListResponce {
  total: number
  postList: Post[]
}

/**
 * POST /api/create
 */
declare interface CreatePostRequest {
  title: Post['title']
  body: Post['body']
  author: Author
}

/**
 * Deletre /api/:id
 */
declare interface DeletePostResponse {
  message: 'Delete Successful!'
}

/**
 * POST: /api/update
 */
declare interface UpdatePostRequest {
  id: Post['id']
  title: Post['title']
  body: Post['body']
  author: Author
}
declare interface UpdatePostResponse {
  message: 'Post Updated!'
}

/**
 * POST: /api/is_login
 */
declare interface IsLoginRequest {
  author: IndexSignature<Author>
}
declare interface isLoginResponse {
  login: boolean
}

/**
 * POST: /api/signup
 */
declare interface SignUpRequest {
  name: Author['name']
  password: Author['password']
}
declare type SignUpResponse = Author | ErrorResponse

// POST: /api/logout
declare interface LogoutResponse {
  message: 'Logout Successful'
}

/**
 * Authentication
 */
declare type JWTtoken = string

declare type JWTpayload = Author // @TODO Omit password
