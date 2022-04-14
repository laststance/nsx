import React, { memo } from 'react'
import { Link } from 'react-router-dom'

import Loading from '../../components/Loading'
import ButtonGroup from '../../components/Pagination/ButtonGroup'
import usePagination from '../../components/Pagination/usePagination'
import PostDate from '../../components/PostDate'
import RTKQueryErrorMessages from '../../components/RTKQueryErrorMessages'

const PostList: React.FC = memo(() => {
  const { page, totalPage, data, isLoading, error, dispatch, nextPage, prevPage } /* eslint-disable-line prettier/prettier */
    = usePagination()

  if (error) {
    return <RTKQueryErrorMessages error={error} />
  }

  if (isLoading || data === undefined) {
    return <Loading />
  }

  if (data.postList.length === 0) {
    return <div>There is no post.</div>
  }

  return (
    <div className="flex h-full flex-col justify-between">
      <ul className="flex flex-col justify-start space-y-4">
        {data.postList?.map((post: Post, i: number) => {
          return (
            <li key={i} className="flex sm:flex-nowrap sm:space-x-2.5">
              <PostDate date={post.createdAt} />
              <div className="w-64 flex-initial break-all text-lg sm:w-auto">
                <Link
                  className="text-primary hover:text-gray-400"
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
      <ButtonGroup
        page={page}
        totalPage={totalPage}
        dispatch={dispatch}
        prevPage={prevPage}
        nextPage={nextPage}
      />
    </div>
  )
})
PostList.displayName = 'PostList'

export default PostList
