import type { UsePagenationResult } from '../../components/Pagination/usePagination'
import type { AdminState } from '../../redux/adminSlice'
import { API } from '../../redux/API'
import isSuccess from '../../redux/helper/isSuccess'
import { enqueSnackbar } from '../../redux/snackbarSlice'
import { dispatch } from '../../redux/store'

export function handleDelete(
  id: Post['id'],
  author: AdminState['author'],
  refetch: UsePagenationResult['refetch'],
) {
  return async function (): Promise<void> {
    const res = await dispatch(
      API.endpoints.deletePost.initiate({ id, author }),
    )

    if (isSuccess(res) && 'data' in res) {
      dispatch(enqueSnackbar({ color: 'green', message: res.data.message }))
      refetch()
    }
  }
}
