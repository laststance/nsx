import type { RouteComponentProps } from '@reach/router'
import React, { memo } from 'react'

import Layout from '../../components/Layout'
import Loading from '../../elements/Loading'
import usePagination from '../../hooks/usePagination'
import { selectLogin } from '../../redux/adminSlice'
import { useAppSelector } from '../../redux/hooks'

import AdminControlPanel from './AdminControlPanel'
import PostList from './PostList'

const Index: React.FC<RouteComponentProps> = memo(() => {
  const login = useAppSelector(selectLogin)
  const { page, per_page, data, isLoading, error, nextPage, prevPage } =
    usePagination()

  return (
    <Layout
      className="flex flex-col justify-between"
      data-cy="top-page-content-root"
    >
      {error && (
        <div>
          {/* @ts-ignore */}
          <p>Error: {error.message}</p>
        </div>
      )}
      {isLoading || data === undefined ? (
        <Loading />
      ) : (
        <PostList
          postList={data.postList}
          total={data.total}
          page={page}
          per_page={per_page}
          prevPage={prevPage}
          nextPage={nextPage}
        />
      )}
      <AdminControlPanel login={login} />
    </Layout>
  )
})
Index.displayName = 'Index'

export default Index
