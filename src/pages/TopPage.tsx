import React from 'react'
import { RouteComponentProps } from '@reach/router'
import { Link } from '@reach/router'
import Layout from '../components/Layout'
import Button from '../components/Button'
import { Post } from '../../DataStructure'
import usePostList from '../hooks/usePostList'
import { ReduxState } from '../redux'
import { useSelector } from 'react-redux'

const TopPage: React.FC<RouteComponentProps> = () => {
  const { posts, axiosError } = usePostList()
  const login: ReduxState['login'] = useSelector<
    ReduxState,
    ReduxState['login']
  >((state) => state.login)

  return (
    <Layout className="flex flex-col justify-between">
      <ul className="flex flex-col justify-start">
        {posts.map((post: Post, i) => {
          return (
            <Link key={i} to={`post/${post.id}`}>
              <li className="flex space-x-2.5">
                <div className="text-lg text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </div>
                <div className="text-lg">{post.title}</div>
              </li>
            </Link>
          )
        })}
      </ul>
      {axiosError && (
        <div>
          {/*// @ts-ignore */}
          <p>{axiosError.toJSON().message}</p>
        </div>
      )}
      <div className="flex items-center justify-around">
        {process.env.REACT_APP_ENABLE_LOGIN && (
          <Link to="/login">
            <Button className="bg-blue-500 active:bg-blue-600 text-white">
              Login
            </Button>
          </Link>
        )}
        {process.env.REACT_APP_ENABLE_SIGNUP && (
          <Link to="/signup">
            <Button className="bg-yellow-500 active:bg-yellow-600 text-white">
              Sigunup
            </Button>
          </Link>
        )}
        {login && (
          <Link to="/dashboard">
            <Button className="bg-yellow-500 active:bg-yellow-600 text-white">
              Dashboard
            </Button>
          </Link>
        )}
      </div>
    </Layout>
  )
}

export default React.memo(TopPage)
