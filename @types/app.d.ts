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

  /**
   * POST /api/create
   */
  declare interface CreatePost {
    title: Post['title']
    body: Post['body']
    author: Author
  }

  /**
   * POST: /api/update
   */
  declare interface UpdatePost {
    id: Post['id']
    title: Post['title']
    body: Post['body']
    author: Author
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

  declare interface PostList {
    total: number
    postList: Post[]
  }

  declare interface UpdatePost {
    message: 'Post Updated!'
  }

  /**
   * Deletre /api/:id
   */
  declare interface DeletePost {
    message: 'Delete Successful!'
  }

  // POST: /api/logout
  declare interface Logout {
    message: 'Logout Successful'
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

/**
 * POST: /api/signup
 */
declare interface SignUpRequest {
  name: Author['name']
  password: Author['password']
}
declare type SignUpResponse = Author | ErrorResponse

/**
 * Authentication
 */
declare type JWTtoken = string

declare type JWTpayload = Author // @TODO Omit password
