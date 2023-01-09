import type { SerializedError } from '@reduxjs/toolkit'
import type { QueryActionCreatorResult } from '@reduxjs/toolkit/dist/query/core/buildInitiate'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

import { assertCast } from '../../../lib/assertCast'
import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect'
import { API } from '../../redux/API'
import { useAppSelector } from '../../redux/hooks'
import type { PagenationParamsState } from '../../redux/pagenationSlice'
import {
  selectPagenationParams,
  updatePerPage,
} from '../../redux/pagenationSlice'
import { dispatch } from '../../redux/store'

export interface UsePagenationResult {
  page: PagenationParamsState['page']
  totalPage: PagenationParamsState['totalPage']
  data: Res.PostList | undefined
  error: FetchBaseQueryError | SerializedError | undefined
  refetch: QueryActionCreatorResult<_>['refetch']
  isLoading: boolean
}

function usePagination(
  customPerPage?: PagenationParamsState['perPage']
): UsePagenationResult {
  useIsomorphicLayoutEffect(() => {
    if (Number.isSafeInteger(customPerPage)) {
      assertCast<number>(customPerPage) // TypeScript can't detect result of Number.isSafeInteger()
      dispatch(updatePerPage({ perPage: customPerPage }))
    }
  }, [])
  const { page, perPage, totalPage } = useAppSelector(selectPagenationParams)

  const { data, error, refetch, isLoading } =
    API.endpoints.fetchPostList.useQuery({
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
