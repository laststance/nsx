import type { RouteComponentProps } from '@reach/router'
import React, { memo } from 'react'

import { assertIsDefined } from '../../lib/assertIsDefined'
import { selectLogin } from '../../redux/adminSlice'
import { API } from '../../redux/API'
import { useAppSelector } from '../../redux/hooks'

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

    const { data, isSuccess } = API.endpoints.fetchAllPosts.useQueryState()
    if (data !== undefined && isSuccess) {
      const post = data.find((post) => {
        return post.id === parseInt(postId)
      }) as Post
      return <Body post={post} login={login} />
    }

    return <FetchSinglePost postId={parseInt(postId)} login={login} />
  }
)
PostPage.displayName = 'Post'

export default PostPage
