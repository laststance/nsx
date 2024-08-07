import type { ChangeEvent } from 'react'
import type { NavigateFunction } from 'react-router-dom'

import type { AdminState } from '../../../redux/adminSlice'
import type { API } from '../../../redux/API'
import type { DraftState } from '../../../redux/draftSlice'
import { updateBody, updateTitle, clearDraft } from '../../../redux/draftSlice'
import isSuccess from '../../../redux/helper/isSuccess'
import { enqueSnackbar } from '../../../redux/snackbarSlice'
import { dispatch } from '../../../redux/store'

export const handleTitleChange = (e: ChangeEvent<HTMLInputElement>): void => {
  e.preventDefault()
  dispatch(updateTitle({ title: e.target.value }))
}

export const handleBodyChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
  e.preventDefault()
  dispatch(updateBody({ body: e.target.value }))
}

export async function onSubmit(
  createPost: ReturnType<typeof API.endpoints.createPost.useMutation>[0],
  title: DraftState['title'],
  body: DraftState['body'],
  author: AdminState['author'],
  navigate: NavigateFunction,
) {
  const post = await createPost({
    title,
    author,
    body,
  })
  // @TODO Rewrite mutation error handling flow
  if (isSuccess(post) && 'data' in post) {
    dispatch(enqueSnackbar({ color: 'green', message: 'New Post Created!' }))
    dispatch(clearDraft())

    navigate(`/post/${post.data?.id}`)
  }
}
