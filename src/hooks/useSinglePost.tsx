import { useEffect, useState } from 'react'
import { Post } from '../../DataStructure'
import axios from 'axios'

const useSinglePost = (id: Post['id']): Post | undefined => {
  const [post, setPost] = useState<Post>()

  useEffect(() => {
    async function fetchPost() {
      try {
        const { data } = await axios.get<Post>(
          `${process.env.REACT_APP_API_ENDPOINT}/post/${id}`
        )
        setPost(data)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
      }
    }
    fetchPost()
  }, [id])

  return post
}

export default useSinglePost
