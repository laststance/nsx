import React from 'react'
import { RouteComponentProps, Link } from '@reach/router'
import Layout from '../components/Layout'
import Button from '../elements/Button'
import { Post } from '../../DataStructure'
import DateDisplay from '../elements/DateDisplay'
import { useAppSelector } from '../redux/hooks'
import { selectLogin } from '../redux/adminSlice'
import { RestApi } from '../redux/restApi'

const Index: React.FC<RouteComponentProps> = () => {
  const login = useAppSelector(selectLogin)
  const { data, error } = RestApi.endpoints.fetchAllPosts.useQuery()

  return (
    <Layout className="flex flex-col justify-between" data-cy="topPage">
      <ul className="flex flex-col justify-start">
        {data?.map((post: Post, i) => {
          return (
            <li key={i} className="flex sm:flex-nowrap sm:space-x-2.5">
              <DateDisplay date={post.createdAt} />
              <div
                className="text-lg break-all w-64 sm:w-auto flex-initial"
                data-cy={`postTitle-${i}`}
              >
                <Link className="hover:text-gray-400" to={`post/${post.id}`}>
                  {post.title}
                </Link>
              </div>
            </li>
          )
        })}
      </ul>
      {error && (
        <div>
          {/* @ts-ignore */}
          <p>Error: {error.message}</p>
        </div>
      )}
      <div className="flex items-center justify-around">
        {process.env.REACT_APP_ENABLE_LOGIN && (
          <Link to="/login">
            <Button
              className="bg-blue-500 active:bg-blue-600 text-white"
              data-cy="login-btn"
            >
              Login
            </Button>
          </Link>
        )}
        {process.env.REACT_APP_ENABLE_SIGNUP && (
          <Link to="/signup">
            <Button
              className="bg-green-500 active:bg-green-600 text-white"
              data-cy="signup-btn"
            >
              Sigunup
            </Button>
          </Link>
        )}
        {login && (
          <Link to="/dashboard">
            <Button
              className="bg-yellow-500 active:bg-yellow-600 text-white"
              data-cy="dashboard-btn"
            >
              Dashboard
            </Button>
          </Link>
        )}
      </div>
    </Layout>
  )
}

export default React.memo(Index)
