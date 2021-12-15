import type React from 'react'

import { updateBody, updateTitle } from '../../redux/draftSlice'
import { dispatch } from '../../redux/store'

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
