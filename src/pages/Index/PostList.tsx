import { Link } from '@reach/router'
import React, { memo } from 'react'

import DateDisplay from '../../elements/DateDisplay'
import ArrowLeft from '../../elements/icons/ArrowLeft'
import ArrowRight from '../../elements/icons/ArrowRight'

interface Props {
  postList: Posts
  total: number
  page: number
  per_page: number
  prevPage: AnyFunction
  nextPage: AnyFunction
}

const PostList: React.FC<Props> = memo(
  ({ postList, total, page, per_page, prevPage, nextPage }) => {
    const total_page = Math.ceil(total / per_page)
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
        <div className="flex justify-center space-x-3">
          <button
            onClick={() => prevPage(page)}
            disabled={page <= 1 ? true : false}
          >
            <ArrowLeft />
          </button>
          <div>
            {page}/{Math.ceil(total / per_page)}
          </div>
          <button
            onClick={() => nextPage(page)}
            disabled={page === total_page ? true : false}
          >
            <ArrowRight />
          </button>
        </div>
      </>
    )
  }
)
PostList.displayName = 'PostList'

export default PostList
