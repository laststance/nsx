import { Link } from '@reach/router'
import React, { memo } from 'react'

import DateDisplay from '../../elements/DateDisplay'
import { getTotalPage } from '../../lib/getTotalPage'
import Pagenation from '../../pagination/Pagenation'

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
    const total_page = getTotalPage(total, per_page)
    return (
      <div className="flex flex-col justify-between h-full">
        <ul className="flex flex-col justify-start space-y-4">
          {postList?.map((post: Post, i: number) => {
            return (
              <li key={i} className="flex sm:flex-nowrap sm:space-x-2.5">
                <DateDisplay date={post.createdAt} />
                <div className="sm:w-auto flex-initial w-64 text-lg break-all">
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
        <Pagenation
          page={page}
          total_page={total_page}
          prevPage={prevPage}
          nextPage={nextPage}
        />
      </div>
    )
  }
)
PostList.displayName = 'PostList'

export default PostList
