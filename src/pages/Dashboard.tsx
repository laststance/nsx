import type { RouteComponentProps } from '@reach/router'
import { Link } from '@reach/router'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import React from 'react'

import type { Post } from '../../types'
import Layout from '../components/Layout'
import Button from '../elements/Button'
import DateDisplay from '../elements/DateDisplay'
import { useDeletePostMutation, useFetchAllPostsQuery } from '../redux/API'
import { useAppDispatch } from '../redux/hooks'
import { enque } from '../redux/snackbarSlice'

const Dashboard: React.FC<RouteComponentProps> = () => {
  const dispatch = useAppDispatch()
  // for display network error message
  const { data, error, refetch } = useFetchAllPostsQuery()
  const [deletePost] = useDeletePostMutation()

  async function handleDelete(id: Post['id']) {
    try {
      await deletePost(id).unwrap()

      dispatch(enque({ message: 'Delete Successful!', color: 'green' }))
      // @TODO optimistic update
      refetch()
      // @ts-ignore disabled TS1196: Catch clause variable type annotation must be 'any' or 'unknown' if specified.
    } catch (error: FetchBaseQueryError) {
      if (error.status === 500)
        dispatch(
          enque({
            message: 'Delete Faild',
            color: 'red',
          })
        )
      else
        dispatch(
          enque({
            message: `System Error. Delete Faild: ${error.message}`,
            color: 'red',
          })
        )
    }
  }

  if (error) return <div>error</div>

  return (
    <Layout className="flex flex-col justify-start" data-cy="dashbordPage">
      <h1 className="text-3xl font-semibold mb-3">Dashbord</h1>
      <ul className="flex flex-col justify-start">
        {data?.map((post: Post, i) => {
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
                <Button onClick={() => handleDelete(post.id)} variant="danger">
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
}

export default React.memo(Dashboard)
