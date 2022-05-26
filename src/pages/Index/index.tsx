import React, { memo } from 'react'

import Layout from '../../components/Layout'

import DashButtonGroup from './DashButtonGroup'
import PostList from './PostList'

const Index: React.FC = memo(() => {
  return (
    <>
      <PostList />
      <DashButtonGroup />
    </>
  )
})
Index.displayName = 'Index'

const IndexPage = memo(
  () => (
    <Layout
      className="flex flex-col justify-between"
      data-cy="top-page-content-root"
    >
      <Index />
    </Layout>
  ),
  () => true
)
IndexPage.displayName = 'IndexPage'

export default IndexPage
