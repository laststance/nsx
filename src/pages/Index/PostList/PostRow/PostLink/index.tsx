import React, { memo } from 'react'
import { Link } from 'react-router'

interface Props {
  index: number
  post: Post
}

const PostLink: React.FC<Props> = memo(({ index, post }) => {
  return (
    <div className="break-word w-64 max-w-150 flex-initial shrink-0 text-lg sm:w-auto">
      <Link
        className="text-color-primary hover:text-gray-400"
        to={`/post/${post.id}`}
        data-testid={`single-post-page-link-${index + 1}`}
      >
        {post.title}
      </Link>
    </div>
  )
})
PostLink.displayName = 'PostLink'

export default PostLink
