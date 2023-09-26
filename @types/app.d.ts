/**
 * Domain Data
 */

declare interface Author {
  id: number
  name: string
  createdAt: string
  password: string
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
  createdAt: string
  pageTitle: string
  updatedAt: string
  url: string
}

declare type StockList = Stock[]

/**
 * Authentication
 */
declare type JWTtoken = string

declare type JWTpayload = Author // @TODO Omit password
