import type { RouteComponentProps } from '@reach/router'
import React, { memo } from 'react'

import Loading from '../../elements/Loading'
import { assertIsDefined } from '../../lib/assertIsDefined'
import { API } from '../../redux/API'
import NotFound from '../NotFound'

import Content from './Content'
import Error from './Error'
import useFindCachePost from './useFindCachePost'

interface RouterParam {
  // Get query paramerter must be string
  postId: Cast<Post['id'], string>
}

const PostPage: React.FC<RouteComponentProps<RouterParam>> = memo(
  ({ postId }) => {
    assertIsDefined(postId)

    const cache = useFindCachePost(postId)

    const { data, isLoading, error } = API.endpoints.fetchPost.useQuery(
      parseInt(postId),
      /* No Cache then Real Fetch */ { skip: cache !== undefined }
    )

    /* Render with Cache */
    if (cache) return <Content post={cache} />
    if (isLoading) return <Loading />
    if (error) return <Error error={error} />
    if (data) return <Content post={data} />

    return <NotFound />
  }
)
PostPage.displayName = 'PostPage'

export default PostPage
