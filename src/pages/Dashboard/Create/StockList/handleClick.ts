// Insert stock web page into the post body
import type { QueryActionCreatorResult } from '@reduxjs/toolkit/dist/query/core/buildInitiate'

import { selectAuthor } from '../../../../redux/adminSlice'
import { API } from '../../../../redux/API'
import { selectBody, updateBody } from '../../../../redux/draftSlice'
import { dispatch, getRootState } from '../../../../redux/store'

export function handleClick(
  stock: Stock,
  refetch: QueryActionCreatorResult<_>['refetch']
) {
  return async () => {
    const author = selectAuthor(getRootState())
    await dispatch(API.endpoints.deleteStock.initiate({ author, id: stock.id }))
    // refetch stockList
    refetch()
    let body = selectBody(getRootState())
    body += `[${stock.pageTitle}](${stock.url})`
    dispatch(updateBody({ body }))
  }
}
