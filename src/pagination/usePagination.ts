import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

import { API } from '../redux/API'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import type { PageState } from '../redux/pageSlice'
import { selectPage, updatePage } from '../redux/pageSlice'

interface ReturnValues {
  page: PageState['page']
  per_page: PageState['per_page']
  data: PostListResponce | undefined
  error: FetchBaseQueryError | SerializedError | undefined
  refetch: () => void
  isLoading: boolean
  prevPage: DispatchFuction
  nextPage: DispatchFuction
}

function usePagination(): ReturnValues {
  const { page, per_page } = useAppSelector(selectPage)
  const dispatch = useAppDispatch()
  const { data, error, refetch, isLoading } =
    API.endpoints.fetchPostList.useQuery({
      page,
      per_page,
    })
  const prevPage = (page: PageState['page']) => {
    dispatch(updatePage({ page: page - 1 }))
  }
  const nextPage = (page: PageState['page']) => {
    dispatch(updatePage({ page: page + 1 }))
  }

  return { page, per_page, data, error, refetch, isLoading, prevPage, nextPage }
}

export default usePagination
