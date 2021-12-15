import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const endpoint = import.meta.env.VITE_API_ENDPOINT

interface UserIdPassword {
  name: Author['name']
  password: Author['password']
}

// Define a service using a base URL and expected endpoints
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const requestInfo = Object.defineProperty({}, 'credentials', {
  value: 'include',
  writable: false,
})

export const API = createApi({
  reducerPath: 'RTK_Query',
  baseQuery: fetchBaseQuery({
    baseUrl: endpoint,
    prepareHeaders: (headers: Headers) => {
      return headers
    },
    fetchFn: (requestInfo: RequestInfo, ...rest) => fetch(requestInfo, ...rest),
  }),
  keepUnusedDataFor: 180,
  tagTypes: ['Posts'],
  endpoints: (builder) => ({
    fetchPostList: builder.query<PostListResponce, PostListRequestParamClient>({
      query: ({ page, perPage }) => `post_list?page=${page}&perPage=${perPage}`,
      providesTags: (result) =>
        result && result.postList
          ? [
              ...result.postList.map(({ id }) => ({
                type: 'Posts' as const,
                id,
              })),
              { type: 'Posts', id: 'LIST' },
            ]
          : [{ type: 'Posts', id: 'LIST' }],
    }),
    fetchPost: builder.query<Post, Post['id']>({
      query: (id) => ({ url: `post/${id}`, method: 'GET' }),
      providesTags: (result, error, id) => [{ type: 'Posts', id }],
    }),

    deletePost: builder.mutation<
      DeletePostResponse,
      { id: Post['id']; author: Author }
    >({
      query: ({ id, author }) => ({
        url: `post/${id}/`,
        method: 'DELETE',
        body: { author: author },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Posts', id }],
    }),

    createPost: builder.mutation<Post, CreatePostRequest>({
      query: (values) => ({
        url: 'create',
        method: 'POST',
        body: values,
      }),
      invalidatesTags: () => [{ type: 'Posts' }],
    }),

    updatePost: builder.mutation<UpdatePostResponse, UpdatePostRequest>({
      query: (values) => ({
        url: 'update',
        method: 'POST',
        body: values,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Posts', id }],
    }),

    loginReqest: builder.mutation<LoginResponse, UserIdPassword>({
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
    logoutRequest: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: 'logout',
        method: 'GET',
      }),
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useLoginReqestMutation, useSignupReqestMutation } = API
