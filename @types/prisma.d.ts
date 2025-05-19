import type { Prisma } from '@prisma/client'

declare module '@prisma/client' {
  export interface authors {
    createdAt: string
    updatedAt: string
  }

  export interface posts {
    createdAt: string
    updatedAt: string
  }

  export interface stocks {
    createdAt: string
    updatedAt: string
  }

  export interface tweet {
    createdAt: string
    updatedAt: string
  }

  export interface PrismaClient {
    authors: Omit<
      Prisma.AuthorsDelegate<
        Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
      >,
      'findUnique' | 'findFirst' | 'findMany'
    > & {
      findUnique<T extends Prisma.AuthorsFindUniqueArgs>(
        args: T,
      ): Promise<WithDateAsString<Prisma.AuthorsGetPayload<T>> | null>
      findFirst<T extends Prisma.AuthorsFindFirstArgs>(
        args: T,
      ): Promise<WithDateAsString<Prisma.AuthorsGetPayload<T>> | null>
      findMany<T extends Prisma.AuthorsFindManyArgs>(
        args?: T,
      ): Promise<WithDateAsString<Prisma.AuthorsGetPayload<T>>[]>
    }

    posts: Omit<
      Prisma.PostsDelegate<
        Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
      >,
      'findUnique' | 'findFirst' | 'findMany'
    > & {
      findUnique<T extends Prisma.PostsFindUniqueArgs>(
        args: T,
      ): Promise<WithDateAsString<Prisma.PostsGetPayload<T>> | null>
      findFirst<T extends Prisma.PostsFindFirstArgs>(
        args: T,
      ): Promise<WithDateAsString<Prisma.PostsGetPayload<T>> | null>
      findMany<T extends Prisma.PostsFindManyArgs>(
        args?: T,
      ): Promise<WithDateAsString<Prisma.PostsGetPayload<T>>[]>
    }

    stocks: Omit<
      Prisma.StocksDelegate<
        Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
      >,
      'findUnique' | 'findFirst' | 'findMany'
    > & {
      findUnique<T extends Prisma.StocksFindUniqueArgs>(
        args: T,
      ): Promise<WithDateAsString<Prisma.StocksGetPayload<T>> | null>
      findFirst<T extends Prisma.StocksFindFirstArgs>(
        args: T,
      ): Promise<WithDateAsString<Prisma.StocksGetPayload<T>> | null>
      findMany<T extends Prisma.StocksFindManyArgs>(
        args?: T,
      ): Promise<WithDateAsString<Prisma.StocksGetPayload<T>>[]>
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
