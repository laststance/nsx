import { Link } from '@reach/router'
import React from 'react'

import type { Post, Posts } from '../../../types'
import DateDisplay from '../../elements/DateDisplay'

interface Props {
  posts: Posts
}

const PostList: React.FC<Props> = ({ posts }) => {
  return (
    <ul className="flex flex-col justify-start">
      {posts.map((post: Post, i: number) => {
        return (
          <li key={i} className="flex sm:flex-nowrap sm:space-x-2.5">
            <DateDisplay date={post.createdAt} />
            <div
              className="text-lg break-all w-64 sm:w-auto flex-initial"
              data-cy={`postTitle-${i}`}
            >
              <Link className="hover:text-gray-400" to={`post/${post.id}`}>
                {post.title}
              </Link>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default PostList
