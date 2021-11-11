import type { RouteComponentProps } from '@reach/router'
import React, { memo } from 'react'

import BaseLayout from '../../components/Layout'
import Loading from '../../elements/Loading'
import RTKQueryErrorMessages from '../../elements/RTKQueryErrorMessages'
import usePagination from '../../pagination/usePagination'
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
  const {
    page,
    per_page,
    data,
    isLoading,
    error,
    dispatch,
    nextPage,
    prevPage,
  } = usePagination()

  if (error) {
    return (
      <Layout>
        <RTKQueryErrorMessages error={error} />
      </Layout>
    )
  }

  if (isLoading || data === undefined) {
    return (
      <Layout>
        <Loading />
      </Layout>
    )
  }

  return (
    <Layout>
      <PostList
        postList={data.postList}
        total={data.total}
        page={page}
        dispatch={dispatch}
        per_page={per_page}
        prevPage={prevPage}
        nextPage={nextPage}
      />
      <AdminControlPanel login={login} />
    </Layout>
  )
})
Index.displayName = 'Index'

export default Index
