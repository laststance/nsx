import { selectUser } from '../../../../redux/adminSlice'
import { API } from '../../../../redux/API'
import { selectBody, updateBody } from '../../../../redux/draftSlice'
import { dispatch, getRootState } from '../../../../redux/store'

export function handleClick(
  stock: Stock,
  refetch: ReturnType<typeof API.endpoints.getStockList.useQuery>['refetch'],
) {
  return async () => {
    const user = selectUser(getRootState())
    await dispatch(
      API.endpoints.deleteStock.initiate({ id: stock.id, author: user }),
    )
    // refetch stockList
    refetch()
    // Insert stock web page into the post body
    let body = selectBody(getRootState())
    body += `[${stock.pageTitle}](${stock.url})`
    dispatch(updateBody({ body }))
  }
}
