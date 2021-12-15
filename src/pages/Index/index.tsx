import type { RouteComponentProps } from '@reach/router'
import React, { memo } from 'react'

import BaseLayout from '../../components/Layout'
import { selectLogin } from '../../redux/adminSlice'
import { useAppSelector } from '../../redux/hooks'

import AdminControlPanel from './AdminControlPanel'
import PostList from './PostList'

const Layout: React.FC = memo(({ children }) => (
  <BaseLayout
    className="flex flex-col justify-between"
    data-cy="top-page-content-root"
  >
    {children}
  </BaseLayout>
))
Layout.displayName = 'Layout'

const Index: React.FC<RouteComponentProps> = memo(() => {
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
