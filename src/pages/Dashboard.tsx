import React, { useEffect, useState } from 'react'
import { Link, RouteComponentProps } from '@reach/router'
import Layout from '../components/PageContainer'
import Button from '../elements/Button'
import { Post, Posts } from '../../DataStructure'
import axios, { AxiosError } from 'axios'
import { Dispatch } from 'redux'
import { useDispatch } from 'react-redux'
import { EnqueueSnackbarAction } from '../redux'

const Dashboard: React.FC<RouteComponentProps> = () => {
  const dispatch: Dispatch<EnqueueSnackbarAction> = useDispatch()
  const [posts, setPosts] = useState<Posts>([])
  // for display network error message
  const [axiosError, setAxiosError] = useState<AxiosError>()

  async function fetchPosts() {
    try {
      const { data } = await axios.get<Posts>(
        `${process.env.REACT_APP_API_ENDPOINT}/posts`
      )
      setPosts(data)
      // @ts-ignore
    } catch (error: AxiosError) {
      // eslint-disable-next-line no-console
      console.error(error)
      setAxiosError(error)
    }
  }

  async function handleDelete(id: Post['id']) {
    try {
      const { status } = await axios.delete(
        `${process.env.REACT_APP_API_ENDPOINT}/post/${id}`
      )

      if (status === 200) {
        dispatch({
          type: 'ENQUEUE_SNACKBAR_MESSAGE',
          payload: { message: 'Delete Successful!', color: 'green' },
        })
        fetchPosts()
      } else {
        dispatch({
          type: 'ENQUEUE_SNACKBAR_MESSAGE',
          payload: { message: 'Delete Faild', color: 'red' },
        })
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error)

      dispatch({
        type: 'ENQUEUE_SNACKBAR_MESSAGE',
        payload: { message: 'Delete Faild', color: 'red' },
      })
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  return (
    <Layout className="flex flex-col justify-start">
      <h1 className="text-3xl mb-3">Dashbord</h1>
      <ul className="flex flex-col justify-start">
        {posts.map((post: Post, i) => {
          return (
            <li key={i} className="flex justify-between items-center space-y-2">
              <Link
                to={`/post/${post.id}`}
                className="flex items-center space-x-2"
              >
                <div className="text-base text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    year: '2-digit',
                    month: '2-digit',
                    day: '2-digit',
                  })}
                </div>
                <div className="text-base">{post.title}</div>
              </Link>
              <div className="flex items-center space-x-2">
                <Link to={`edit/${post.id}`}>
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
      {axiosError && (
        <div>
          {/*// @ts-ignore */}
          <p>{axiosError.toJSON().message}</p>
        </div>
      )}
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
