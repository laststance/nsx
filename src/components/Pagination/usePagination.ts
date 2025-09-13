import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

import { assertCast } from '../../../lib/assertCast'
import { useIsomorphicEffect } from '../../hooks/useIsomorphicEffect'
import { API } from '../../redux/API'
import { useAppSelector } from '../../redux/hooks'
import type { PagenationState } from '../../redux/pagenationSlice'
import {
  selectPagenationParams,
  updatePerPage,
} from '../../redux/pagenationSlice'
import { dispatch } from '../../redux/store'

export interface UsePagenationResult {
  data: Res.PostList | undefined
  error: FetchBaseQueryError | SerializedError | undefined
  isLoading: boolean
  page: PagenationState['page']
  refetch: ReturnType<typeof API.endpoints.fetchPostList.useQuery>['refetch']
  totalPage: PagenationState['totalPage']
}

export interface UseTweetPagenationResult {
  data: Res.TweetList | undefined
  error: FetchBaseQueryError | SerializedError | undefined
  isLoading: boolean
  page: PagenationState['page']
  refetch: ReturnType<typeof API.endpoints.fetchTweetList.useQuery>['refetch']
  totalPage: PagenationState['totalPage']
}

function usePagination(
  customPerPage?: PagenationState['perPage'],
): UsePagenationResult {
  useIsomorphicEffect(() => {
    if (Number.isSafeInteger(customPerPage)) {
      assertCast<number>(customPerPage) // TypeScript can't detect result of Number.isSafeInteger()
      dispatch(updatePerPage({ perPage: customPerPage }))
    }
  }, [])
  const { page, perPage, totalPage } = useAppSelector(selectPagenationParams)

  const { data, error, isLoading, refetch } =
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

export function useTweetPagination(
  customPerPage?: PagenationState['perPage'],
): UseTweetPagenationResult {
  useIsomorphicEffect(() => {
    if (Number.isSafeInteger(customPerPage)) {
      assertCast<number>(customPerPage) // TypeScript can't detect result of Number.isSafeInteger()
      dispatch(updatePerPage({ perPage: customPerPage }))
    }
  }, [])
  const { page, perPage, totalPage } = useAppSelector(selectPagenationParams)

  const { data, error, isLoading, refetch } =
    API.endpoints.fetchTweetList.useQuery({
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
