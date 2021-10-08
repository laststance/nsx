/* eslint-disable react-hooks/rules-of-hooks */
// this eslint disable is only for guard statment "if (postId === undefined) return <Loading />"
// @TODO Can I Only Apply "React Hook "useFooBar" is called conditionally." error somehow?
import type { RouteComponentProps } from '@reach/router'
import { navigate } from '@reach/router'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import React, { useEffect, useState, memo } from 'react'

import type { Post } from '../../@types/app'
import Layout from '../components/Layout'
import Button from '../elements/Button'
import Loading from '../elements/Loading'
import { useFetchPostQuery, useUpdatePostMutation } from '../redux/API'
import { useAppDispatch } from '../redux/hooks'
import { enqueSnackbar } from '../redux/snackbarSlice'

interface RouteParam {
  postId: Post['id']
}

const Edit: React.FC<RouteComponentProps<RouteParam>> = memo(({ postId }) => {
  if (postId === undefined) return <Loading />
  const id = postId

  const { data, isLoading, error } = useFetchPostQuery(id) as {
    error: FetchBaseQueryError
    isLoading: boolean
    data: Post
  }

  const [updatePost] = useUpdatePostMutation()
  // @TODO Save Draft text in the Redux
  const [title, setTitle] = useState<Post['title']>('')
  const [body, setBody] = useState<Post['body']>('')
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (error) {
      dispatch(enqueSnackbar({ message: JSON.stringify(error), color: 'red' }))
    } else {
      setTitle(data?.title)
      setBody(data?.body)
    }
  }, [data, error, dispatch])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    cb: React.Dispatch<React.SetStateAction<Post['title'] | Post['body']>>
  ): void {
    e.preventDefault()
    cb(e.target.value)
  }

  async function handleEdit() {
    try {
      const response = await updatePost({
        title,
        body,
        id,
      }).unwrap()

      dispatch(enqueSnackbar({ message: response.message, color: 'green' }))

      navigate(`/post/${postId}`)

      // @ts-ignore disabled TS1196: Catch clause variable type annotation must be 'any' or 'unknown' if specified.
    } catch (error: FetchBaseQueryError) {
      dispatch(enqueSnackbar({ message: error.status, color: 'red' }))
    }
  }

  if (isLoading) return <Loading />

  return (
    <Layout className="flex flex-col justify-start">
      <input
        type="text"
        className="mt-3"
        value={title}
        onChange={(e) => handleChange(e, setTitle)}
        data-cy="edit-title-input"
      />
      <textarea
        className="w-full h-60 mt-3"
        value={body}
        onChange={(e) => handleChange(e, setBody)}
        data-cy="edit-body-input"
      />
      <div className="flex justify-end pt-8">
        <Button onClick={handleEdit} variant="secondary" data-cy="update-btn">
          Update
        </Button>
      </div>
    </Layout>
  )
})

export default Edit
