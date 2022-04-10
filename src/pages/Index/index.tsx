import React, { memo } from 'react'

import BaseLayout from '../../components/Layout'
import { selectLogin } from '../../redux/adminSlice'
import { useAppSelector } from '../../redux/hooks'

import AdminControlPanel from './AdminControlPanel'
import PostList from './PostList'

const Layout: React.FC<React.PropsWithChildren<unknown>> = memo(
  ({ children }) => (
    <BaseLayout
      className="flex flex-col justify-between"
      data-cy="top-page-content-root"
    >
      {children}
    </BaseLayout>
  )
)
Layout.displayName = 'Layout'

const Index: React.FC<React.PropsWithChildren<unknown>> = memo(() => {
  const login = useAppSelector(selectLogin)

  return (
    <Layout>
      <PostList />
      <AdminControlPanel login={login} />
    </Layout>
  )
})
Index.displayName = 'Index'

export default Index
