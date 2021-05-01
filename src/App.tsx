import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { RouteComponentProps } from '@reach/router'
import { Link } from '@reach/router'
import './App.css'
import Layout from './Layout'
import { Header } from './Header'
import { Post, Posts } from '../DataStructure'

const App: React.FC<RouteComponentProps> = () => {
  const [posts, setPosts] = useState<Posts>([])

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data } = await axios.get<Posts>(
          `${process.env.REACT_APP_API_ENDPOINT}/posts`
        )
        setPosts(data)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
      }
    }
    fetchPosts()
  }, [])

  return (
    <Layout>
      <Header />
      <main className="container mx-auto flex-grow py-3">
        <ul className="flex flex-col justify-start">
          {posts.map((post: Post, i) => {
            return (
              <Link key={i} to={`/${post.id}`}>
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
      </main>
      <footer></footer>
    </Layout>
  )
}

export default App
