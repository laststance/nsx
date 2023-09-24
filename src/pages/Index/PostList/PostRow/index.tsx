import React, { memo } from 'react'

import PostDate from '../../../../components/PostDate/PostDate'

import PostLink from './PostLink'

interface Props {
  index: number
  post: Post
}

const PostRow: React.FC<Props> = memo(({ index, post }) => {
  return (
    <li className="post-row">
      <PostDate date={post.createdAt} />
      <PostLink post={post} index={index} />
    </li>
  )
})
PostRow.displayName = 'PostRow'

export default PostRow
