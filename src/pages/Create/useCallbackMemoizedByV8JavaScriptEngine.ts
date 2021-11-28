import type React from 'react'

import { updateBody, updateTitle } from '../../redux/draftSlice'
import type { AppDispatch } from '../../redux/store'

// export const handleTitleChange = function (
//   e: React.ChangeEvent<HTMLInputElement>
// ) {
//   return function (dispatch: AppDispatch): ReturnType<AppDispatch> {
//     e.preventDefault()
//     return dispatch(updateTitle({ title: e.target.value }))
//   }
// }
//
// export const handleBodyChange = function (
//   e: React.ChangeEvent<HTMLTextAreaElement>
// ) {
//   return function (dispatch: AppDispatch): ReturnType<AppDispatch> {
//     e.preventDefault()
//     return dispatch(updateBody({ body: e.target.value }))
//   }
// }

export const handleTitleChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  dispatch: AppDispatch
): void => {
  e.preventDefault()
  dispatch(updateTitle({ title: e.target.value }))
}

export const handleBodyChange = (
  e: React.ChangeEvent<HTMLTextAreaElement>,
  dispatch: AppDispatch
): void => {
  e.preventDefault()
  dispatch(updateBody({ body: e.target.value }))
}
