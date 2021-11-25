import type { RouteComponentProps } from '@reach/router'
import React, { memo } from 'react'

import Loading from '../../elements/Loading'
import { assertIsDefined } from '../../lib/assertIsDefined'
import { selectLogin } from '../../redux/adminSlice'
import { API } from '../../redux/API'
import { useAppSelector } from '../../redux/hooks'
import { selectPage } from '../../redux/pageSlice'
import NotFound from '../NotFound'

import Content from './Content'

interface RouterParam {
  // Get query paramerter must be string
  postId: Cast<Post['id'], string>
}

const PostPage: React.FC<RouteComponentProps<RouterParam>> = memo(
  ({ postId }) => {
    assertIsDefined(postId)
    const login = useAppSelector(selectLogin)
    const { page, perPage } = useAppSelector(selectPage)

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
    }

    return <NotFound />
  }
)
PostPage.displayName = 'Post'

export default PostPage
