import React, { memo } from 'react'

import EditButtonGroup from './EditButtonGroup'
import PostDate from './PostDate/PostDate'
import PostLink from './PostLink'

interface Props {
  post: Post
  index: number
  author: Author
  refetch: () => void
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
DashboardPostRow.displayName = 'DashboardPostRowPostRow'

export default DashboardPostRow
