import React, { memo } from 'react'

import Layout from '../../components/Layout'

import AdminControlPanel from './AdminControlPanel'
import PostList from './PostList'

const Index: React.FC = memo(() => {
  return (
    <>
      <PostList />
      <AdminControlPanel />
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
