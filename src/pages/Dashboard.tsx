import type { RouteComponentProps } from '@reach/router'
import { Link } from '@reach/router'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import React, { memo } from 'react'

import Layout from '../components/Layout'
import Pagenation from '../components/Pagenation'
import Button from '../elements/Button'
import DateDisplay from '../elements/DateDisplay'
import Loading from '../elements/Loading'
import { getTotalPage } from '../lib/getTotalPage'
import { useDeletePostMutation, API } from '../redux/API'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { selectPage, updatePage } from '../redux/pageSlice'
import { enqueSnackbar } from '../redux/snackbarSlice'

const Dashboard: React.FC<RouteComponentProps> = memo(() => {
  const { page, per_page } = useAppSelector(selectPage)
  const dispatch = useAppDispatch()
  // for display network error message
  const { data, error, refetch, isLoading } =
    API.endpoints.fetchPostList.useQuery({
      page,
      per_page,
    })
  const [deletePost] = useDeletePostMutation()
  const prevPage = (page: number) => {
    dispatch(updatePage({ page: page - 1 }))
  }
  const nextPage = (page: number) => {
    dispatch(updatePage({ page: page + 1 }))
  }

  async function handleDelete(id: Post['id']) {
    try {
      const res = await deletePost(id).unwrap()

      dispatch(enqueSnackbar({ message: res.message, color: 'green' }))
      refetch()
      // @ts-ignore disabled TS1196: Catch clause variable type annotation must be 'any' or 'unknown' if specified.
    } catch (error: FetchBaseQueryError) {
      if (error.status === 500)
        dispatch(
          enqueSnackbar({
            message: `Delete Faild: ${error.message}`,
            color: 'red',
          })
        )
      else
        dispatch(
          enqueSnackbar({
            message: `${error.status} System Error. Delete Faild: ${error.message}`,
            color: 'red',
          })
        )
    }
  }

  if (error) {
    return (
      <div>
        {/* @ts-ignore */}
        {/* @ts-ignore */}${error?.status}: ${error?.message}
      </div>
    )
  }

  if (isLoading || data === undefined) {
    return <Loading />
  }
  const { postList, total } = data
  const total_page = getTotalPage(total, per_page)

  return (
    <Layout
      className="flex flex-col justify-start"
      data-cy="dashboard-page-content-root"
    >
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
                  <DateDisplay date={post.createdAt} />
                  <div className="text-base">{post.title}</div>
                </Link>
                <div className="flex items-center space-x-2">
                  <Link to={`/dashboard/edit/${post.id}`}>
                    <Button variant="inverse">Edit</Button>
                  </Link>
                  <Button
                    onClick={() => handleDelete(post.id)}
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
        <Pagenation
          page={page}
          total_page={total_page}
          prevPage={prevPage}
          nextPage={nextPage}
        />
      </div>
    </Layout>
  )
})

export default Dashboard
