import React from 'react'
import { RouteComponentProps } from '@reach/router'
import { Post } from '../DataStructure'

interface RouterParam {
  postId: Post['id']
}

export const PostPage: React.FC<RouteComponentProps<RouterParam>> = ({
  postId,
}) => {
  return <div>postId: {postId}</div>
}
