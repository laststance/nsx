import React from 'react'
import { RouteComponentProps } from '@reach/router'
import { Link } from '@reach/router'
import Layout from '../components/Layout'
import { Post } from '../../DataStructure'
import usePostList from '../hooks/usePostList'

const TopPage: React.FC<RouteComponentProps> = () => {
  const { posts, axiosError } = usePostList()

  return (
    <Layout>
      <ul className="flex flex-col justify-start">
        {posts.map((post: Post, i) => {
          return (
            <Link key={i} to={`post/${post.id}`}>
              <li className="flex space-x-2.5">
                <div className="text-base text-gray-500">
                  {new Date(parseInt(post.createdAt)).toLocaleDateString()}
                </div>
                <div className="text-base">{post.title}</div>
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
    </Layout>
  )
}

export default React.memo(TopPage)
