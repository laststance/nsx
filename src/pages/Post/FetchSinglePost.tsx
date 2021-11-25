import React, { memo, useEffect } from 'react'

import Layout from '../../components/Layout'
import Loading from '../../elements/Loading'
import type { AdminState } from '../../redux/adminSlice'
import { API } from '../../redux/API'
import { useAppDispatch } from '../../redux/hooks'
import { enqueSnackbar } from '../../redux/snackbarSlice'

import Content from './Content'

interface Props {
  postId: Post['id']
  login: AdminState['login']
}

const FetchSinglePost: React.FC<Props> = memo(({ postId, login }) => {
  const dispatch = useAppDispatch()
  const {
    data: post,
    isLoading,
    error,
  } = API.endpoints.fetchPost.useQuery(postId)

  useEffect(() => {
    if (error)
      dispatch(enqueSnackbar({ message: error.toString(), color: 'red' }))
  }, [error])

  if (isLoading || post === undefined) {
    return (
      <Layout>
        <Loading />
      </Layout>
    )
  }
  return <Content post={post} login={login} />
})
FetchSinglePost.displayName = 'FetchSinglePost'

export default FetchSinglePost
