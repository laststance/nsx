import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

import { API } from '../../redux/API'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import type { PagenationState } from '../../redux/pagenationSlice'
import { selectPagenation, updatePage } from '../../redux/pagenationSlice'
import type { AppDispatch } from '../../redux/store'

export interface UsePagenationResult {
  page: PagenationState['page']
  totalPage: PagenationState['totalPage']
  data: PostListResponce | undefined
  error: FetchBaseQueryError | SerializedError | undefined
  refetch: () => void
  isLoading: boolean
  dispatch: AppDispatch
  prevPage: (dispatch: AppDispatch, page: PagenationState['page']) => void
  nextPage: (dispatch: AppDispatch, page: PagenationState['page']) => void
}

const prevPage: UsePagenationResult['prevPage'] = (dispatch, page) => {
  dispatch(updatePage({ page: page - 1 }))
}
const nextPage: UsePagenationResult['nextPage'] = (dispatch, page) => {
  dispatch(updatePage({ page: page + 1 }))
}

function usePagination(): UsePagenationResult {
  const { page, perPage, totalPage } = useAppSelector(selectPagenation)
  const dispatch = useAppDispatch()
  const { data, error, refetch, isLoading } =
    API.endpoints.fetchPostList.useQuery({
      page,
      perPage,
    })

  return {
    page,
    totalPage,
    data,
    error,
    refetch,
    isLoading,
    dispatch,
    prevPage,
    nextPage,
  }
}

export default usePagination
