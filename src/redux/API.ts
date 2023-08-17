import type {
  MutationDefinition,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const endpoint = process.env.VITE_API_ENDPOINT

export const API = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: endpoint,
    fetchFn: async (requestInfo: RequestInfo, ...rest) =>
      fetch(requestInfo, ...rest),
    prepareHeaders: (headers: Headers) => {
      return headers
    },
  }),
  endpoints: (builder) => ({
    createPost: builder.mutation<Post, Req.CreatePost>({
      invalidatesTags: () => [{ type: 'Posts' }],
      query: (values) => ({
        body: values,
        method: 'POST',
        url: 'create',
      }),
    }),

    deletePost: builder.mutation<
      Res.DeletePost,
      { id: Post['id']; author: Author }
    >({
      invalidatesTags: (result, error, { id }) => [{ id, type: 'Posts' }],
      query: ({ id, author }) => ({
        body: { author: author },
        method: 'DELETE',
        url: `post/${id}/`,
      }),
    }),

    deleteStock: builder.mutation<
      Res.DeleteStock,
      { id: Stock['id']; author: Author }
    >({
      query: ({ id, author }) => ({
        body: { author: author },
        method: 'DELETE',
        url: `stock/${id}/`,
      }),
    }),

    fetchPost: builder.query<Post, Post['id']>({
      providesTags: (result, error, id) => [{ id, type: 'Posts' }],
      query: (id) => ({ method: 'GET', url: `post/${id}` }),
    }),

    fetchPostList: builder.query<Res.PostList, Req.PostList>({
      providesTags: (result) =>
        result && result.postList
          ? [
              ...result.postList.map(({ id }) => ({
                id,
                type: 'Posts' as const,
              })),
              { id: 'LIST', type: 'Posts' },
            ]
          : [{ id: 'LIST', type: 'Posts' }],
      query: ({ page, perPage }) => `post_list?page=${page}&perPage=${perPage}`,
    }),

    getStockList: builder.query<StockList, void>({
      query: () => ({
        method: 'GET',
        url: 'stocklist',
      }),
    }),

    getUserCount: builder.query<Res.GetUserCount, void>({
      query: () => ({
        method: 'GET',
        url: 'user_count',
      }),
    }),

    loginReqest: builder.mutation<Res.Login, Req.Login>({
      query: (loginInfo) => ({
        body: loginInfo,
        method: 'POST',
        url: 'login',
      }),
    }),

    logoutRequest: builder.mutation<Res.Logout, void>({
      query: () => ({
        method: 'GET',
        url: 'logout',
      }),
    }),

    signupReqest: builder.mutation<Author, Req.Login>({
      query: (loginInfo) => ({
        body: loginInfo,
        method: 'POST',
        url: 'signup',
      }),
    }),

    updatePost: builder.mutation<Res.UpdatePost, Req.UpdatePost>({
      invalidatesTags: (result, error, { id }) => [{ id, type: 'Posts' }],
      query: (values) => ({
        body: values,
        method: 'POST',
        url: 'update',
      }),
    }),
  }),
  keepUnusedDataFor: 180,
  reducerPath: 'RTK_Query',
  tagTypes: ['Posts'],
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetUserCountQuery, useSignupReqestMutation } = API

export type CreatePostMutationDefinition = MutationDefinition<
  Req.CreatePost,
  BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError,
    {},
    FetchBaseQueryMeta
  >,
  'Posts',
  Post,
  'RTK_Query'
>
