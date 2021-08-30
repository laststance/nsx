import type { RouteComponentProps } from '@reach/router'
import React from 'react'

import type { Posts } from '../../../types'
import Layout from '../../components/Layout'
import Loading from '../../elements/Loading'
import { selectLogin } from '../../redux/adminSlice'
import { API } from '../../redux/API'
import { useAppSelector } from '../../redux/hooks'

import AdminControlPanel from './AdminControlPanel'
import PostList from './PostList'

const Index: React.FC<RouteComponentProps> = () => {
  const login = useAppSelector(selectLogin)
  const { data, error, isLoading } = API.endpoints.fetchAllPosts.useQuery()

  return (
    <Layout className="flex flex-col justify-between" data-cy="topPage">
      {isLoading ? <Loading /> : <PostList posts={data as Posts} />}
      {error && (
        <div>
          {/* @ts-ignore */}
          <p>Error: {error.message}</p>
        </div>
      )}
      <AdminControlPanel login={login} />
    </Layout>
  )
}

export default React.memo(Index)
