import type { RouteComponentProps } from '@reach/router'
import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import React, { memo, useEffect } from 'react'

import Loading from '../../elements/Loading'
import { assertIsDefined } from '../../lib/assertIsDefined'
import { selectLogin } from '../../redux/adminSlice'
import { API } from '../../redux/API'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { selectPage } from '../../redux/pageSlice'
import { enqueSnackbar } from '../../redux/snackbarSlice'
import type { AppDispatch } from '../../redux/store'

import Content from './Content'

interface Props {
  dispatch: AppDispatch
  error: FetchBaseQueryError | SerializedError | undefined
}

const Error: React.FC<Props> = memo(
  ({ dispatch, error }) => {
    useEffect(() => {
      if (error)
        dispatch(enqueSnackbar({ message: error.toString(), color: 'red' }))
    }, [error])

    return null
  },
  () => true
)
Error.displayName = 'Error'

interface RouterParam {
  // Get query paramerter must be string
  postId: Cast<Post['id'], string>
}

const PostPage: React.FC<RouteComponentProps<RouterParam>> = memo(
  ({ postId }) => {
    assertIsDefined(postId)
    const login = useAppSelector(selectLogin)
    const { page, perPage } = useAppSelector(selectPage)
    const dispatch = useAppDispatch()

    const { data, isSuccess } = API.endpoints.fetchPostList.useQueryState({
      page,
      perPage,
    })
    // return cache if it available
    if (data !== undefined && isSuccess) {
      const post = data.postList.find((post) => {
        return post.id === parseInt(postId)
      }) as Post
      if (!post) return <Loading />
      return <Content post={post} login={login} />
    } else {
      // fetch single post without cache
      const {
        data: post,
        isLoading,
        error,
      } = API.endpoints.fetchPost.useQuery(parseInt(postId))
      if (error) <Error error={error} dispatch={dispatch} />
      if (isLoading || post === undefined) return <Loading />
      return <Content post={post} login={login} />
    }
  }
)
PostPage.displayName = 'Post'

export default PostPage
