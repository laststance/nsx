import React, { useEffect, useState } from 'react'
import { RouteComponentProps } from '@reach/router'
import ReactMarkdown from 'react-markdown'
import { Post } from '../../DataStructure'
import Layout from '../components/Layout'
import axios from 'axios'

interface RouterParam {
  postId: Post['id']
}

const PostPage: React.FC<RouteComponentProps<RouterParam>> = ({ postId }) => {
  const [post, setPost] = useState<Post | null>(null)

  useEffect(() => {
    async function fetchPost() {
      try {
        const { data } = await axios.get<Post>(
          `${process.env.REACT_APP_API_ENDPOINT}/post/${postId}`
        )
        setPost(data)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
      }
    }
    fetchPost()
  }, [postId])

  return (
    <Layout>
      {post && (
        <>
          <h1 className="text-3xl mb-2">{post.title}</h1>
          <ReactMarkdown>{post.body}</ReactMarkdown>
        </>
      )}
    </Layout>
  )
}

export default React.memo(PostPage)
