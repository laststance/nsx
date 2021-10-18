import { Link } from '@reach/router'
import React, { memo } from 'react'

import DateDisplay from '../../elements/DateDisplay'

interface Props {
  postList: Posts
  total: number
  page: number
  prevPage: AnyFunction
  nextPage: AnyFunction
}

const PostList: React.FC<Props> = memo(
  ({ postList, total, page, prevPage, nextPage }) => {
    return (
      <>
        <ul className="flex flex-col justify-start">
          {postList?.map((post: Post, i: number) => {
            return (
              <li
                key={i}
                className="flex sm:flex-nowrap sm:space-x-2.5 space-y-1"
              >
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
        <div className="flex justify-center space-x-2">
          <button onClick={() => prevPage(page)}>Prev</button>
          <button onClick={() => nextPage(page)}>Next</button>
          <div>
            page: {page}/{Math.ceil(total / page)}
          </div>
        </div>
      </>
    )
  }
)
PostList.displayName = 'PostList'

export default PostList
