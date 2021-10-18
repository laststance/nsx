import { Link } from '@reach/router'
import React, { memo } from 'react'

import DateDisplay from '../../elements/DateDisplay'
import ArrowLeft from '../../elements/icons/ArrowLeft'
import ArrowRight from '../../elements/icons/ArrowRight'

import PageNumber from './PageNumber'

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
      <div className="flex flex-col justify-between">
        <ul className="flex flex-col justify-start space-y-4">
          {postList?.map((post: Post, i: number) => {
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
        <div className="flex justify-center items-center space-x-4 p-10">
          <button
            onClick={() => prevPage(page)}
            disabled={page <= 1 ? true : false}
            className="flex justify-center items-center w-14 h-10 border border-gray-500 rounded disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none"
          >
            <ArrowLeft />
          </button>
          <PageNumber page={page} total_page={total_page} />
          <button
            onClick={() => nextPage(page)}
            className="flex justify-center items-center w-14 h-10 border border-gray-500 rounded disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none"
            disabled={page === total_page ? true : false}
          >
            <ArrowRight />
          </button>
        </div>
      </div>
    )
  }
)
PostList.displayName = 'PostList'

export default PostList
