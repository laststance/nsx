import type { RouteComponentProps } from '@reach/router'
import React, { memo } from 'react'

import { assertIsDefined } from '../../lib/assertIsDefined'
import { selectLogin } from '../../redux/adminSlice'
import { API } from '../../redux/API'
import { useAppSelector } from '../../redux/hooks'
import { selectPage } from '../../redux/pageSlice'

import Body from './Body'
import FetchSinglePost from './FetchSinglePost'

interface RouterParam {
  // Get query paramerter must be string
  postId: Cast<Post['id'], string>
}

const PostPage: React.FC<RouteComponentProps<RouterParam>> = memo(
  ({ postId }) => {
    assertIsDefined(postId)
    const login = useAppSelector(selectLogin)
    const { page, per_page } = useAppSelector(selectPage)

    const { data, isSuccess } = API.endpoints.fetchPostList.useQueryState({
      page,
      per_page,
    })
    if (data !== undefined && isSuccess) {
      const post = data.postList.find((post) => {
        return post.id === parseInt(postId)
      }) as Post
      return <Body post={post} login={login} />
    }

    return <FetchSinglePost postId={parseInt(postId)} login={login} />
  }
)
PostPage.displayName = 'Post'

export default PostPage
