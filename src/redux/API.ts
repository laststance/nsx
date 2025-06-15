import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { logout } from './adminSlice'

const endpoint = process.env.VITE_API_ENDPOINT

const baseQuery = fetchBaseQuery({
  baseUrl: endpoint,
  credentials: 'include',
  fetchFn: async (requestInfo: RequestInfo, ...rest) =>
    fetch(requestInfo, ...rest),
  prepareHeaders: (headers: Headers) => {
    return headers
  },
})

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions)

  // Handle 401 unauthorized responses
  if (result.error && result.error.status === 401) {
    // Dispatch logout action to update Redux state
    api.dispatch(logout())

    // Redirect to login page
    window.location.href = '/'
  }

  return result
}

export const API = createApi({
  reducerPath: 'RTK_Query',
  tagTypes: ['Posts', 'Tweets'],
  keepUnusedDataFor: 30,
  baseQuery: baseQueryWithReauth,
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
      { id: Post['id']; author: User }
    >({
      invalidatesTags: (_result, _error, { id }) => [{ id, type: 'Posts' }],
      query: ({ id, author }) => ({
        body: { author: author },
        method: 'DELETE',
        url: `post/${id}/`,
      }),
    }),

    deleteStock: builder.mutation<
      Res.DeleteStock,
      { id: Stock['id']; author: User }
    >({
      query: ({ id, author }) => ({
        body: { author: author },
        method: 'DELETE',
        url: `stock/${id}/`,
      }),
    }),

    fetchPost: builder.query<Post, Post['id']>({
      providesTags: (_result, _error, id) => [{ id, type: 'Posts' }],
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

    signupReqest: builder.mutation<User, Req.Login>({
      query: (loginInfo) => ({
        body: loginInfo,
        method: 'POST',
        url: 'signup',
      }),
    }),

    validateToken: builder.query<{ valid: boolean; author?: User }, void>({
      query: () => ({
        method: 'GET',
        url: 'validate',
      }),
    }),

    updatePost: builder.mutation<Res.UpdatePost, Req.UpdatePost>({
      invalidatesTags: (_result, _error, { id }) => [{ id, type: 'Posts' }],
      query: (values) => ({
        body: values,
        method: 'POST',
        url: 'update',
      }),
    }),
    fetchAllTweet: builder.query<any[], void>({
      query: () => ({ method: 'GET', url: 'tweet' }),
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Tweets' as const, id })),
              { type: 'Tweets', id: 'LIST' },
            ]
          : [{ type: 'Tweets', id: 'LIST' }],
    }),
    createTweet: builder.mutation({
      query: (text: string) => ({
        method: 'POST',
        url: 'tweet',
        body: { text },
      }),
      invalidatesTags: (result, _error) =>
        result ? [{ type: 'Tweets', id: 'LIST' }] : [],
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetUserCountQuery,
  useSignupReqestMutation,
  useFetchAllTweetQuery,
  useCreateTweetMutation,
} = API
