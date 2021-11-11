import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

import { API } from '../redux/API'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import type { PageState } from '../redux/pageSlice'
import { selectPage, updatePage } from '../redux/pageSlice'
import type { AppDispatch } from '../redux/store'

export interface usePagenationResult {
  page: PageState['page']
  per_page: PageState['per_page']
  data: PostListResponce | undefined
  error: FetchBaseQueryError | SerializedError | undefined
  refetch: () => void
  isLoading: boolean
  dispatch: AppDispatch
  prevPage: (dispatch: AppDispatch, page: PageState['page']) => void
  nextPage: (dispatch: AppDispatch, page: PageState['page']) => void
}

function usePagination(): usePagenationResult {
  const { page, per_page } = useAppSelector(selectPage)
  const dispatch = useAppDispatch()
  const { data, error, refetch, isLoading } =
    API.endpoints.fetchPostList.useQuery({
      page,
      per_page,
    })
  const prevPage: usePagenationResult['prevPage'] = (dispatch, page) => {
    dispatch(updatePage({ page: page - 1 }))
  }
  const nextPage: usePagenationResult['nextPage'] = (dispatch, page) => {
    dispatch(updatePage({ page: page + 1 }))
  }

  return {
    page,
    per_page,
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
