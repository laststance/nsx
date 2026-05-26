/**
 * Domain Data
 */

declare interface User {
  id: number
  name: string
  createdAt: string
  updatedAt: string
}

declare interface Post {
  id: number
  authorId: number
  title: string
  body: string
  createdAt: string
  updatedAt: string
}

declare type Posts = Post[]

declare interface Stock {
  id: number
  createdAt: string
  pageTitle: string
  updatedAt: string
  url: string
  userId: number
}

declare type StockList = Stock[]

declare interface Tweet {
  id: number
  text: string
  createdAt: string
  updatedAt: string
  userId: number
}

/**
 * Authentication
 */
declare type JWTtoken = string

declare interface AuthenticatedUser extends User {
  password: string
  useLegacyHoverColors: boolean
}

declare type JWTpayload = AuthenticatedUser

declare namespace Express {
  export interface Request {
    authenticatedUser?: AuthenticatedUser
  }
}
