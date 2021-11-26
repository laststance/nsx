import type { RouteComponentProps } from '@reach/router'
import React, { memo } from 'react'

import Loading from '../../elements/Loading'
import { assertIsDefined } from '../../lib/assertIsDefined'
import { selectLogin } from '../../redux/adminSlice'
import { API } from '../../redux/API'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { selectPage } from '../../redux/pageSlice'

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

    const { data, isSuccess } = API.endpoints.fetchPostList.useQueryState({
      page,
      perPage,
    })
    // return cache if it available
    if (data !== undefined && isSuccess) {
      const post = data.postList.find((post) => {
        return post.id === parseInt(postId)
      })
      if (!post) return <Loading />
      return <Content post={post} login={login} />
    } else {
      // fetch single post without cache
      const { data, isLoading, error } = API.endpoints.fetchPost.useQuery(
        parseInt(postId)
      )
      if (error) <Error error={error} dispatch={dispatch} />
      if (isLoading || data === undefined) return <Loading />
      return <Content post={data} login={login} />
    }
  }
)
PostPage.displayName = 'Post'

export default PostPage
