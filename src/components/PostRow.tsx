import React, { memo } from 'react'
import { Link } from 'react-router-dom'

import PostDate from './PostDate/PostDate'

interface Props {
  post: Post
  index: number
}

const PostRow: React.FC<Props> = memo(({ post, index }) => {
  return (
    <li className="flex sm:flex-nowrap sm:space-x-2.5">
      <PostDate date={post.createdAt} />
      <div className="w-64 flex-initial break-all text-lg sm:w-auto">
        <Link
          className="text-color-primary hover:text-gray-400"
          to={`post/${post.id}`}
          data-cy={`single-post-page-link-${index + 1}`}
        >
          {post.title}
        </Link>
      </div>
    </li>
  )
})
PostRow.displayName = 'PostRow'

export default PostRow
