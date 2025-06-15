import type { Prisma } from '@prisma/client'

declare module '@prisma/client' {
  export interface User {
    createdAt: string
    updatedAt: string
  }

  export interface Post {
    createdAt: string
    updatedAt: string
  }

  export interface Stock {
    createdAt: string
    updatedAt: string
  }

  export interface tweet {
    createdAt: string
    updatedAt: string
  }

  export interface PrismaClient {
    User: Omit<
      Prisma.UserDelegate<
        Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
      >,
      'findUnique' | 'findFirst' | 'findMany'
    > & {
      findUnique<T extends Prisma.UserFindUniqueArgs>(
        args: T,
      ): Promise<WithDateAsString<Prisma.UserGetPayload<T>> | null>
      findFirst<T extends Prisma.UserFindFirstArgs>(
        args: T,
      ): Promise<WithDateAsString<Prisma.UserGetPayload<T>> | null>
      findMany<T extends Prisma.UserFindManyArgs>(
        args?: T,
      ): Promise<WithDateAsString<Prisma.UserGetPayload<T>>[]>
    }

    Post: Omit<
      Prisma.PostDelegate<
        Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
      >,
      'findUnique' | 'findFirst' | 'findMany'
    > & {
      findUnique<T extends Prisma.PostFindUniqueArgs>(
        args: T,
      ): Promise<WithDateAsString<Prisma.PostGetPayload<T>> | null>
      findFirst<T extends Prisma.PostFindFirstArgs>(
        args: T,
      ): Promise<WithDateAsString<Prisma.PostGetPayload<T>> | null>
      findMany<T extends Prisma.PostFindManyArgs>(
        args?: T,
      ): Promise<WithDateAsString<Prisma.PostGetPayload<T>>[]>
    }

    Stock: Omit<
      Prisma.StockDelegate<
        Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
      >,
      'findUnique' | 'findFirst' | 'findMany'
    > & {
      findUnique<T extends Prisma.StockFindUniqueArgs>(
        args: T,
      ): Promise<WithDateAsString<Prisma.StockGetPayload<T>> | null>
      findFirst<T extends Prisma.StockFindFirstArgs>(
        args: T,
      ): Promise<WithDateAsString<Prisma.StockGetPayload<T>> | null>
      findMany<T extends Prisma.StockFindManyArgs>(
        args?: T,
      ): Promise<WithDateAsString<Prisma.StockGetPayload<T>>[]>
    }

    tweet: Omit<
      Prisma.TweetDelegate<
        Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
      >,
      'findUnique' | 'findFirst' | 'findMany'
    > & {
      findUnique<T extends Prisma.TweetFindUniqueArgs>(
        args: T,
      ): Promise<WithDateAsString<Prisma.TweetGetPayload<T>> | null>
      findFirst<T extends Prisma.TweetFindFirstArgs>(
        args: T,
      ): Promise<WithDateAsString<Prisma.TweetGetPayload<T>> | null>
      findMany<T extends Prisma.TweetFindManyArgs>(
        args?: T,
      ): Promise<WithDateAsString<Prisma.TweetGetPayload<T>>[]>
    }
  }
}

type WithDateAsString<T> = {
  [K in keyof T]: T[K] extends Date ? string : T[K]
}
