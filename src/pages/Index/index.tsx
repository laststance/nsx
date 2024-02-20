import React, { memo } from 'react'

import Layout from '@/src/components/Layout'

import PostList from './PostList'

const IndexPage = memo(
  () => (
    <Layout className="flex flex-col justify-between">
      <PostList />
    </Layout>
  ),
  () => true,
)
IndexPage.displayName = 'IndexPage'

export default IndexPage
