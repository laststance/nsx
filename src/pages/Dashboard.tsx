import React from 'react'
import type { RouteComponentProps } from '@reach/router'
import { Link } from '@reach/router'
import { useAppDispatch } from '../redux/hooks'
import { useDeletePostMutation, useFetchAllPostsQuery } from '../redux/api'
import Layout from '../components/Layout'
import Button from '../elements/Button'
import type { Post } from '../../types'
import DateDisplay from '../elements/DateDisplay'
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
    } catch (error) {
      if (error.code === 500)
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
    <Layout className="flex flex-col justify-start">
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
                  <Button className="text-gray-500">Edit</Button>
                </Link>
                <Button
                  onClick={() => handleDelete(post.id)}
                  className="bg-red-400 text-white"
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
          <button className="shadow bg-green-400 hover:bg-green-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">
            Create
          </button>
        </Link>
      </div>
    </Layout>
  )
}

export default React.memo(Dashboard)
