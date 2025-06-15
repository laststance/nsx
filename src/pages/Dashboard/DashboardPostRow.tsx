import React, { memo } from 'react'

import type { UsePagenationResult } from '@/src/components/Pagination/usePagination'
import PostDate from '@/src/components/PostDate/PostDate'

import PostLink from '../Index/PostList/PostRow/PostLink'

import EditButtonGroup from './EditButtonGroup'

interface Props {
  author: User
  index: ArrayMapIndex
  post: Post
  refetch: UsePagenationResult['refetch']
}

const DashboardPostRow: React.FC<Props> = memo(
  ({ author, index, post, refetch }) => {
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
  },
)
DashboardPostRow.displayName = 'DashboardPostRow'

export default DashboardPostRow
