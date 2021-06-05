import React from 'react'
import { Link, RouteComponentProps } from '@reach/router'
import gfm from 'remark-gfm'
import ReactMarkdown from 'react-markdown'
import { useSelector } from 'react-redux'
import { Post } from '../../DataStructure'
import Layout from '../components/Layout'
import Button from '../components/Button'
import useSinglePost from '../hooks/useSinglePost'
import { ReduxState } from '../redux'
import { A } from '../components/markdown'

interface RouterParam {
  postId: Post['id']
}

const PostPage: React.FC<RouteComponentProps<RouterParam>> = ({ postId }) => {
  // @ts-ignore
  const post = useSinglePost(postId)
  const login = useSelector<ReduxState>((state) => state.login)

  return (
    <Layout>
      {post && (
        <>
          <h1 className="text-3xl pt-2 pb-4">{post.title}</h1>
          <ReactMarkdown
            components={{ a: A }}
            remarkPlugins={[gfm]}
            className="text-xl"
          >
            {post.body}
          </ReactMarkdown>
        </>
      )}
      {login && (
        <div className="mt-4">
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
