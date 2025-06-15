// API Response Parameters
declare namespace Res {
  // Use to when user failed something within intended aplication behavior e.g. failed login by miss type password
  declare type failedMessage = { failed: string }
  /**
   * POST /api/login
   */
  declare type Login = User | Res.failedMessag

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

  // DELETE /api/stock/:id
  declare interface DeleteStock {
    message: 'Delete Successful!'
  }
  /**
   * API Reqest/Response body types
   */
  declare type Error = {
    error: string
  }
}
