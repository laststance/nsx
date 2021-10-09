import type { RouteComponentProps } from '@reach/router'
import { Link } from '@reach/router'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import React, { memo } from 'react'

import Layout from '../components/Layout'
import Button from '../elements/Button'
import DateDisplay from '../elements/DateDisplay'
import { useDeletePostMutation, useFetchAllPostsQuery } from '../redux/API'
import { useAppDispatch } from '../redux/hooks'
import { enqueSnackbar } from '../redux/snackbarSlice'

const Dashboard: React.FC<RouteComponentProps> = memo(() => {
  const dispatch = useAppDispatch()
  // for display network error message
  const { data, error, refetch } = useFetchAllPostsQuery()
  const [deletePost] = useDeletePostMutation()

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

  return (
    <Layout
      className="flex flex-col justify-start"
      data-cy="dashboard-page-content-root"
    >
      <h1 className="text-3xl font-semibold mb-3">Dashboard</h1>
      <ul className="flex flex-col justify-start">
        {data?.map((post: Post, i: number) => {
          return (
            <li key={i} className="flex justify-between items-center space-y-2">
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
      <div className="flex gap-4 justify-end mt-8">
        <Link to="create">
          <Button data-cy="create-btn" variant="primary">
            Create
          </Button>
        </Link>
      </div>
    </Layout>
  )
})

export default Dashboard
