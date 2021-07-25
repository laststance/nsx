import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Author, Post, Posts } from '../../DataStructure'

interface Credentials {
  name: string
  password: string
}

// Define a service using a base URL and expected endpoints

export const Api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_ENDPOINT,
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

    loginReqest: builder.mutation<Author, Credentials>({
      query: (credentials) => ({
        url: 'login',
        method: 'POST',
        body: credentials,
      }),
    }),

    signupReqest: builder.mutation<Author, Credentials>({
      query: (credentials) => ({
        url: 'signup',
        method: 'POST',
        body: credentials,
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
