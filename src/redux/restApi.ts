import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Post, Posts } from '../../DataStructure'

// Define a service using a base URL and expected endpoints
export const restApi = createApi({
  reducerPath: 'restApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_ENDPOINT }),
  endpoints: (builder) => ({
    fetchAllPosts: builder.query<Posts>({
      query: () => 'posts',
      fetchPost: builder.query<Post, Post['id']>({
        query: (id) => ({ url: `post/${id}` }),
      }),
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useFetchAllPostsQuery, useFetchPostQuery } = restApi
