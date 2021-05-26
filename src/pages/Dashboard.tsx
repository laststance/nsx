import React from 'react'
import { Link, RouteComponentProps } from '@reach/router'
import Layout from '../components/Layout'
import { Post } from '../../DataStructure'
import usePostList from '../hooks/usePostList'

const Dashboard: React.FC<RouteComponentProps> = () => {
  const { posts, axiosError } = usePostList()

  return (
    <Layout className="flex flex-col justify-start">
      <h1 className="text-3xl mb-3">Dashbord</h1>
      <ul className="flex flex-col justify-start">
        {posts.map((post: Post, i) => {
          return (
            <Link key={i} to={`/post/${post.id}`}>
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
      <div className="flex gap-4 justify-end">
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
