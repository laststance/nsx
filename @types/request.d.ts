// API Request Prameters
declare namespace Req {
  /**
   * POST: /api/signup
   */
  declare interface SignUp {
    name: User['name']
    password: string
  }

  /**
   * POST /api/login
   */
  declare interface Login {
    name: User['name']
    password: string
  }

  /**
   * GET /api/post_list
   */
  declare interface PostList {
    page: number
    perPage: number
  }

  /**
   * GET /api/tweet/tweet_list
   */
  declare interface TweetList {
    page: number
    perPage: number
  }

  /**
   * POST /api/create
   */
  declare interface CreatePost {
    title: Post['title']
    author: User
    body: Post['body']
  }

  /**
   * POST: /api/update
   */
  declare interface UpdatePost {
    id: Post['id']
    title: Post['title']
    author: User
    body: Post['body']
  }
}
