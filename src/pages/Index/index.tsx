import type { RouteComponentProps } from '@reach/router'
import React, { memo } from 'react'

import Layout from '../../components/Layout'
import Loading from '../../elements/Loading'
import { selectLogin } from '../../redux/adminSlice'
import { API } from '../../redux/API'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { selectPage, updatePage } from '../../redux/pageSlice'

import AdminControlPanel from './AdminControlPanel'
import PostList from './PostList'

const Index: React.FC<RouteComponentProps> = memo(() => {
  const login = useAppSelector(selectLogin)
  const { page, per_page } = useAppSelector(selectPage)
  const dispatch = useAppDispatch()
  const { data, error, isLoading } = API.endpoints.fetchPostList.useQuery({
    page,
    per_page,
  })
  const prevPage = (page: number) => {
    dispatch(updatePage({ page: page - 1 }))
  }
  const nextPage = (page: number) => {
    dispatch(updatePage({ page: page + 1 }))
  }

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
