// API Response Parameters
declare namespace Res {
  declare type AuthError = {
    error: 'Invalid credentials'
    code: 'AUTHENTICATION_FAILED'
  }

  declare type ValidationIssue = {
    field: string
    message: string
    code: string
  }

  /**
   * POST /api/login
   */
  declare type Login = User

  /**
   * POST: /api/signup
   */
  declare type SignUp = User | Res.Error

  /**
   * GET /api/user_count
   */
  declare interface GetUserCount {
    userCount: number
  }

  declare interface PostList {
    postList: Post[]
    total: number
  }

  declare interface TweetList {
    tweetList: Tweet[]
    total: number
  }

  declare interface UpdatePost {
    message: 'Post Updated!'
  }

  /**
   * Deletre /api/:id
   */
  declare interface DeletePost {
    success: true
  }

  // POST: /api/logout
  declare interface Logout {
    success: true
  }

  // DELETE /api/stock/:id
  declare interface DeleteStock {
    success: true
  }
  /**
   * API Reqest/Response body types
   */
  declare type Error = {
    error: string
    code?: string
    details?: Res.ValidationIssue[]
  }
}
