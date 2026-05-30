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
   * A Personal Access Token as exposed to the Settings UI (masked — never the raw value).
   */
  declare interface PersonalAccessToken {
    id: number
    name: string
    tokenSuffix: string
    createdAt: string
    lastUsedAt: string | null
    revokedAt: string | null
  }

  // GET /api/personal_access_token/list
  declare interface PersonalAccessTokenList {
    tokens: Res.PersonalAccessToken[]
  }

  // POST /api/personal_access_token — `token` is the raw value, returned exactly once.
  declare interface MintPersonalAccessToken {
    id: number
    name: string
    tokenSuffix: string
    createdAt: string
    token: string
  }

  // DELETE /api/personal_access_token/:id
  declare interface RevokePersonalAccessToken {
    id: number
    revokedAt: string
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
