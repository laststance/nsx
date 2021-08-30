import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import type { Author, Post, Posts } from '../../types'

interface UserIdPassword {
  name: string
  password: string
}

// Define a service using a base URL and expected endpoints
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const requestInfo = Object.defineProperty({}, 'credentials', {
  value: 'include',
  writable: false,
})

// @ts-ignore
export const Api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_ENDPOINT,
    fetchFn: (requestInfo: RequestInfo, ...rest) => fetch(requestInfo, ...rest),
  }),
  endpoints: (builder) => ({
    fetchAllPosts: builder.query<Posts, void>({
      query: () => 'posts',
    }),

    fetchPost: builder.query<Post, Post['id']>({
      query: (id) => ({ url: `post/${id}`, method: 'GET' }),
    }),

    deletePost: builder.mutation<number, Post['id']>({
      query: (id) => ({ url: `post/${id}`, method: 'DELETE' }),
    }),

    createPost: builder.mutation<Post, Post['title'] & Post['body']>({
      query: (post) => ({ url: 'create', method: 'POST', body: post }),
    }),

    updatePost: builder.mutation<Post, Post['title'] & Post['body']>({
      query: (post) => ({
        url: 'update',
        method: 'POST',
        body: post,
      }),
    }),

    loginReqest: builder.mutation<Author, UserIdPassword>({
      query: (loginInfo) => ({
        url: 'login',
        method: 'POST',
        body: loginInfo,
      }),
    }),

    signupReqest: builder.mutation<Author, UserIdPassword>({
      query: (loginInfo) => ({
        url: 'signup',
        method: 'POST',
        body: loginInfo,
      }),
    }),

    isLoginReqest: builder.mutation<{ login: boolean }, { author: Author }>({
      query: (loginInfo) => ({
        url: 'is_login',
        method: 'POST',
        body: loginInfo,
      }),
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useFetchAllPostsQuery,
  useFetchPostQuery,
  useDeletePostMutation,
  useCreatePostMutation,
  useUpdatePostMutation,
  useLoginReqestMutation,
  useSignupReqestMutation,
} = Api
