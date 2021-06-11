import { useEffect, useState } from 'react'
import { Posts } from '../../DataStructure'
import axios, { AxiosError } from 'axios'

interface ReturnType {
  posts: Posts
  axiosError?: AxiosError
}

const usePostList = (): ReturnType => {
  const [posts, setPosts] = useState<Posts>([])
  // for display network error message
  const [axiosError, setAxiosError] = useState<AxiosError>()

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
        setAxiosError(error)
      }
    }
    fetchPosts()
  }, [])

  return { posts, axiosError }
}

export default usePostList
