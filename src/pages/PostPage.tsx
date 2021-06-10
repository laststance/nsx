import React, { useEffect, useState } from 'react'
import { Link, RouteComponentProps } from '@reach/router'
import breaks from 'remark-breaks'
import ReactMarkdown from 'react-markdown'
import { useSelector } from 'react-redux'
import { Post } from '../../DataStructure'
import Layout from '../components/PageContainer'
import Button from '../elements/Button'
import { ReduxState } from '../redux'
import { A, P } from '../elements/markdown'
import axios from 'axios'

interface RouterParam {
  postId: Post['id']
}

const PostPage: React.FC<RouteComponentProps<RouterParam>> = ({ postId }) => {
  const [post, setPost] = useState<Post>()

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

  const login = useSelector<ReduxState>((state) => state.login)
  return (
    <Layout>
      {post && (
        <>
          <h1 className="text-3xl pt-4 pb-6">{post.title}</h1>
          <ReactMarkdown
            components={{ a: A, p: P }}
            remarkPlugins={[breaks]}
            className="text-xl"
          >
            {post.body}
          </ReactMarkdown>
        </>
      )}
      {login && (
        <div className="mt-16">
          <Link to={`/dashboard/edit/${postId}`}>
            <Button className="bg-green-500 active:bg-green-600 text-white">
              Edit
            </Button>
          </Link>
        </div>
      )}
    </Layout>
  )
}

export default React.memo(PostPage)
