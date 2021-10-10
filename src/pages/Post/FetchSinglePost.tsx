import React, { memo, useEffect } from 'react'

import Layout from '../../components/Layout'
import Loading from '../../elements/Loading'
import type { AdminState } from '../../redux/adminSlice'
import { useFetchPostQuery } from '../../redux/API'
import { useAppDispatch } from '../../redux/hooks'
import { enqueSnackbar } from '../../redux/snackbarSlice'

import Body from './Body'

interface Props {
  postId: Post['id']
  login: AdminState['login']
}

const FetchSinglePost: React.FC<Props> = memo(({ postId, login }) => {
  const dispatch = useAppDispatch()

  const { data: post, isLoading, error } = useFetchPostQuery(postId)
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
  return <Body post={post} login={login} />
})
FetchSinglePost.displayName = 'FetchSinglePost'

export default FetchSinglePost
