import { navigate } from '@reach/router'
import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type React from 'react'
import { useEffect, useState } from 'react'

import { selectAuthor } from '../../redux/adminSlice'
import { API } from '../../redux/API'
import isSuccess from '../../redux/helper/isSuccess'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { enqueSnackbar } from '../../redux/snackbarSlice'

const useEditEffect = (
  id: Post['id'],
  data: { title: Post['title']; body: Post['body'] } | undefined,
  error: FetchBaseQueryError | SerializedError | undefined
): {
  title: Post['title']
  body: Post['body']
  handleChange: StateUpdator
  handleEdit: MutationFunction
} => {
  useEffect(() => {
    if (error) {
      dispatch(enqueSnackbar({ message: JSON.stringify(error), color: 'red' }))
    }
  }, [error])

  const [updatePost] = API.endpoints.updatePost.useMutation()
  // @TODO Edit Cancel Feature
  // @TODO Save Draft text in the Redux
  const [title, setTitle] = useState<Post['title']>(data?.title || 'Loading...')
  const [body, setBody] = useState<Post['body']>(data?.body || 'Loading...')
  const dispatch = useAppDispatch()
  const author = useAppSelector(selectAuthor)

  useEffect(() => {
    setTitle(data?.title || 'Loading...')
  }, [data?.title])

  useEffect(() => {
    setBody(data?.body || 'Loading...')
  }, [data?.body])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    key: keyof { title: Post['title']; body: Post['body'] }
  ): void {
    e.preventDefault()
    switch (key) {
      case 'title':
        setTitle(e.target.value)
        return
      case 'body':
        setBody(e.target.value)
        return
      default:
        throw new Error('Key must be "title"|"body"')
    }
  }

  async function handleEdit() {
    const response = await updatePost({
      title,
      body,
      id,
      author,
    })

    if (isSuccess(response) && 'data' in response) {
      dispatch(
        enqueSnackbar({ message: response.data.message, color: 'green' })
      )

      navigate(`/post/${id}`)
    }
  }

  return { title, body, handleChange, handleEdit }
}

export default useEditEffect
