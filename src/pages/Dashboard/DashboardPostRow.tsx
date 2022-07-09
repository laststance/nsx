import type { QueryActionCreatorResult } from '@reduxjs/toolkit/dist/query/core/buildInitiate'
import React, { memo } from 'react'

import PostDate from '../../components/PostDate/PostDate'
import PostLink from '../Index/PostList/PostRow/PostLink/index'

import EditButtonGroup from './EditButtonGroup'

interface Props {
  post: Post
  index: number
  author: Author
  refetch: QueryActionCreatorResult<_>['refetch']
}

const DashboardPostRow: React.FC<Props> = memo(
  ({ post, author, refetch, index }) => {
    return (
      <li className="post-row">
        <PostDate date={post.createdAt} />
        <PostLink post={post} index={index} />
        <EditButtonGroup
          post={post}
          author={author}
          refetch={refetch}
          index={index}
        />
      </li>
    )
  }
)
DashboardPostRow.displayName = 'DashboardPostRow'

export default DashboardPostRow
