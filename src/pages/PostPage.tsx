import React from 'react'
import { RouteComponentProps } from '@reach/router'
import gfm from 'remark-gfm'
import ReactMarkdown from 'react-markdown'
import { Post } from '../../DataStructure'

import Layout from '../components/Layout'
import useSinglePost from '../hooks/useSinglePost'

interface RouterParam {
  postId: Post['id']
}

const PostPage: React.FC<RouteComponentProps<RouterParam>> = ({ postId }) => {
  // @ts-ignore
  const post = useSinglePost(postId)

  return (
    <Layout>
      {post && (
        <>
          <h1 className="text-3xl mt-2 mb-2">{post.title}</h1>
          <ReactMarkdown remarkPlugins={[gfm]} className="text-xl">
            {post.body}
          </ReactMarkdown>
        </>
      )}
    </Layout>
  )
}

export default React.memo(PostPage)
