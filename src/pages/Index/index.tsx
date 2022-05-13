import React, { memo } from 'react'

import Layout from '../../components/Layout'
import { selectLogin } from '../../redux/adminSlice'
import { useAppSelector } from '../../redux/hooks'

import AdminControlPanel from './AdminControlPanel'
import PostList from './PostList'

const Index: React.FC = memo(() => {
  const login = useAppSelector(selectLogin)

  return (
    <>
      <PostList />
      <AdminControlPanel login={login} />
    </>
  )
})
Index.displayName = 'Index'

const IndexPage = memo(() => (
  <Layout
    className="flex flex-col justify-between"
    data-cy="top-page-content-root"
  >
    <Index />
  </Layout>
))
IndexPage.displayName = 'IndexPage'

export default IndexPage
