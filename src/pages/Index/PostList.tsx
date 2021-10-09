import { Link } from '@reach/router'
import React, { memo } from 'react'

import DateDisplay from '../../elements/DateDisplay'

interface Props {
  posts: Posts
}

const PostList: React.FC<Props> = memo(({ posts }) => {
  return (
    <ul className="flex flex-col justify-start">
      {posts?.map((post: Post, i: number) => {
        return (
          <li key={i} className="flex sm:flex-nowrap sm:space-x-2.5">
            <DateDisplay date={post.createdAt} />
            <div className="text-lg break-all w-64 sm:w-auto flex-initial">
              <Link
                className="hover:text-gray-400"
                to={`post/${post.id}`}
                data-cy={`single-post-page-link-${i + 1}`}
              >
                {post.title}
              </Link>
            </div>
          </li>
        )
      })}
    </ul>
  )
})

export default PostList
