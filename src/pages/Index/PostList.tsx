import { Link } from '@reach/router'
import React, { memo } from 'react'

import PagenationPanel from '../../components/pagination/PagenationPanel'
import usePagination from '../../components/pagination/usePagination'
import Loading from '../../elements/Loading'
import PostDate from '../../elements/PostDate'
import RTKQueryErrorMessages from '../../elements/RTKQueryErrorMessages'

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
    <div className="flex flex-col justify-between h-full">
      <ul className="flex flex-col justify-start space-y-4">
        {data.postList?.map((post: Post, i: number) => {
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
      <PagenationPanel
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
