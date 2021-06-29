import React from 'react'
import { RouteComponentProps } from '@reach/router'
import { Link } from '@reach/router'
import Container from '../components/Container'
import Button from '../elements/Button'
import { Post } from '../../DataStructure'
import usePostList from '../hooks/usePostList'
import { ReduxState } from '../redux'
import { useSelector } from 'react-redux'
import DateDisplay from '../components/DateDisplay'

const Index: React.FC<RouteComponentProps> = () => {
  const { posts, axiosError } = usePostList()
  const login: ReduxState['login'] = useSelector<
    ReduxState,
    ReduxState['login']
  >((state) => state.login)

  return (
    <Container className="flex flex-col justify-between" data-cy="topPage">
      <ul className="flex flex-col justify-start">
        {posts.map((post: Post, i) => {
          return (
            <Link key={i} to={`post/${post.id}`}>
              <li className="flex space-x-2.5">
                <DateDisplay date={post.createdAt} />
                <div className="text-lg" data-cy={`postTitle-${i}`}>
                  {post.title}
                </div>
              </li>
            </Link>
          )
        })}
      </ul>
      {axiosError && (
        <div>
          <p>{(axiosError.toJSON() as { message: string }).message}</p>
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
            <Button className="bg-green-500 active:bg-green-600 text-white">
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
    </Container>
  )
}

export default React.memo(Index)
