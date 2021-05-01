import React from 'react'
import { RouteComponentProps } from '@reach/router'
import { Post } from '../DataStructure'
import Layout from './Layout'
import Header from './Header'

interface RouterParam {
  postId: Post['id']
}

const PostPage: React.FC<RouteComponentProps<RouterParam>> = ({ postId }) => {
  return (
    <Layout>
      <Header />
      <main className="container mx-auto flex-grow py-3">
        post id: {postId}
      </main>
    </Layout>
  )
}

export default PostPage
