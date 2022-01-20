/* eslint-disable */
import type { MutationTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks'
import type {
  MutationDefinition,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query'
import type React from 'react'
import type { NavigateFunction } from 'react-router-dom'
/* eslint-enable */

import type { AdminState } from '../../redux/adminSlice'
import { loading, loaded } from '../../redux/applicationSlice'
import type { DraftState } from '../../redux/draftSlice'
import { updateBody, updateTitle, clearDraft } from '../../redux/draftSlice'
import isSuccess from '../../redux/helper/isSuccess'
import { enqueSnackbar } from '../../redux/snackbarSlice'
import { dispatch } from '../../redux/store'
import type { AppDispatch } from '../../redux/store'

export const handleTitleChange = (
  e: React.ChangeEvent<HTMLInputElement>
): void => {
  e.preventDefault()
  dispatch(updateTitle({ title: e.target.value }))
}

export const handleBodyChange = (
  e: React.ChangeEvent<HTMLTextAreaElement>
): void => {
  e.preventDefault()
  dispatch(updateBody({ body: e.target.value }))
}

export async function handleSubmit(
  createPost: MutationTrigger<
    MutationDefinition<
      CreatePostRequest,
      BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError,
        {},
        FetchBaseQueryMeta
      >,
      'Posts',
      Post,
      'RTK_Query'
    >
  >,
  title: DraftState['title'],
  body: DraftState['body'],
  author: AdminState['author'],
  dispatch: AppDispatch,
  navigate: NavigateFunction
) {
  dispatch(loading())
  const post = await createPost({
    title,
    body,
    author,
  })
  if (isSuccess(post) && 'data' in post) {
    dispatch(loaded())
    dispatch(enqueSnackbar({ message: 'New Post Created!', color: 'green' }))
    dispatch(clearDraft())

    navigate(`/post/${post.data.id}`)
  }
  dispatch(loaded())
}
