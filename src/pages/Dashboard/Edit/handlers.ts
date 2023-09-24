import type { UseFormGetValues } from 'react-hook-form'
import type { NavigateFunction } from 'react-router-dom'

import type { AdminState } from '../../../redux/adminSlice'
import type { FormInput } from '../../../redux/draftSlice'
import isSuccess from '../../../redux/helper/isSuccess'
import { enqueSnackbar } from '../../../redux/snackbarSlice'
import type { AppDispatch } from '../../../redux/store'

export async function onSubmit(
  updatePost: AnyFunction, // @TODO refactor to certain types
  author: AdminState['author'], // @TODO remove after remove author from updatePost mutation
  getValues: UseFormGetValues<FormInput>,
  navigate: NavigateFunction,
  id: Post['id'],
  dispatch: AppDispatch,
) {
  const response = await updatePost({
    id: id,
    title: getValues('title'),
    author: author,
    body: getValues('body'),
  })

  if (isSuccess(response) && 'data' in response) {
    dispatch(enqueSnackbar({ color: 'green', message: response.data.message }))

    navigate(`/post/${id}`)
  }
}
