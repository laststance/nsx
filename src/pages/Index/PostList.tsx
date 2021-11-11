import { Link } from '@reach/router'
import React, { memo } from 'react'

import PostDate from '../../elements/PostDate'
import { getTotalPage } from '../../lib/getTotalPage'
import Pagenation from '../../pagination/Pagenation'
import type { usePagenationResult } from '../../pagination/usePagination'

interface Props {
  postList: Posts
  total: number
  page: usePagenationResult['page']
  per_page: usePagenationResult['per_page']
  dispatch: usePagenationResult['dispatch']
  prevPage: usePagenationResult['prevPage']
  nextPage: usePagenationResult['nextPage']
}

const PostList: React.FC<Props> = memo(
  ({ postList, total, page, per_page, dispatch, prevPage, nextPage }) => {
    const total_page = getTotalPage(total, per_page)
    return (
      <div className="flex flex-col justify-between h-full">
        <ul className="flex flex-col justify-start space-y-4">
          {postList?.map((post: Post, i: number) => {
            return (
              <li key={i} className="flex sm:flex-nowrap sm:space-x-2.5">
                <PostDate date={post.createdAt} />
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
          dispatch={dispatch}
          prevPage={prevPage}
          nextPage={nextPage}
        />
      </div>
    )
  }
)
PostList.displayName = 'PostList'

export default PostList
