import { navigate } from '@reach/router'
import type {
  FetchBaseQueryError,
  // @ts-expect-error TS2305: Module '"@reduxjs/toolkit/query"' has no exported member 'SerializedError'.
  SerializedError,
} from '@reduxjs/toolkit/query'
import type React from 'react'
import { useEffect, useState } from 'react'

import { assertIsFetchBaseQueryError } from '../../lib/assertIsFetchBaseQueryError'
import { useUpdatePostMutation } from '../../redux/API'
import { useAppDispatch } from '../../redux/hooks'
import { enqueSnackbar } from '../../redux/snackbarSlice'

const useEditEffect = (
  id: Post['id'],
  data: { title: Post['title']; body: Post['body'] } | undefined,
  error: FetchBaseQueryError | SerializedError | undefined
): {
  title: Post['title']
  body: Post['body']
  handleChange: AnyFunction
  handleEdit: AnyFunction
} => {
  useEffect(() => {
    if (error) {
      dispatch(enqueSnackbar({ message: JSON.stringify(error), color: 'red' }))
    }
  }, [error])

  const [updatePost] = useUpdatePostMutation()
  // @TODO Save Draft text in the Redux
  const [title, setTitle] = useState<Post['title']>(data?.title || 'Loading...')
  const [body, setBody] = useState<Post['body']>(data?.body || 'Loading...')
  const dispatch = useAppDispatch()

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
    try {
      const response = await updatePost({
        title,
        body,
        id,
      }).unwrap()

      dispatch(enqueSnackbar({ message: response.message, color: 'green' }))

      navigate(`/post/${id}`)
    } catch (error: unknown) {
      assertIsFetchBaseQueryError(error)
      // @ts-ignore
      dispatch(enqueSnackbar({ message: error.status, color: 'red' }))
    }
  }

  return { title, body, handleChange, handleEdit }
}

export default useEditEffect
