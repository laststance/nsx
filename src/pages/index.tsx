import type { RouteComponentProps } from '@reach/router'
import { Link } from '@reach/router'
import React from 'react'

import type { Post } from '../../types'
import Layout from '../Components/Layout'
import Button from '../Elements/Button'
import DateDisplay from '../Elements/DateDisplay'
import Loading from '../Elements/Loading'
import { selectLogin } from '../redux/adminSlice'
import { Api } from '../redux/api'
import { useAppSelector } from '../redux/hooks'

const Index: React.FC<RouteComponentProps> = () => {
  const login = useAppSelector(selectLogin)
  const { data, error, isLoading } = Api.endpoints.fetchAllPosts.useQuery()

  return (
    <Layout className="flex flex-col justify-between" data-cy="topPage">
      {isLoading ? (
        <Loading />
      ) : (
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
      )}
      {error && (
        <div>
          {/* @ts-ignore */}
          <p>Error: {error.message}</p>
        </div>
      )}
      <div className="flex items-center justify-around">
        {process.env.REACT_APP_ENABLE_LOGIN && (
          <Link to="/login">
            <Button variant="primary" data-cy="login-btn">
              Login
            </Button>
          </Link>
        )}
        {process.env.REACT_APP_ENABLE_SIGNUP && (
          <Link to="/signup">
            <Button variant="primary" data-cy="signup-btn">
              Sigunup
            </Button>
          </Link>
        )}
        {login && (
          <Link to="/dashboard">
            <Button variant="primary" data-cy="dashboard-btn">
              Dashboard
            </Button>
          </Link>
        )}
      </div>
    </Layout>
  )
}

export default React.memo(Index)
