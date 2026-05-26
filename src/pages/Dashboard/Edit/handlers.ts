import type { UseFormGetValues } from 'react-hook-form'
import type { NavigateFunction } from 'react-router'

import type { FormInput } from '../../../redux/draftSlice'
import isSuccess from '../../../redux/helper/isSuccess'
import { enqueSnackbar } from '../../../redux/snackbarSlice'
import type { AppDispatch } from '../../../redux/store'

export async function onSubmit(
  updatePost: AnyFunction, // @TODO refactor to certain types
  getValues: UseFormGetValues<FormInput>,
  navigate: NavigateFunction,
  id: Post['id'],
  dispatch: AppDispatch,
) {
  const response = await updatePost({
    id: id,
    title: getValues('title'),
    body: getValues('body'),
  })

  if (isSuccess(response) && 'data' in response) {
    dispatch(enqueSnackbar({ color: 'green', message: response.data.message }))

    navigate(`/post/${id}`)
  }
}
