import type { RouteComponentProps } from '@reach/router'
import { navigate } from '@reach/router'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import React, { useEffect, useState } from 'react'

import type { Post } from '../../types'
import Layout from '../components/Layout'
import Button from '../elements/Button'
import { useFetchPostQuery, useUpdatePostMutation } from '../redux/API'
import { useAppDispatch } from '../redux/hooks'
import { enque } from '../redux/snackbarSlice'

interface RouteParam {
  postId: Post['id']
}

const Edit: React.FC<RouteComponentProps<RouteParam>> = ({ postId }) => {
  // @TODO is useful Partial remove undefined from libdef?
  const id = postId as Post['id']

  const { data, error } = useFetchPostQuery(id) as {
    error: FetchBaseQueryError
    data: Post
  }
  const [updatePost] = useUpdatePostMutation()
  const [title, setTitle] = useState<Post['title']>('')
  const [body, setBody] = useState<Post['body']>('')
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (error) {
      dispatch(enque({ message: JSON.stringify(error), color: 'red' }))
    } else {
      setTitle(data.title)
      setBody(data.body)
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

      dispatch(enque({ message: response.message, color: 'green' }))

      navigate(`/post/${postId}`)

      // @ts-ignore disabled TS1196: Catch clause variable type annotation must be 'any' or 'unknown' if specified.
    } catch (error: FetchBaseQueryError) {
      dispatch(enque({ message: error.status, color: 'red' }))
    }
  }

  return (
    <Layout className="flex flex-col justify-start">
      <input
        type="text"
        className="mt-3"
        value={title}
        onChange={(e) => handleChange(e, setTitle)}
      />
      <textarea
        className="w-full h-60 mt-3"
        value={body}
        onChange={(e) => handleChange(e, setBody)}
      />
      <div className="flex justify-end pt-8">
        <Button onClick={handleEdit} variant="primary">
          Update
        </Button>
      </div>
    </Layout>
  )
}

export default React.memo(Edit)
