import type { UsePagenationResult } from '@/src/components/Pagination/usePagination'

import { API } from '../../redux/API'
import isSuccess from '../../redux/helper/isSuccess'
import { enqueSnackbar } from '../../redux/snackbarSlice'
import { dispatch } from '../../redux/store'

export function handleDelete(
  id: Post['id'],
  refetch: UsePagenationResult['refetch'],
) {
  return async function (): Promise<void> {
    const res = await dispatch(API.endpoints.deletePost.initiate({ id }))

    if (isSuccess(res)) {
      dispatch(enqueSnackbar({ color: 'green', message: 'Delete Successful!' }))
      refetch()
    }
  }
}
