import React, { memo } from 'react'
import { Link } from 'react-router-dom'

import Button from '../../components/Button'
import Loading from '../../components/Loading'
import ButtonGroup from '../../components/Pagination/ButtonGroup'
import usePagination from '../../components/Pagination/usePagination'
import PostDate from '../../components/PostDate'
import RTKQueryErrorMessages from '../../components/RTKQueryErrorMessages'
import { selectAuthor } from '../../redux/adminSlice'
import { useAppSelector } from '../../redux/hooks'

import { handleDelete } from './handler'
import Layout from './Layout'

const Dashboard: React.FC<React.PropsWithChildren<unknown>> = memo(() => {
  const { page, totalPage, data, error, isLoading, dispatch, refetch, prevPage, nextPage } /* eslint-disable-line prettier/prettier */
    = usePagination()
  const author = useAppSelector(selectAuthor)

  if (error) {
    return (
      <Layout>
        <RTKQueryErrorMessages error={error} />
      </Layout>
    )
  }

  if (isLoading || data === undefined) {
    return (
      <Layout>
        <Loading />
      </Layout>
    )
  }
  const { postList } = data

  return (
    <Layout>
      <h1 className="mb-3 text-3xl font-semibold">Dashboard</h1>
      <div className="flex flex-col justify-between h-full">
        <ul className="flex flex-col justify-start">
          {postList.map((post: Post, i: number) => {
            return (
              <li
                key={i}
                className="flex items-center justify-between space-y-2"
              >
                <Link
                  to={`/post/${post.id}`}
                  className="flex items-center space-x-2"
                >
                  <PostDate date={post.createdAt} />
                  <div className="text-base">{post.title}</div>
                </Link>
                <div className="flex items-center space-x-2">
                  <Link to={`/dashboard/edit/${post.id}`}>
                    <Button variant="inverse">Edit</Button>
                  </Link>
                  <Button
                    onClick={handleDelete(post.id, author, refetch)}
                    variant="danger"
                    data-cy={`delete-btn-${i + 1}`}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            )
          })}
        </ul>
        <div className="flex justify-end gap-4 mt-8">
          <Link to="create">
            <Button data-cy="create-btn" variant="primary">
              Create
            </Button>
          </Link>
        </div>
        <ButtonGroup
          page={page}
          totalPage={totalPage}
          dispatch={dispatch}
          prevPage={prevPage}
          nextPage={nextPage}
        />
      </div>
    </Layout>
  )
})
Dashboard.displayName = 'Dashborad'

export default Dashboard
