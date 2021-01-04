import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import { Header } from './Header'

const App: React.FC = () => {
  const [posts, setPosts] = useState()

  useEffect(() => {
    async function fetchPosts() {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_ENDPOINT}/posts`
        )
        // @ts-ignore
        setPosts(data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchPosts()
  })

  console.log(posts)

  return (
    <div className="flex flex-col justify-between w-screen h-screen">
      <Header />
      <main></main>
      <footer></footer>
    </div>
  )
}

export default App
