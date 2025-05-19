import React, { memo } from 'react'
import { useParams } from 'react-router'

import { AppError } from '@/src/components/AppError'
import Loading from '@/src/components/Loading'

import { assertIsDefined } from '../../../lib/assertIsDefined'
import { API } from '../../redux/API'
import NotFound from '../NotFound'

import Content from './Content'
import useCachePost from './useCachePost'

const PostPage: React.FC = memo(() => {
  // @TODO extract as a useQueryStringToNumber
  const { postId_querystring } = useParams()
  assertIsDefined(postId_querystring)
  const postId: Post['id'] = parseInt(postId_querystring, 10)

  const cache = useCachePost(postId)

  const { data, error, isLoading } = API.endpoints.fetchPost.useQuery(
    postId,
    /* No Cache then Do Real Fetch */ { skip: cache !== undefined },
  )

  // show post without fetch request
  if (cache) return <Content post={cache} />

  if (isLoading) return <Loading />
  if (error) return <AppError error={error} />
  if (data) return <Content post={data} />

  return <NotFound />
})
PostPage.displayName = 'PostPage'

export default PostPage
