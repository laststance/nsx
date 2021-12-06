import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

import { API } from '../../redux/API'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import type { PageState } from '../../redux/pageSlice'
import { selectPage, updatePage } from '../../redux/pageSlice'
import type { AppDispatch } from '../../redux/store'

export interface UsePagenationResult {
  page: PageState['page']
  totalPage: PageState['totalPage']
  data: PostListResponce | undefined
  error: FetchBaseQueryError | SerializedError | undefined
  refetch: () => void
  isLoading: boolean
  dispatch: AppDispatch
  prevPage: (dispatch: AppDispatch, page: PageState['page']) => void
  nextPage: (dispatch: AppDispatch, page: PageState['page']) => void
}

const prevPage: UsePagenationResult['prevPage'] = (dispatch, page) => {
  dispatch(updatePage({ page: page - 1 }))
}
const nextPage: UsePagenationResult['nextPage'] = (dispatch, page) => {
  dispatch(updatePage({ page: page + 1 }))
}

function usePagination(): UsePagenationResult {
  const { page, perPage, totalPage } = useAppSelector(selectPage)
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
