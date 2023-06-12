import React, { memo } from 'react'

import type { UsePagenationResult } from '../../components/Pagination/usePagination'
import PostDate from '../../components/PostDate/PostDate'
import PostLink from '../Index/PostList/PostRow/PostLink'

import EditButtonGroup from './EditButtonGroup'

interface Props {
  post: Post
  index: ArrayMapIndex
  author: Author
  refetch: UsePagenationResult['refetch']
}

const DashboardPostRow: React.FC<Props> = memo(({ post, author, refetch, index }) => {
  return (
    <li className="post-row">
      <PostDate date={post.createdAt} />
      <PostLink post={post} index={index} />
      <EditButtonGroup post={post} author={author} refetch={refetch} index={index} />
    </li>
  )
})
DashboardPostRow.displayName = 'DashboardPostRow'

export default DashboardPostRow
