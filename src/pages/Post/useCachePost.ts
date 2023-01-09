import { assertIsDefined } from '../../../lib/assertIsDefined'
import { API } from '../../redux/API'
import { useAppSelector } from '../../redux/hooks'
import { selectPagenationParams } from '../../redux/pagenationSlice'

const useCachePost = (postId: Post['id']): Post | undefined => {
  assertIsDefined(postId)
  const { page, perPage } = useAppSelector(selectPagenationParams)
  const { cache } = API.endpoints.fetchPostList.useQueryState(
    {
      page,
      perPage,
    },
    {
      selectFromResult: (state) => {
        if (state.data === undefined) return { cache: undefined }

        const cache = state.data.postList.find((post) => {
          return post.id === postId
        })
        // eslint-disable-next-line prettier/prettier
        const hitCache = (cache !== undefined && !!cache.id && !!cache.title && !!cache.body)
        if (hitCache === true) {
          return { cache }
        } else {
          return { cache: undefined }
        }
      },
    }
  )
  return cache
}

export default useCachePost
