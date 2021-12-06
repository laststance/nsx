import type { UsePagenationResult } from '../../components/pagination/usePagination'
import { API } from '../../redux/API'
import isSuccess from '../../redux/helper/isSuccess'
import { enqueSnackbar } from '../../redux/snackbarSlice'
import { dispatch } from '../../redux/store'

export function handleDelete(
  id: Post['id'],
  refetch: UsePagenationResult['refetch']
) {
  return async function (): Promise<void> {
    const res = await dispatch(API.endpoints.deletePost.initiate(id))

    if (isSuccess(res) && 'data' in res) {
      dispatch(enqueSnackbar({ message: res.data.message, color: 'green' }))
      refetch()
    }
  }
}
