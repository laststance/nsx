import React, { memo } from 'react'

import PostDate from '../../../../components/PostDate/PostDate'

import PostLink from './PostLink/index'

interface Props {
  post: Post
  index: number
}

const PostRow: React.FC<Props> = memo(({ post, index }) => {
  return (
    <li className="post-row">
      <PostDate date={post.createdAt} />
      <PostLink post={post} index={index} />
    </li>
  )
})
PostRow.displayName = 'PostRow'

export default PostRow
