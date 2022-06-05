import React, { memo } from 'react'

import Layout from '../../components/Layout'

import DashboardButtonGroup from './DashboardButtonGroup'
import PostList from './PostList'

const Index: React.FC = memo(() => {
  return (
    <>
      <PostList />
      <DashboardButtonGroup />
    </>
  )
})
Index.displayName = 'Index'

const IndexPage = memo(
  () => (
    <Layout className="flex flex-col justify-between">
      <Index />
    </Layout>
  ),
  () => true
)
IndexPage.displayName = 'IndexPage'

export default IndexPage
