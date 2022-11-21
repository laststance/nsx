import React, { memo } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  post: Post
  index: number
}

const PostLink: React.FC<Props> = memo(({ post, index }) => {
  return (
    <div className="break-word w-64 max-w-[600px] flex-initial flex-shrink-0 text-lg sm:w-auto">
      <Link
        className="text-color-primary hover:text-gray-400"
        to={`/post/${post.id}`}
        data-cy={`single-post-page-link-${index + 1}`}
      >
        {post.title}
      </Link>
    </div>
  )
})
PostLink.displayName = 'PostLink'

export default PostLink
