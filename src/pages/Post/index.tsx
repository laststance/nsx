import type { RouteComponentProps } from '@reach/router'
import React, { memo } from 'react'

import Loading from '../../elements/Loading'
import { assertIsDefined } from '../../lib/assertIsDefined'
import { selectLogin } from '../../redux/adminSlice'
import { API } from '../../redux/API'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { selectPage } from '../../redux/pageSlice'
import NotFound from '../NotFound'

import Content from './Content'
import Error from './Error'

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

    const { post } = API.endpoints.fetchPostList.useQueryState(
      {
        page,
        perPage,
      },
      {
        selectFromResult: (state) => {
          if (state.data === undefined) return { post: undefined }

          const post = state.data.postList.find((post) => {
            return post.id === parseInt(postId)
          })

          return { post }
        },
      }
    )

    // return cache if it available
    if (post !== undefined && post.id && post.title && post.body) {
      return <Content post={post} login={login} />
    } else {
      // fetch single post without cache
      const { data, isLoading, error } = API.endpoints.fetchPost.useQuery(
        parseInt(postId)
      )
      if (error) <Error error={error} dispatch={dispatch} />
      if (isLoading && data === undefined) return <Loading />
      if (data) {
        return <Content post={data} login={login} />
      } else {
        return <NotFound />
      }
    }
  }
)
PostPage.displayName = 'Post'

export default PostPage
