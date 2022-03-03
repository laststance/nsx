import React, { memo } from 'react'
import { useParams } from 'react-router-dom'

import Loading from '../../components/Loading'
import { assertIsDefined } from '../../lib/assertIsDefined'
import { API } from '../../redux/API'
import NotFound from '../NotFound'

import Content from './Content'
import Error from './Error'
import useCachePost from './useCachePost'

const PostPage: React.FC = memo(() => {
  const { postId } = useParams()
  assertIsDefined(postId)

  const cache = useCachePost(postId)

  const { data, isLoading, error } = API.endpoints.fetchPost.useQuery(
    parseInt(postId),
    /* No Cache then Do Real Fetch */ { skip: cache !== undefined }
  )

  if (cache) return <Content post={cache} />
  if (isLoading) return <Loading />
  if (error) return <Error error={error} />
  if (data) return <Content post={data} />

  return <NotFound />
})
PostPage.displayName = 'PostPage'

export default PostPage
