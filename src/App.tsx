import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import { Header } from './Header'
import { Post, Posts } from '../DataStructure'

const App: React.FC = () => {
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
  })
  return (
    <div className="flex flex-col justify-between w-screen h-screen">
      <Header />
      <main className="flex-grow px-4 py-4">
        <ul className="flex flex-col justify-start">
          {posts.map((post: Post, i) => {
            return (
              <>
                <li key={i}>
                  <span className="text-base text-gray-500">
                    {new Date(parseInt(post.createdAt)).toLocaleDateString()}
                  </span>
                  <span className="space-x-8 text-lg">{post.title}</span>
                </li>
              </>
            )
          })}
        </ul>
      </main>
      <footer></footer>
    </div>
  )
}

export default App
