import { assertIsDefined } from '../../lib/assertIsDefined'
import { API } from '../../redux/API'
import { useAppSelector } from '../../redux/hooks'
import { selectPage } from '../../redux/pageSlice'

/**
 * @OneOffHook src/pages/Post/index.tsx
 */
const useCachePost = (postId: Cast<Post['id'], string>): Post | undefined => {
  assertIsDefined(postId)
  const { page, perPage } = useAppSelector(selectPage)
  const { cache } = API.endpoints.fetchPostList.useQueryState(
    {
      page,
      perPage,
    },
    {
      selectFromResult: (state) => {
        if (state.data === undefined) return { cache: undefined }

        const cache = state.data.postList.find((post) => {
          return post.id === parseInt(postId)
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
