import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

import { assertCast } from '../../../lib/assertCast'
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect'
import { API } from '../../redux/API'
import { useAppSelector } from '../../redux/hooks'
import type { PagenationState } from '../../redux/pagenationSlice'
import { selectPagenationParams, updatePerPage } from '../../redux/pagenationSlice'
import { dispatch } from '../../redux/store'

export interface UsePagenationResult {
  page: PagenationState['page']
  totalPage: PagenationState['totalPage']
  data: Res.PostList | undefined
  error: FetchBaseQueryError | SerializedError | undefined
  refetch: ReturnType<typeof API.endpoints.fetchPostList.useQuery>['refetch']
  isLoading: boolean
}

function usePagination(customPerPage?: PagenationState['perPage']): UsePagenationResult {
  useIsomorphicLayoutEffect(() => {
    if (Number.isSafeInteger(customPerPage)) {
      assertCast<number>(customPerPage) // TypeScript can't detect result of Number.isSafeInteger()
      dispatch(updatePerPage({ perPage: customPerPage }))
    }
  }, [])
  const { page, perPage, totalPage } = useAppSelector(selectPagenationParams)

  const { data, error, refetch, isLoading } = API.endpoints.fetchPostList.useQuery({
    page,
    perPage,
  })

  return {
    data,
    error,
    isLoading,
    page,
    refetch,
    totalPage,
  }
}

export default usePagination
