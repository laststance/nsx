import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

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
  reducerPath: 'API',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_ENDPOINT,
    prepareHeaders: (headers: Headers) => {
      return headers
    },
    fetchFn: (requestInfo: RequestInfo, ...rest) => fetch(requestInfo, ...rest),
  }),
  keepUnusedDataFor: 180,
  tagTypes: ['Posts'],
  endpoints: (builder) => ({
    fetchPostList: builder.query<PostListResponce, PostListRequestParam>({
      query: ({ page, perPage }) => `post_list?page=${page}&perPage=${perPage}`,
      providesTags: (result) =>
        result && result.postList
          ? [
              ...result.postList.map(({ id }) => ({
                type: 'Posts' as const,
                id,
              })),
            ]
          : [{ type: 'Posts', id: 0 }],
    }),
    fetchPost: builder.query<Post, Post['id']>({
      query: (id) => ({ url: `post/${id}`, method: 'GET' }),
      providesTags: (result, error, id) => [{ type: 'Posts', id }],
    }),

    deletePost: builder.mutation<DeletePostResponse, Post['id']>({
      query: (id) => ({ url: `post/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [{ type: 'Posts', id }],
    }),

    createPost: builder.mutation<Post, CreatePostRequest>({
      query: (post) => ({ url: 'create', method: 'POST', body: post }),
      invalidatesTags: [{ type: 'Posts' }],
    }),

    updatePost: builder.mutation<UpdatePostResponse, UpdatePostRequest>({
      query: (post) => ({
        url: 'update',
        method: 'POST',
        body: post,
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
export const {
  useDeletePostMutation,
  useLoginReqestMutation,
  useSignupReqestMutation,
} = API
