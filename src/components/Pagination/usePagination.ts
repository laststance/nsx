import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

import { API } from '../../redux/API'
import { useAppSelector } from '../../redux/hooks'
import type { PagenationState } from '../../redux/pagenationSlice'
import { selectPagenation } from '../../redux/pagenationSlice'

export interface UsePagenationResult {
  page: PagenationState['page']
  totalPage: PagenationState['totalPage']
  data: Res.PostList | undefined
  error: FetchBaseQueryError | SerializedError | undefined
  refetch: () => void
  isLoading: boolean
}

function usePagination(): UsePagenationResult {
  const { page, perPage, totalPage } = useAppSelector(selectPagenation)
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
